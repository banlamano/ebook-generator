import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save, Download, FileText, Edit3, Eye, Trash2, RefreshCw } from 'lucide-react';

const EbookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadEbook();
    const interval = setInterval(loadEbook, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (selectedChapter) {
      setEditedContent(selectedChapter.content || '');
    }
  }, [selectedChapter]);

  const loadEbook = async () => {
    try {
      const response = await axios.get(`/api/ebooks/${id}`);
      setEbook(response.data.data);
      
      if (!selectedChapter && response.data.data.chapters.length > 0) {
        setSelectedChapter(response.data.data.chapters[0]);
      } else if (selectedChapter) {
        const updatedChapter = response.data.data.chapters.find(c => c.id === selectedChapter.id);
        if (updatedChapter) {
          setSelectedChapter(updatedChapter);
        }
      }
    } catch (error) {
      toast.error('Failed to load ebook');
      navigate('/my-ebooks');
    } finally {
      setLoading(false);
    }
  };

  const saveChapter = async () => {
    if (!selectedChapter) return;
    
    setSaving(true);
    try {
      await axios.put(`/api/ebooks/${id}/chapters/${selectedChapter.id}`, {
        content: editedContent
      });
      toast.success('Chapter saved successfully');
      loadEbook();
    } catch (error) {
      toast.error('Failed to save chapter');
    } finally {
      setSaving(false);
    }
  };

  const regenerateChapter = async (chapterId) => {
    if (!window.confirm('This will replace the current chapter content. Continue?')) return;
    
    try {
      toast.loading('Regenerating chapter...', { id: 'regen' });
      await axios.post(`/api/ebooks/${id}/generate-chapter`, { chapterId });
      toast.success('Chapter regenerated successfully', { id: 'regen' });
      loadEbook();
    } catch (error) {
      toast.error('Failed to regenerate chapter', { id: 'regen' });
    }
  };

  const exportEbook = async (format) => {
    try {
      toast.loading(`Exporting to ${format.toUpperCase()}...`, { id: 'export' });
      const response = await axios.post(`/api/ebooks/${id}/export`, { format });
      const downloadUrl = response.data.data.downloadUrl;
      
      window.open(downloadUrl, '_blank');
      toast.success(`Ebook exported successfully`, { id: 'export' });
    } catch (error) {
      toast.error('Failed to export ebook', { id: 'export' });
    }
  };

  const deleteEbook = async () => {
    if (!window.confirm('Are you sure you want to delete this ebook? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`/api/ebooks/${id}`);
      toast.success('Ebook deleted successfully');
      navigate('/my-ebooks');
    } catch (error) {
      toast.error('Failed to delete ebook');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading ebook..." />
      </div>
    );
  }

  if (!ebook) {
    return null;
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ebook.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ebook.status === 'completed' ? 'bg-green-100 text-green-800' :
                  ebook.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                  ebook.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ebook.status}
                </span>
                {ebook.status === 'generating' && (
                  <span className="text-sm text-gray-600">
                    {ebook.generation_progress}% complete
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Edit' : 'Preview'}</span>
              </button>

              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-10">
                  <button onClick={() => exportEbook('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Export as PDF
                  </button>
                  <button onClick={() => exportEbook('epub')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Export as EPUB
                  </button>
                  <button onClick={() => exportEbook('mobi')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Export as MOBI
                  </button>
                  <button onClick={() => exportEbook('docx')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Export as DOCX
                  </button>
                </div>
              </div>

              <button
                onClick={deleteEbook}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Chapters Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chapters</h2>
              <div className="space-y-2">
                {ebook.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedChapter?.id === chapter.id
                        ? 'bg-indigo-50 border-2 border-indigo-600'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {index + 1}. {chapter.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {chapter.word_count} words
                        </p>
                      </div>
                      <div className="ml-2">
                        {chapter.status === 'generating' && (
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {chapter.status === 'completed' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor/Preview */}
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {selectedChapter && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedChapter.title}</h2>
                    <div className="flex items-center space-x-2">
                      {!showPreview && (
                        <>
                          <button
                            onClick={saveChapter}
                            disabled={saving}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={() => regenerateChapter(selectedChapter.id)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Regenerate</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!showPreview ? (
                    <div className="mt-4">
                      <ReactQuill
                        theme="snow"
                        value={editedContent}
                        onChange={setEditedContent}
                        modules={modules}
                        className="h-96"
                      />
                    </div>
                  ) : (
                    <div className="prose max-w-none mt-4">
                      <div dangerouslySetInnerHTML={{ __html: selectedChapter.content || '' }} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookEditor;
