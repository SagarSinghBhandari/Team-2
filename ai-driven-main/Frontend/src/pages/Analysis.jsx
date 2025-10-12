import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  GitCompare, 
  CheckCircle, 
  TrendingUp,
  X
} from 'lucide-react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalysis } from '../context/AnalysisContext';

const Analysis = () => {
  const navigate = useNavigate();
  const { currentAnalysis, previousAnalysis } = useAnalysis();
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedAssetClasses, setSelectedAssetClasses] = useState(['equity', 'debt', 'alternative']);

  const toggleAssetClass = (assetClass) => {
    setSelectedAssetClasses(prev => 
      prev.includes(assetClass) 
        ? prev.filter(ac => ac !== assetClass)
        : [...prev, assetClass]
    );
  };

  const getAssetClassColor = (assetClass) => ({
    equity: '#3b82f6',
    debt: '#10b981',
    alternative: '#f59e0b'
  })[assetClass] || '#6b7280';

  const getAssetClassName = (assetClass) => ({
    equity: 'Equity',
    debt: 'Debt',
    alternative: 'Alternative'
  })[assetClass] || assetClass;
  
  /**
   * Calculates a symmetrical domain and corresponding ticks for the Y-axis, centered at 0.
   * @param {Array} data The chart data array.
   * @returns {Object} An object with `domain` and `ticks` arrays.
   */
  const getGrowthAxisProps = (data) => {
    if (!data || data.length === 0) {
      // Default props if no data
      return { domain: [-10, 10], ticks: [-10, -5, 0, 5, 10] };
    }

    const growthKeys = ['equityGrowth', 'debtGrowth', 'alternativeGrowth'];
    
    const maxAbsGrowth = data.reduce((max, item) => {
      let currentMax = max;
      growthKeys.forEach(key => {
        const value = item[key] || 0;
        if (Math.abs(value) > currentMax) {
          currentMax = Math.abs(value);
        }
      });
      return currentMax;
    }, 0);

    // Add a buffer and round up for a clean max value
    const bufferedMax = Math.ceil(maxAbsGrowth * 1.1) || 5;

    const domain = [-bufferedMax, bufferedMax];
    
    // Create 5 symmetrical ticks, including 0 in the center
    const ticks = [
      -bufferedMax,
      -bufferedMax / 2,
      0,
      bufferedMax / 2,
      bufferedMax
    ].map(tick => Math.round(tick)); // Round to whole numbers

    return { domain, ticks };
  };

  if (!currentAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Data</h2>
          <p className="text-gray-600 mb-6">Create a new analysis to see results here.</p>
          <button
            onClick={() => navigate('/new-analysis')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create New Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/new-analysis')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analysis Results</h1>
                <p className="text-gray-600 text-sm lg:text-base">Your personalized investment analysis</p>
              </div>
            </div>
          </div>
          <button onClick={() => setShowCompareModal(true)} className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <GitCompare className="w-4 h-4" />
            <span>Compare Analysis</span>
          </button>
        </div>
      </div>

      {/* Insights Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
          AI Insights & Recommendations
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">{currentAnalysis.insights}</p>
          {currentAnalysis.suggestions && (
            <ul className="space-y-2">
              {currentAnalysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Asset Class Toggles */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Asset Class Selection</h3>
        <div className="flex flex-wrap gap-3">
          {['equity', 'debt', 'alternative'].map((assetClass) => (
            <button
              key={assetClass}
              onClick={() => toggleAssetClass(assetClass)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                selectedAssetClasses.includes(assetClass)
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAssetClassColor(assetClass) }} />
              <span>{getAssetClassName(assetClass)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dual-Axis Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Portfolio Performance & Asset Class Growth</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={currentAnalysis.dualAxisData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" fontSize={12} />
              <YAxis yAxisId="portfolio" orientation="left" fontSize={12} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
              
              <YAxis 
                yAxisId="growth" 
                orientation="right" 
                fontSize={12} 
                tickFormatter={(value) => `${value}%`} 
                {...getGrowthAxisProps(currentAnalysis.dualAxisData)}
              />

              <Tooltip formatter={(value, name) => name === 'portfolioValue' ? [`₹${value.toLocaleString()}`, 'Portfolio Value'] : [`${value}%`, name]} />
              <Legend />
              
              <Line yAxisId="portfolio" type="monotone" dataKey="portfolioValue" stroke="#1f2937" strokeWidth={3} name="Portfolio Value" />
              
              {selectedAssetClasses.map((assetClass) => (
                <Line
                  key={assetClass}
                  yAxisId="growth"
                  type="monotone"
                  dataKey={`${assetClass}Growth`}
                  stroke={getAssetClassColor(assetClass)}
                  strokeWidth={2}
                  name={`${getAssetClassName(assetClass)} Growth`}
                  dot={{ r: 3 }}
                  strokeDasharray="5 5" 
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compare Analysis Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Compare Analysis</h2>
              <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {previousAnalysis ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Previous Analysis */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Previous Analysis</h3>
                    <p className="text-gray-700 text-sm mb-4">{previousAnalysis.insights}</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={previousAnalysis.dualAxisData || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" fontSize={10} />
                            <YAxis yAxisId="portfolio" fontSize={10} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                          
                            <YAxis 
                              yAxisId="growth" 
                              orientation="right" 
                              fontSize={10} 
                              tickFormatter={(value) => `${value}%`} 
                              {...getGrowthAxisProps(previousAnalysis.dualAxisData)}
                            />

                            <Tooltip formatter={(value, name) => name === 'portfolioValue' ? [`₹${value.toLocaleString()}`, 'Portfolio'] : [`${value}%`, name]} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            <Line yAxisId="portfolio" dataKey="portfolioValue" stroke="#4b5563" strokeWidth={2} name="Portfolio" />
                            <Line yAxisId="growth" dataKey="equityGrowth" stroke="#3b82f6" name="Equity" strokeDasharray="5 5" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* Current Analysis */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Analysis</h3>
                    <p className="text-gray-700 text-sm mb-4">{currentAnalysis.insights}</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={currentAnalysis.dualAxisData || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" fontSize={10} />
                            <YAxis yAxisId="portfolio" fontSize={10} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                          
                            <YAxis 
                              yAxisId="growth" 
                              orientation="right" 
                              fontSize={10} 
                              tickFormatter={(value) => `${value}%`} 
                              {...getGrowthAxisProps(currentAnalysis.dualAxisData)}
                            />

                            <Tooltip formatter={(value, name) => name === 'portfolioValue' ? [`₹${value.toLocaleString()}`, 'Portfolio'] : [`${value}%`, name]} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            <Line yAxisId="portfolio" dataKey="portfolioValue" stroke="#1f2937" strokeWidth={2} name="Portfolio" />
                            <Line yAxisId="growth" dataKey="equityGrowth" stroke="#3b82f6" name="Equity" strokeDasharray="5 5" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Previous Analysis</h3>
                  <p className="text-gray-600">Run another analysis to compare results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;