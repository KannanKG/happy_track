import React, { useState, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

const Reports: React.FC = () => {
  const { config } = useConfig();
  
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Select all users by default when users are loaded
  useEffect(() => {
    if (config.users.length > 0 && selectedUsers.length === 0) {
      setSelectedUsers(config.users.map(user => user.id));
    }
  }, [config.users]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === config.users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(config.users.map(user => user.id));
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate || selectedUsers.length === 0) {
      alert('Please select date range and at least one user');
      return;
    }

    setLoading(true);
    try {
      // Here we'll implement the actual report generation logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Report generated successfully!');
    } catch (error) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-width">
      <div className="alexa-page-header">
        <h1 className="alexa-display-5 alexa-page-title">Reports</h1>
        <p className="alexa-body alexa-page-subtitle">
          Generate activity reports for TestRail and Jira based on date range and selected users
        </p>
      </div>

      {/* System Information Bar */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">System Status</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${config.testrail.url ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">
                  TestRail {config.testrail.url ? 'Connected' : 'Not configured'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${config.jira.url ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">
                  Jira {config.jira.url ? 'Connected' : 'Not configured'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${config.email.smtpHost ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">
                  Email {config.email.smtpHost ? 'Configured' : 'Not configured'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-grid-2">
        {/* Report Configuration - Combined Date Range and User Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Report Configuration</h2>
            <p className="text-gray-600 mt-1">
              Configure date range and select users for the activity report
            </p>
          </div>
          
          <div className="card-content">
            {/* Date Range Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-field"
                    required
                    title="Select start date"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-field"
                    required
                    title="Select end date"
                  />
                </div>
              </div>
            </div>

            {/* User Selection Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">User Selection</h3>
                <button
                  onClick={handleSelectAll}
                  className="btn-secondary text-sm"
                >
                  {selectedUsers.length === config.users.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {config.users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No users configured. Please add users in the Configuration page first.
                  </p>
                  <button className="btn-primary">
                    Go to Configuration
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {config.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      {/* Left side: Checkbox and user info */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="form-checkbox"
                        />
                        <div>
                          <label
                            htmlFor={`user-${user.id}`}
                            className="block text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {user.name}
                          </label>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Right side: Compact API status */}
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.testrailId ? 'bg-green-500' : 'bg-red-500'}`} title={`TestRail: ${user.testrailId || 'Not configured'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${user.jiraAccountId ? 'bg-blue-500' : 'bg-red-500'}`} title={`Jira: ${user.jiraAccountId || 'Not configured'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Actions & Preview - Combined Actions and Preview */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Generate & Preview</h2>
            <p className="text-gray-600 mt-1">
              Generate reports and preview content details
            </p>
          </div>
          
          <div className="card-content">
            {/* Actions Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={loading || !startDate || !endDate || selectedUsers.length === 0}
                  className="w-full btn-primary"
                >
                  {loading && <div className="spinner w-4 h-4 mr-2"></div>}
                  <span>{loading ? 'Generating...' : 'Generate Report'}</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn-secondary text-sm" disabled>
                    Export CSV
                  </button>
                  <button className="btn-secondary text-sm" disabled>
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
              
              {/* Report Summary */}
              <div className="p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Report Summary</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Range:</span>
                    <span className="text-gray-900 font-medium">
                      {startDate && endDate ? `${startDate} to ${endDate}` : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Users:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedUsers.length} of {config.users.length} selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2 text-green-600">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    TestRail Activities
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Test case status updates</li>
                    <li>• Test run executions</li>
                    <li>• Comments and notes</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2 text-blue-600">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                    Jira Activities
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• New issues created</li>
                    <li>• Comments and updates</li>
                    <li>• Status transitions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;