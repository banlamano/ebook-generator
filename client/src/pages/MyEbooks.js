import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const MyEbooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadEbooks = React.useCallback(async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      
      const response = await apiClient.get('/api/ebooks', { params });
      setEbooks(response.data.data);
    } catch (error) {
      toast.error('Failed to load ebooks');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadEbooks();
  }, [loadEbooks]);

  const deleteEbook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ebook?')) return;
    
    try {
      await apiClient.delete(`/api/ebooks/${id}`);
      toast.success('Ebook deleted successfully');
      loadEbooks();
    } catch (error) {
      toast.error('Failed to delete ebook');
    }
  };

  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading ebooks..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Ebooks</h1>
            <p className="text-gray-600 mt-2">Manage and edit your ebook collection</p>
          </div>
          <Link
            to="/create-ebook"
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Ebook</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="generating">Generating</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ebooks Grid */}
        {filteredEbooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus ? 'No ebooks found' : 'No ebooks yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus 
                ? 'Try adjusting your search or filters' 
                : 'Create your first ebook to get started!'}
            </p>
            {!searchTerm && !filterStatus && (
              <Link
                to="/create-ebook"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Create Your First Ebook
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEbooks.map((ebook) => (
              <div
                key={ebook.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ebook.status === 'completed' ? 'bg-green-100 text-green-800' :
                      ebook.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                      ebook.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ebook.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ebook.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {ebook.topic}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{ebook.num_chapters} chapters</span>
                    <span>{ebook.total_words} words</span>
                  </div>

                  {ebook.status === 'generating' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Generating...</span>
                        <span>{ebook.generation_progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${ebook.generation_progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/ebook/${ebook.id}/edit`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => deleteEbook(ebook.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Created {new Date(ebook.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyEbooks;
