import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Calendar,
  ArrowRight,
  Eye
} from 'lucide-react';
import { pastAnalyses, currentPortfolio, assetClasses, riskProfiles } from '../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const safeRiskProfile = user?.riskProfile || "Moderate"; // or any default

   if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }
  const [viewMode, setViewMode] = useState('lumpsum'); // lumpsum, sip, swp

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare pie chart data
  const pieData = Object.entries(currentPortfolio.allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    color: assetClasses.find(asset => asset.name.toLowerCase() === key)?.color || '#6b7280'
  }));

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value}% • {formatCurrency((data.value / 100) * currentPortfolio.totalValue)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for line chart
  const LineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Portfolio Value: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Investor'}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              Your AI-optimized portfolio is performing well. Here's your investment overview.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Risk Profile: {safeRiskProfile}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{user.returnPercentage}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.totalInvestment)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{user.returnPercentage}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.currentValue)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{user.returnPercentage}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Returns</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.totalReturns)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm text-gray-500">
              {riskProfiles[user?.riskProfile]?.typicalReturns ?? "N/A"}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Risk Profile</p>
            <p className="text-2xl font-bold text-gray-900">{user.riskProfile}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Allocation</h2>
            <div className="flex space-x-2">
              {['lumpsum', 'sip', 'swp'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Growth</h2>
            <div className="text-sm text-gray-500">Last 12 months</div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentPortfolio.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<LineTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Past Analyses Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Analyses</h2>
          <button 
            onClick={() => navigate('/history')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastAnalyses.slice(0, 3).map((analysis) => (
            <div 
              key={analysis.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/analysis/${analysis.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">{analysis.title}</h3>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">{analysis.summary}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{analysis.date}</span>
                <span className="font-medium text-green-600">+{analysis.expectedReturns}% expected</span>
              </div>

              {/* Mini allocation bar */}
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
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/new-analysis')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
          >
            <div className="font-medium mb-1">Create New Analysis</div>
            <div className="text-sm text-blue-100">Get AI-powered portfolio recommendations</div>
          </button>
          
          <button 
            onClick={() => navigate('/history')}
            className="bg-white text-gray-700 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="font-medium mb-1">View History</div>
            <div className="text-sm text-gray-500">Browse past analyses and performance</div>
          </button>
          
          <button 
            onClick={() => navigate('/settings')}
            className="bg-white text-gray-700 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="font-medium mb-1">Update Profile</div>
            <div className="text-sm text-gray-500">Modify risk profile and preferences</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
