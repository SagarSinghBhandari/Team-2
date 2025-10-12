import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { apiService } from '../services/api';

const NewAnalysis = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateAnalysis, setIsLoading } = useAnalysis();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    setResponse(null);
    setError('');

    try {
      // Call the API service
      const data = await apiService.analyzeInvestment(inputText);
      
      // For development, use mock data if API fails
      const analysisData = data || apiService.generateMockAnalysisData(inputText);
      
      // Print API response for debugging
      console.log('API Response:', analysisData);
      
      // Update context with analysis data
      updateAnalysis(analysisData);
      
      // Navigate to analysis page
      navigate('/analysis');
    } 
    catch (err) {
      console.error('Analysis Error:', err);
      setError('Failed to analyze your investment. Please try again.');
    } 
    finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Portfolio Analysis</h1>
          <p className="text-gray-600">Enter your investment details in plain language and let AI analyze it.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your investment details
            </label>
            <textarea
              name="investmentDetails"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Example: I want to invest ₹5 lakhs for 10 years in a balanced portfolio expecting around 9% annual return."
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </form>

        {/* Demo Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              const demoData = apiService.generateMockAnalysisData("Demo investment analysis");
              updateAnalysis(demoData);
              navigate('/analysis');
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>View Demo Analysis</span>
          </button>
        </div>
      </div>

      {/* Response Section */}
      <div className="mt-8">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {error}
          </div>
        )}

        {response && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Response</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAnalysis;
