import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BookOpen, Search } from 'lucide-react';

const AdminEbooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadEbooks = React.useCallback(async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      
      const response = await axios.get('/api/admin/ebooks', { params });
      setEbooks(response.data.data);
    } catch (error) {
      console.error('Failed to load ebooks:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadEbooks();
  }, [loadEbooks]);

  const filteredEbooks = ebooks.filter(ebook =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Ebooks</h1>
          <p className="text-gray-600 mt-2">Browse and manage all ebooks on the platform</p>
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

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEbooks.map((ebook) => (
            <div key={ebook.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{ebook.title}</h3>
              <p className="text-sm text-gray-600 mb-4">By {ebook.user?.name || 'Unknown'}</p>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{ebook.num_chapters} chapters</span>
                <span>{new Date(ebook.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEbooks;
