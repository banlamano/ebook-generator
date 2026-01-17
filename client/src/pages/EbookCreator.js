import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../config/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, ArrowRight, ArrowLeft, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EbookCreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Chapter limits based on subscription
  const isPremium = user?.subscription_tier === 'pro' || user?.subscription_tier === 'enterprise';
  const maxChapters = isPremium ? 100 : 50;
  const maxWordsPerChapter = isPremium ? 10000 : 5000;
  
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    description: '',
    num_chapters: 10,
    words_per_chapter: 1000,
    tone: 'professional',
    target_audience: '',
    language: 'English',
    template_id: null,
    chapter_titles: [],
    cover_image: null
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  // Apply template when navigating from Templates page
  useEffect(() => {
    if (location.state?.templateId && templates.length > 0) {
      const template = templates.find(t => t.id === location.state.templateId);
      if (template) {
        applyTemplate(template);
      }
    }
  }, [location.state, templates]);

  const loadTemplates = async () => {
    try {
      const response = await apiClient.get('/templates');
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const applyTemplate = (template) => {
    setSelectedTemplate(template);
    
    // Parse the template structure
    const structure = template.structure || {};
    const chapters = structure.chapters || [];
    
    // Generate a suggested title based on template name
    const suggestedTitle = template.name.includes('Guide') || template.name.includes('Book') 
      ? template.name 
      : `The Complete ${template.name}`;
    
    setFormData(prev => ({
      ...prev,
      template_id: template.id,
      title: prev.title || suggestedTitle, // Auto-fill title if empty
      topic: template.category || prev.topic,
      description: template.description || prev.description,
      num_chapters: chapters.length || prev.num_chapters,
      words_per_chapter: structure.words_per_chapter || prev.words_per_chapter,
      tone: structure.tone || prev.tone,
      chapter_titles: chapters,
      cover_image: template.preview_image || null
    }));

    toast.success(`Template "${template.name}" applied! You can customize the title and details.`);
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
    setFormData(prev => ({
      ...prev,
      template_id: null,
      chapter_titles: []
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.topic) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/ebooks', formData);
      const ebookId = response.data.data.id;
      
      toast.success('Ebook created! Starting AI generation...');
      
      // Start generation
      await apiClient.post(`/ebooks/${ebookId}/generate`);
      
      navigate(`/ebook/${ebookId}/edit`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ebook');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`w-24 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Parameters</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              {/* Selected Template Display */}
              {selectedTemplate && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Using Template</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={clearTemplate}
                      className="text-sm text-gray-500 hover:text-red-600 transition"
                    >
                      Clear Template
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{selectedTemplate.description}</p>
                  {formData.chapter_titles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Chapter Structure ({formData.chapter_titles.length} chapters):</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.chapter_titles.slice(0, 5).map((title, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                            {idx + 1}. {title}
                          </span>
                        ))}
                        {formData.chapter_titles.length > 5 && (
                          <span className="text-xs bg-white px-2 py-1 rounded text-gray-500">
                            +{formData.chapter_titles.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Template Selection (if no template selected) */}
              {!selectedTemplate && templates.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start from a Template (Optional)
                  </label>
                  <select
                    onChange={(e) => {
                      const template = templates.find(t => t.id === parseInt(e.target.value));
                      if (template) applyTemplate(template);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    defaultValue=""
                  >
                    <option value="">-- Select a template or start from scratch --</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} ({template.category}) - {template.structure?.chapters?.length || 0} chapters
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ebook Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., The Complete Guide to Digital Marketing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic/Niche *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Digital Marketing, SEO, Social Media"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of what your ebook will cover..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Small business owners, Marketing professionals"
                />
              </div>
            </div>
          )}

          {/* Step 2: Parameters */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ebook Parameters</h2>
              
              {/* Premium Benefits Notice */}
              {!isPremium && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      <strong>Upgrade to Premium</strong> for up to 100 chapters and 10,000 words per chapter!
                    </span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Chapters (3-{maxChapters})
                  </label>
                  <input
                    type="number"
                    name="num_chapters"
                    value={formData.num_chapters}
                    onChange={handleChange}
                    min="3"
                    max={maxChapters}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isPremium ? 'Premium: Up to 100 chapters' : `Free: Up to ${maxChapters} chapters`}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Words per Chapter (500-{maxWordsPerChapter.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    name="words_per_chapter"
                    value={formData.words_per_chapter}
                    onChange={handleChange}
                    min="500"
                    max={maxWordsPerChapter}
                    step="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isPremium ? 'Premium: Up to 10,000 words' : `Free: Up to ${maxWordsPerChapter.toLocaleString()} words`}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Writing Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="academic">Academic</option>
                  <option value="creative">Creative</option>
                  <option value="conversational">Conversational</option>
                  <option value="friendly">Friendly</option>
                  <option value="educational">Educational</option>
                  <option value="motivational">Motivational</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="technical">Technical</option>
                  <option value="narrative">Narrative</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="supportive">Supportive</option>
                  <option value="warm">Warm</option>
                  <option value="reflective">Reflective</option>
                  <option value="playful">Playful</option>
                  <option value="instructional">Instructional</option>
                  <option value="actionable">Actionable</option>
                  <option value="encouraging">Encouraging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Generate</h2>
              
              {/* Template Badge */}
              {selectedTemplate && (
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm text-indigo-600 font-medium">
                    Using template: {selectedTemplate.name}
                  </span>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-semibold text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Topic</p>
                    <p className="font-semibold text-gray-900">{formData.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chapters</p>
                    <p className="font-semibold text-gray-900">{formData.num_chapters}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Words per Chapter</p>
                    <p className="font-semibold text-gray-900">{formData.words_per_chapter}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tone</p>
                    <p className="font-semibold text-gray-900 capitalize">{formData.tone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Language</p>
                    <p className="font-semibold text-gray-900">{formData.language}</p>
                  </div>
                </div>

                {/* Chapter Titles Preview */}
                {formData.chapter_titles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Chapter Structure</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {formData.chapter_titles.map((title, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="w-8 text-gray-400">{idx + 1}.</span>
                          <span className="font-medium text-gray-900">{title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> AI generation will start immediately after creation. 
                  This typically takes 5-10 minutes depending on the length of your ebook.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    <span>Generate Ebook</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EbookCreator;
