import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth } from './store/authSlice';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import AnalysisDetail from './components/AnalysisDetail';
import NewAnalysis from './pages/NewAnalysis';
import Analysis from './pages/Analysis';
import History from './pages/History';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized, isLoading } = useSelector((state) => state.auth);

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);


  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show AuthPage
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </Router>
    );
  }

  // If authenticated, show the main dashboard
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-analysis" element={<NewAnalysis />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/history" element={<History />} />
              <Route path="/analysis/:id" element={<AnalysisDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
