import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Eye, 
  Download, 
  Filter,
  Search
} from 'lucide-react';
import { pastAnalyses, assetClasses } from '../data/mockData';

const History = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort analyses
  const filteredAnalyses = pastAnalyses
    .filter(analysis => {
      const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           analysis.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === 'all' || analysis.riskProfile === filterRisk;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'returns') {
        return b.expectedReturns - a.expectedReturns;
      } else if (sortBy === 'amount') {
        return b.investmentAmount - a.investmentAmount;
      }
      return 0;
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-600 mt-1">View and manage your past portfolio analyses</p>
        </div>
        <button 
          onClick={() => navigate('/new-analysis')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <TrendingUp className="w-5 h-5" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="returns">Sort by Returns</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredAnalyses.length} of {pastAnalyses.length} analyses
      </div>

      {/* Analyses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnalyses.map((analysis) => (
          <div 
            key={analysis.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/analysis/${analysis.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{analysis.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{analysis.summary}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Investment</div>
                <div className="font-semibold text-gray-900">{formatCurrency(analysis.investmentAmount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Expected Returns</div>
                <div className="font-semibold text-green-600">{analysis.expectedReturns}%</div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(analysis.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{analysis.tenure}</span>
              </div>
            </div>

            {/* Risk Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                analysis.riskProfile === 'Low' ? 'bg-green-100 text-green-700' :
                analysis.riskProfile === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {analysis.riskProfile} Risk
              </span>
            </div>

            {/* Allocation Preview */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Portfolio Allocation</div>
              <div className="flex h-2 rounded-full overflow-hidden">
                {Object.entries(analysis.allocation).map(([asset, percentage]) => {
                  const color = assetClasses.find(a => a.name.toLowerCase() === asset)?.color || '#6b7280';
                  return (
                    <div
                      key={asset}
                      className="h-full"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: color 
                      }}
                      title={`${asset}: ${percentage}%`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                {Object.entries(analysis.allocation).map(([asset, percentage]) => (
                  <span key={asset}>{asset}: {percentage}%</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/analysis/${analysis.id}`);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Details
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAnalyses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterRisk !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first portfolio analysis to get started'
            }
          </p>
          {!searchTerm && filterRisk === 'all' && (
            <button 
              onClick={() => navigate('/new-analysis')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
