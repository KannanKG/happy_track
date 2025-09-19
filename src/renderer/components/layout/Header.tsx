import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Happy Track
          </h1>
          <p className="text-sm text-gray-600">
            TestRail & Jira Activity Reporter
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">HT</span>
            </div>
            <span className="text-sm text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;