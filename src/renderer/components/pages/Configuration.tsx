import React, { useState } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { User, TestRailConfig, JiraConfig, EmailConfig } from "../../../types";

const Configuration: React.FC = () => {
  const { config, updateConfig, saveConfig, loading, error } = useConfig();
  const [activeTab, setActiveTab] = useState<
    "users" | "testrail" | "jira" | "email"
  >("users");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const autoSave = async () => {
    try {
      await saveConfig();
      setSaveMessage("Configuration auto-saved!");
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error("Failed to save configuration:", err);
    }
  };

  const updateUsers = (users: User[]) => {
    updateConfig({ users });
    autoSave();
  };

  const updateTestRail = (testrail: TestRailConfig) => {
    updateConfig({ testrail });
    autoSave();
  };

  const updateJira = (jira: JiraConfig) => {
    updateConfig({ jira });
    autoSave();
  };

  const updateEmail = (email: EmailConfig) => {
    updateConfig({ email });
    autoSave();
  };

  const tabs = [
    { 
      id: "users", 
      name: "Users", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    },
    { 
      id: "testrail", 
      name: "TestRail", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    { 
      id: "jira", 
      name: "Jira", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      )
    },
    { 
      id: "email", 
      name: "Email", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="full-width">
      <div className="alexa-page-header">
        <h1 className="alexa-display-5 alexa-page-title">Configuration</h1>
        <p className="alexa-body alexa-page-subtitle">
          Configure users, API connections, and email settings for activity
          reporting
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-2 py-2 px-4 rounded-t-lg transition-colors duration-150 font-medium text-sm focus:outline-none ${
            activeTab === tab.id
          ? "bg-primary-50 border-b-2 border-primary-500 text-primary-700 shadow"
          : "bg-transparent border-b-2 border-transparent text-gray-500 hover:text-primary-600 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center">{tab.icon}</span>
          <span>{tab.name}</span>
        </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "users" && (
          <UsersTab users={config.users} onUpdate={updateUsers} />
        )}
        {activeTab === "testrail" && (
          <TestRailTab config={config.testrail} onUpdate={updateTestRail} />
        )}
        {activeTab === "jira" && (
          <JiraTab config={config.jira} onUpdate={updateJira} />
        )}
        {activeTab === "email" && (
          <EmailTab config={config.email} onUpdate={updateEmail} />
        )}
      </div>

      {/* Status Messages */}
      <div className="mt-6">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saveMessage && (
          <p className="text-green-600 text-sm flex items-center space-x-2">
            {loading && <div className="spinner w-4 h-4"></div>}
            <span>{saveMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
};

// Users Tab Component
interface UsersTabProps {
  users: User[];
  onUpdate: (users: User[]) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, onUpdate }) => {
  const [newUser, setNewUser] = useState<Partial<User>>({});

  const addUser = () => {
    if (newUser.name && newUser.email) {
      // Extract username from email (part before @)
      const emailUsername = newUser.email.split("@")[0];

      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        testrailId: emailUsername, // Use email username as TestRail ID
        jiraAccountId: emailUsername, // Use email username as Jira Account ID
      };
      onUpdate([...users, user]);
      setNewUser({});
    }
  };

  const removeUser = (id: string) => {
    onUpdate(users.filter((user) => user.id !== id));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    onUpdate(
      users.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">
          Add users to track their TestRail and Jira activities
        </p>
      </div>

      <div className="card-content">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              value={newUser.name || ""}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="form-field"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              value={newUser.email || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="form-field"
              placeholder="john@company.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              TestRail and Jira IDs will be automatically derived from the email
              address
            </p>
          </div>
        </div>
        <button
          onClick={addUser}
          disabled={!newUser.name || !newUser.email}
          className={`btn-primary mt-4 ${!newUser.name || !newUser.email ? "border border-gray-300 cursor-not-allowed" : ""}`}
        >
          Add User
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Users
        </h3>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No users configured. Add users to start tracking activities.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    IDs
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 align-middle">
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) =>
                          updateUser(user.id, { name: e.target.value })
                        }
                        className="input-field w-full"
                        placeholder="Enter user name"
                        title="User Name"
                      />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => {
                          const newEmail = e.target.value;
                          const emailUsername = newEmail.split("@")[0];
                          updateUser(user.id, {
                            email: newEmail,
                            testrailId: emailUsername,
                            jiraAccountId: emailUsername,
                          });
                        }}
                        className="input-field w-full"
                        title="User Email"
                        placeholder="Enter user email"
                      />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col space-y-1 text-xs text-gray-600">
                        <div>
                          <span className="font-semibold text-gray-800">
                            TestRail ID:
                          </span>{" "}
                          {user.testrailId ||
                            (user.email ? user.email.split("@")[0] : "N/A")}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            Jira ID:
                          </span>{" "}
                          {user.jiraAccountId ||
                            (user.email ? user.email.split("@")[0] : "N/A")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-center">
                      <button
                        onClick={() => removeUser(user.id)}
                        className="btn-danger text-sm px-4 py-2 rounded shadow hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// TestRail Tab Component
interface TestRailTabProps {
  config: TestRailConfig;
  onUpdate: (config: TestRailConfig) => void;
}

const TestRailTab: React.FC<TestRailTabProps> = ({ config, onUpdate }) => {
  const handleChange = (field: keyof TestRailConfig, value: string) => {
    onUpdate({ ...config, [field]: value });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-gray-900">
          TestRail Configuration
        </h2>
        <p className="text-gray-600 mt-1">
          Configure TestRail API connection settings
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label className="form-label">TestRail URL *</label>
          <input
            type="url"
            value={config.url}
            onChange={(e) => handleChange("url", e.target.value)}
            className="form-field"
            placeholder="https://yourcompany.testrail.io"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            The base URL of your TestRail instance
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Username *</label>
          <input
            type="text"
            value={config.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="form-field"
            placeholder="your.email@company.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">API Key *</label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            className="form-field"
            placeholder="Your TestRail API key"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Generate this from your TestRail account settings
          </p>
        </div>
      </div>
    </div>
  );
};

// Jira Tab Component
interface JiraTabProps {
  config: JiraConfig;
  onUpdate: (config: JiraConfig) => void;
}

const JiraTab: React.FC<JiraTabProps> = ({ config, onUpdate }) => {
  const handleChange = (field: keyof JiraConfig, value: string) => {
    onUpdate({ ...config, [field]: value });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-gray-900">
          Jira Configuration
        </h2>
        <p className="text-gray-600 mt-1">
          Configure Jira API connection settings
        </p>
      </div>

      <div className="card-content">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jira URL *
          </label>
          <input
            type="url"
            value={config.url}
            onChange={(e) => handleChange("url", e.target.value)}
            className="input-field"
            placeholder="https://yourcompany.atlassian.net"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            type="text"
            value={config.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="input-field"
            placeholder="your.email@company.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Token *
          </label>
          <input
            type="password"
            value={config.apiToken}
            onChange={(e) => handleChange("apiToken", e.target.value)}
            className="input-field"
            placeholder="Enter your Jira API token"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Generate API token from Atlassian Account Settings → Security → API
            tokens
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Key (Optional)
          </label>
          <input
            type="text"
            value={config.projectKey || ""}
            onChange={(e) => handleChange("projectKey", e.target.value)}
            className="input-field"
            placeholder="PROJ"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to fetch from all projects
          </p>
        </div>
      </div>
    </div>
  );
};

// Email Tab Component
interface EmailTabProps {
  config: EmailConfig;
  onUpdate: (config: EmailConfig) => void;
}

const EmailTab: React.FC<EmailTabProps> = ({ config, onUpdate }) => {
  const handleChange = (
    field: keyof EmailConfig,
    value: string | number | boolean | string[]
  ) => {
    onUpdate({ ...config, [field]: value });
  };

  const handleEmailListChange = (
    field: "toEmails" | "ccEmails",
    value: string
  ) => {
    const emails = value
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    handleChange(field, emails);
  };

  return (
    <div className="space-y-6">
      {/* SMTP Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            SMTP Configuration
          </h2>
          <p className="text-gray-600 mt-1">
            Configure email server settings for sending reports
          </p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Host *
              </label>
              <input
                type="text"
                value={config.smtpHost}
                onChange={(e) => handleChange("smtpHost", e.target.value)}
                className="input-field"
                placeholder="smtp.gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port *
              </label>
              <input
                type="number"
                value={config.smtpPort}
                onChange={(e) =>
                  handleChange("smtpPort", parseInt(e.target.value))
                }
                className="input-field"
                placeholder="587"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="input-field"
                placeholder="your.email@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={config.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="input-field"
                placeholder="Enter your email password"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pb-5">
            <input
              type="checkbox"
              id="smtpSecure"
              checked={config.smtpSecure}
              onChange={(e) => handleChange("smtpSecure", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="smtpSecure" className="text-sm text-gray-700">
              Use secure connection (SSL/TLS)
            </label>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Email Settings
          </h2>
          <p className="text-gray-600 mt-1">
            Configure email content and recipients
          </p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Email *
              </label>
              <input
                type="email"
                value={config.fromEmail}
                onChange={(e) => handleChange("fromEmail", e.target.value)}
                className="input-field"
                placeholder="reports@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Emails *
              </label>
              <input
                type="text"
                value={config.toEmails.join(", ")}
                onChange={(e) =>
                  handleEmailListChange("toEmails", e.target.value)
                }
                className="input-field"
                placeholder="manager@company.com, team@company.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple emails with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CC Emails
              </label>
              <input
                type="text"
                value={config.ccEmails?.join(", ") || ""}
                onChange={(e) =>
                  handleEmailListChange("ccEmails", e.target.value)
                }
                className="input-field"
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={config.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className="input-field"
                placeholder="Happy Track Report - dateRange"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use double curly braces around dateRange to include the report
                date range
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Body Template
              </label>
              <textarea
                value={config.bodyTemplate}
                onChange={(e) => handleChange("bodyTemplate", e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Please find the attached activity report for the period dateRange."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use double curly braces around dateRange to include the report
                date range
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
