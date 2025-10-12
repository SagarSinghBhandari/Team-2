import React from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const Topbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search analyses, portfolios..."
              className="bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 flex-1"
            />
          </div>
        </div>

        {/* Right side - Notifications and user profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User profile dropdown */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.riskProfile} Risk</div>
            </div>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src={user?.profilePicture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <User className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden mt-4">
        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search analyses, portfolios..."
            className="bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 flex-1"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
