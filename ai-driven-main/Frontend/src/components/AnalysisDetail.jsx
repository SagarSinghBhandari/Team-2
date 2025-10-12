import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import Plot from 'react-plotly.js'; // Import Plotly
import axios from 'axios'; // Import axios for API calls
import { 
  ArrowLeft, Download, Share2, Calendar, Target, TrendingUp,
  DollarSign, BarChart3, PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { pastAnalyses, assetClasses } from '../data/mockData';

// --- Helper functions for the new Plotly chart (migrated from Python) ---

const API_URL = "https://jsonblob.com/api/jsonBlob/1426482149128855552";
const START_PRINCIPAL_PER_CAT = 10000.0;

// JS equivalent of Python's extract_rates function
const extractRates = (raw) => {
  const rates = {};
  let allYears = new Set();
  for (const [cat, byYear] of Object.entries(raw)) {
    const rateMap = {};
    if (byYear) {
      for (const [yearStr, value] of Object.entries(byYear)) {
        if (!yearStr.endsWith("_amt")) {
          const year = parseInt(yearStr, 10);
          rateMap[year] = parseFloat(value);
          allYears.add(year);
        }
      }
    }
    if (Object.keys(rateMap).length > 0) {
      rates[cat] = rateMap;
    }
  }
  const sortedYears = Array.from(allYears).sort((a, b) => a - b);
  return { years: sortedYears, rates };
};

// JS equivalent of Python's weighted_average_rate_per_year function
const calculateWeightedAverage = (years, rates) => {
  const cats = Object.keys(rates);
  let principal = Object.fromEntries(cats.map(c => [c, START_PRINCIPAL_PER_CAT]));
  const avgRates = [];
  for (const year of years) {
    let numerator = 0;
    let denominator = 0;
    for (const cat of cats) {
      const rate = rates[cat]?.[year] ?? 0.0;
      numerator += principal[cat] * rate;
      denominator += principal[cat];
    }
    const avgRate = denominator === 0 ? 0 : numerator / denominator;
    avgRates.push(avgRate);
    for (const cat of cats) {
      const rate = rates[cat]?.[year] ?? 0.0;
      principal[cat] *= (1.0 + rate / 100.0);
    }
  }
  return avgRates;
};

// --- Main Component ---

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // State for the new Plotly chart
  const [historicalData, setHistoricalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analysis = pastAnalyses.find(a => a.id === parseInt(id));

  // Effect to fetch historical data when the relevant tab is active
  useEffect(() => {
    const fetchHistoricalData = async () => {
      // Only fetch if the tab is active and data hasn't been fetched yet
      if (activeTab === 'historical' && !historicalData) {
        setIsLoading(true);
        try {
          const response = await axios.get(API_URL, { params: { "_": Date.now() }});
          const { years, rates } = extractRates(response.data);
          const avgRates = calculateWeightedAverage(years, rates);
          
          const traces = [];
          for (const [cat, yearMap] of Object.entries(rates)) {
            traces.push({
              x: years,
              y: years.map(y => yearMap[y] ?? null),
              mode: 'lines+markers', name: cat,
              line: { width: 2, dash: 'dash' },
              marker: { size: 8 },
              hovertemplate: 'Category: %{fullData.name}<br>Year: %{x}<br>Rate: %{y:.2f}%<extra></extra>',
            });
          }
          traces.push({
            x: years, y: avgRates, mode: 'lines+markers', name: 'Weighted Avg Rate',
            line: { width: 4, color: '#6d28d9', dash: 'solid' },
            marker: { size: 8, color: '#6d28d9' },
            hovertemplate: 'Year: %{x}<br>Weighted Avg Rate: %{y:.2f}%<extra></extra>',
          });
          
          setHistoricalData({
            data: traces,
            layout: {
              title: `Historical Rates (dashed) vs. Weighted Average (solid)`,
              xaxis: { title: 'Year' },
              yaxis: { title: 'Rate (%)' },
              hovermode: 'x unified',
              autosize: true,
              font: { family: 'Inter, sans-serif' },
              legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' }
            }
          });
        } catch (error) {
          console.error("Failed to fetch historical data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchHistoricalData();
  }, [activeTab, historicalData]);


  if (!analysis) {
    return (
      <div className="p-6 text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
        <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);

  const pieData = Object.entries(analysis.allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), value,
    color: assetClasses.find(asset => asset.name.toLowerCase() === key)?.color || '#6b7280'
  }));

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value}% • {formatCurrency((data.value / 100) * analysis.investmentAmount)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Updated tabs array
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'allocation', label: 'Allocation', icon: PieChartIcon },
    { id: 'historical', label: 'Historical Analysis', icon: Activity } // New Tab
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{analysis.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center space-x-1"><Calendar className="w-4 h-4" /><span>{new Date(analysis.date).toLocaleDateString()}</span></div>
              <div className="flex items-center space-x-1"><Target className="w-4 h-4" /><span>{analysis.tenure}</span></div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                analysis.riskProfile === 'Low' ? 'bg-green-100 text-green-700' :
                analysis.riskProfile === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>{analysis.riskProfile} Risk</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Share2 className="w-4 h-4" /><span>Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Download className="w-4 h-4" /><span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between mb-4"><div className="p-3 bg-blue-50 rounded-lg"><DollarSign className="w-6 h-6 text-blue-600" /></div><div className="text-sm text-gray-500">Investment</div></div><p className="text-2xl font-bold">{formatCurrency(analysis.investmentAmount)}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between mb-4"><div className="p-3 bg-green-50 rounded-lg"><TrendingUp className="w-6 h-6 text-green-600" /></div><div className="text-sm text-gray-500">Expected Returns</div></div><p className="text-2xl font-bold">{analysis.expectedReturns}%</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between mb-4"><div className="p-3 bg-yellow-50 rounded-lg"><Target className="w-6 h-6 text-yellow-600" /></div><div className="text-sm text-gray-500">Tenure</div></div><p className="text-2xl font-bold">{analysis.tenure}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between mb-4"><div className="p-3 bg-purple-50 rounded-lg"><BarChart3 className="w-6 h-6 text-purple-600" /></div><div className="text-sm text-gray-500">Risk Profile</div></div><p className="text-2xl font-bold">{analysis.riskProfile}</p></div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" /><span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Analysis Summary</h3>
              <p className="text-gray-600">{analysis.summary}</p>
            </div>
          )}

          {/* Allocation Tab */}
          {activeTab === 'allocation' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{formatCurrency((item.value / 100) * analysis.investmentAmount)}</p>
                        </div>
                      </div>
                      <p className="font-semibold">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEW: Historical Analysis Tab */}
          {activeTab === 'historical' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Historical Rate Analysis (Live Data)</h3>
              {isLoading && <div className="text-center p-12">Loading live chart data...</div>}
              {historicalData && !isLoading && (
                 <div className="w-full h-[500px] border rounded-lg p-2">
                    <Plot
                        data={historicalData.data}
                        layout={historicalData.layout}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;