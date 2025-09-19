import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useConfig();

  const stats = [
    {
      name: 'Total Users',
      value: config.users.length,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      status: config.users.length > 0 ? 'active' : 'inactive',
    },
    {
      name: 'TestRail Connected',
      value: config.testrail.url ? 'Connected' : 'Not Connected',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      status: config.testrail.url ? 'active' : 'inactive',
    },
    {
      name: 'Jira Connected',
      value: config.jira.url ? 'Connected' : 'Not Connected',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      ),
      status: config.jira.url ? 'active' : 'inactive',
    },
    {
      name: 'Email Configured',
      value: config.email.smtpHost ? 'Configured' : 'Not Configured',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      status: config.email.smtpHost ? 'active' : 'inactive',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="alexa-page-header">
        <h1 className="alexa-display-4 alexa-page-title">Dashboard</h1>
        <p className="alexa-body alexa-page-subtitle">
          Overview of your Happy Track configuration and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="responsive-grid-4 mb-xl">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex flex-center">
                <div 
                  className="mr-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-teal-800)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <h3 className="alexa-caption" style={{ color: 'var(--color-secondary-text)', margin: '0 0 2px 0' }}>
                    {stat.name}
                  </h3>
                  <p className="alexa-callout" style={{ color: 'var(--color-text)', margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions and System Status */}
      <div className="responsive-grid-2 mb-xl">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="alexa-title" style={{ color: 'var(--color-text)', margin: 0 }}>Quick Actions</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-regular)' }}>
              <button 
                className="btn-action" 
                onClick={() => navigate('/reports')}
                aria-label="Navigate to Reports page"
              >
                <div>
                  <h3 className="alexa-metadata" style={{ color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                    Generate New Report
                  </h3>
                  <p className="alexa-caption" style={{ color: 'var(--color-text)', opacity: 0.8, margin: 0 }}>
                    Create activity report for selected date range
                  </p>
                </div>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              <button 
                className="btn-action" 
                onClick={() => navigate('/configuration')}
                aria-label="Navigate to Configuration page"
              >
                <div>
                  <h3 className="alexa-metadata" style={{ margin: '0 0 4px 0' }}>
                    Configure Settings
                  </h3>
                  <p className="alexa-caption" style={{ opacity: 0.8, margin: 0 }}>
                    Update users, API connections, and email settings
                  </p>
                </div>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <div className="card-header">
            <h2 className="alexa-title" style={{ color: 'var(--color-text)', margin: 0 }}>System Status</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="alexa-metadata dashboard-users-configured">Users Configured</span>
              <span className="alexa-metadata" style={{ color: 'var(--color-text)' }}>{config.users.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="alexa-metadata" style={{ color: 'var(--color-secondary-text)' }}>APIs Connected</span>
              <span className="alexa-metadata" style={{ color: 'var(--color-text)' }}>
                {[config.testrail.url, config.jira.url].filter(Boolean).length} / 2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="alexa-title" style={{ color: 'var(--color-text)', margin: 0 }}>Configuration Overview</h2>
        </div>
        <div className="card-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--spacing-lg)', 
            marginTop: 'var(--spacing-regular)',
          }}>
            <div>
              <h3 className="alexa-callout" style={{ color: 'var(--color-text)', margin: '0 0 var(--spacing-regular) 0' }}>
                Users
              </h3>
              {config.users.length === 0 ? (
                <p className="alexa-metadata" style={{ color: 'var(--color-secondary-text)', opacity: 0.7 }}>
                  No users configured
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-xs)' }}>
                  {config.users.map((user) => (
                    <div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-xs)', borderRadius: 'var(--radius-sm)' }}>
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'var(--color-teal-800)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text)',
                          fontSize: '16px',
                          fontWeight: '700',
                          marginBottom: '6px'
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="alexa-metadata" style={{ color: 'var(--color-secondary-text)', textAlign: 'center', wordBreak: 'break-word' }}>
                        {user.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* API Status */}
            <div>
              <h3 className="alexa-callout" style={{ color: 'var(--color-text)', margin: '0 0 var(--spacing-regular) 0' }}>
                API Connections
              </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', minWidth: 0 }}>
                  <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: config.testrail.url ? 'var(--color-green-800)' : 'var(--color-red-800)',
                    flexShrink: 0
                  }}
                  ></div>
                  <span 
                  className="alexa-metadata" 
                  style={{ color: 'var(--color-secondary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}
                  >
                  TestRail {config.testrail.url ? 'Connected' : 'Not configured'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', minWidth: 0 }}>
                  <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: config.jira.url ? 'var(--color-green-800)' : 'var(--color-red-800)',
                    flexShrink: 0
                  }}
                  ></div>
                  <span 
                  className="alexa-metadata" 
                  style={{ color: 'var(--color-secondary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}
                  >
                  Jira {config.jira.url ? 'Connected' : 'Not configured'}
                  </span>
                </div>
                </div>
            </div>

            {/* Email Status */}
            <div>
              <h3 className="alexa-callout" style={{ color: 'var(--color-text)', margin: '0 0 var(--spacing-regular) 0' }}>
                Email Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: config.email.smtpHost ? 'var(--color-green-800)' : 'var(--color-red-800)'
                    }}
                  ></div>
                  <span className="alexa-metadata" style={{ color: 'var(--color-secondary-text)' }}>
                    SMTP {config.email.smtpHost ? 'Configured' : 'Not configured'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: config.email.toEmails.length > 0 ? 'var(--color-green-800)' : 'var(--color-red-800)'
                    }}
                  ></div>
                  <span className="alexa-metadata secondary-text">
                    Recipients {config.email.toEmails.length > 0 ? `(${config.email.toEmails.length})` : 'Not configured'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;