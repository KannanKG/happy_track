/**
 * Happy Track - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * These types ensure type safety and provide clear contracts for data structures,
 * API responses, and component props.
 * 
 * Organization:
 * - Core Application Types
 * - Configuration Types  
 * - TestRail API Types
 * - Jira API Types
 * - Report & Activity Types
 * 
 * @author Happy Track Contributors
 * @since 1.0.0
 */

// ============================================================================
// CORE APPLICATION TYPES
// ============================================================================

/**
 * Application theme type
 * Currently supports light mode only, with plans for dark mode in future versions
 */
export type Theme = 'light';

/**
 * User entity representing a team member tracked in the application
 * Users are mapped to both TestRail and Jira accounts for activity correlation
 */
export interface User {
  /** Unique identifier for the user within the application */
  id: string;
  
  /** Full display name of the user */
  name: string;
  
  /** Email address used for identification and reporting */
  email: string;
  
  /** TestRail user ID or username for API authentication (optional) */
  testrailId?: string;
  
  /** Jira account ID for API authentication (optional) */
  jiraAccountId?: string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * TestRail API configuration
 * Stores connection details for TestRail instance integration
 */
export interface TestRailConfig {
  /** TestRail instance URL (e.g., https://company.testrail.io) */
  url: string;
  
  /** TestRail username for API authentication */
  username: string;
  
  /** TestRail API key for authentication (found in user profile) */
  apiKey: string;
}

/**
 * Jira API configuration
 * Stores connection details for Jira instance integration
 */
export interface JiraConfig {
  /** Jira instance URL (e.g., https://company.atlassian.net) */
  url: string;
  
  /** Jira username for API authentication */
  username: string;
  
  /** Jira API token for authentication (generated in account settings) */
  apiToken: string;
  
  /** Default project key for filtering (optional) */
  projectKey?: string;
}

/**
 * Email configuration for automated report delivery
 * Supports SMTP servers with authentication
 */
export interface EmailConfig {
  /** SMTP server hostname */
  smtpHost: string;
  
  /** SMTP server port (commonly 587 for TLS, 465 for SSL, 25 for plain) */
  smtpPort: number;
  
  /** Whether to use secure connection (SSL/TLS) */
  smtpSecure: boolean;
  
  /** SMTP username for authentication (deprecated - use username) */
  smtpUser: string;
  
  /** SMTP password for authentication (deprecated - use password) */
  smtpPassword: string;
  
  /** SMTP username for authentication */
  username: string;
  
  /** SMTP password for authentication */
  password: string;
  
  /** Email address to send reports from */
  fromEmail: string;
  
  /** Array of primary recipient email addresses */
  toEmails: string[];
  
  /** Array of CC recipient email addresses (optional) */
  ccEmails?: string[];
  
  /** Email subject line (supports template variables) */
  subject: string;
  
  /** Email body content (supports template variables) */
  body: string;
  
  /** Email body template for generating dynamic content */
  bodyTemplate: string;
}

/**
 * Main application configuration
 * Contains all user settings and API configurations
 */
export interface AppConfig {
  /** Array of users being tracked */
  users: User[];
  
  /** TestRail API configuration */
  testrail: TestRailConfig;
  
  /** Jira API configuration */
  jira: JiraConfig;
  
  /** Email delivery configuration */
  email: EmailConfig;
  
  /** UI theme preference */
  theme: Theme;
}

// ============================================================================
// TESTRAIL API TYPES
// ============================================================================

/**
 * TestRail project information
 * Represents a project container in TestRail
 */
export interface TestRailProject {
  /** Unique project identifier */
  id: number;
  
  /** Project name */
  name: string;
  
  /** Project announcement text (optional) */
  announcement?: string;
  
  /** Whether to show the announcement (optional) */
  show_announcement?: boolean;
  
  /** Whether the project is completed (optional) */
  is_completed?: boolean;
  
  /** Completion timestamp (optional) */
  completed_on?: number;
  
  /** Suite mode configuration (optional) */
  suite_mode?: number;
  
  /** Project URL in TestRail (optional) */
  url?: string;
}

/**
 * TestRail test suite information
 * Represents a collection of test cases within a project
 */
export interface TestRailSuite {
  /** Unique suite identifier */
  id: number;
  
  /** Suite name */
  name: string;
  
  /** Suite description (optional) */
  description?: string;
  
  /** Parent project identifier */
  project_id: number;
  
  /** Whether this is the master suite (optional) */
  is_master?: boolean;
  
  /** Whether this is a baseline suite (optional) */
  is_baseline?: boolean;
  
  /** Whether the suite is completed (optional) */
  is_completed?: boolean;
  
  /** Completion timestamp (optional) */
  completed_on?: number;
  
  /** Suite URL in TestRail (optional) */
  url?: string;
}

/**
 * TestRail test case information
 * Represents an individual test case with all its metadata
 */
export interface TestRailCase {
  /** Unique test case identifier */
  id: number;
  
  /** Test case title */
  title: string;
  
  /** Parent section identifier */
  section_id: number;
  
  /** Template identifier used for this case */
  template_id: number;
  
  /** Test type identifier */
  type_id: number;
  
  /** Priority level identifier */
  priority_id: number;
  
  /** Associated milestone identifier (optional) */
  milestone_id?: number;
  
  /** External references (optional) */
  refs?: string;
  
  /** User ID who created the test case */
  created_by: number;
  
  /** Creation timestamp */
  created_on: number;
  
  /** User ID who last updated the test case */
  updated_by: number;
  
  /** Last update timestamp */
  updated_on: number;
  
  /** Time estimate for execution (optional) */
  estimate?: string;
  
  /** Forecasted estimate (optional) */
  estimate_forecast?: string;
  
  /** Parent suite identifier */
  suite_id: number;
  custom_expected?: string;
  custom_preconds?: string;
  custom_steps?: string;
}

export interface TestRailRun {
  id: number;
  name: string;
  description?: string;
  milestone_id?: number;
  assignedto_id?: number;
  include_all: boolean;
  is_completed: boolean;
  completed_on?: number;
  config?: string;
  config_ids?: number[];
  passed_count: number;
  blocked_count: number;
  untested_count: number;
  retest_count: number;
  failed_count: number;
  custom_status1_count?: number;
  custom_status2_count?: number;
  custom_status3_count?: number;
  custom_status4_count?: number;
  custom_status5_count?: number;
  custom_status6_count?: number;
  custom_status7_count?: number;
  project_id: number;
  plan_id?: number;
  created_on: number;
  created_by: number;
  url: string;
}

export interface TestRailTest {
  id: number;
  case_id: number;
  status_id: number;
  assignedto_id?: number;
  run_id: number;
  title: string;
  template_id: number;
  type_id: number;
  priority_id: number;
  estimate?: string;
  estimate_forecast?: string;
  refs?: string;
  milestone_id?: number;
  custom_expected?: string;
  custom_preconds?: string;
  custom_steps_separated?: any[];
}

export interface TestRailResult {
  id: number;
  test_id: number;
  status_id: number;
  created_by: number;
  created_on: number;
  assignedto_id?: number;
  comment?: string;
  version?: string;
  elapsed?: string;
  defects?: string;
  custom_step_results?: any[];
}

export interface TestRailActivity {
  id: string;
  userId: string;
  userName: string;
  activity: string;
  projectName?: string;
  testCaseTitle?: string;
  testRunName?: string;
  status?: string;
  comment?: string;
  timestamp: Date;
  type: 'test_execution' | 'test_case_update' | 'test_run_creation';
}

export interface JiraActivity {
  id: string;
  userId: string;
  userName: string;
  activity: string;
  issueKey?: string;
  issueTitle?: string;
  comment?: string;
  timestamp: Date;
  type: 'issue_created' | 'comment_added' | 'issue_updated';
}

export interface UserReport {
  user: User;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  testrailActivities: TestRailActivity[];
  jiraActivities: JiraActivity[];
  summary: {
    totalTestsExecuted: number;
    totalTestCasesUpdated: number;
    totalTestRunsCreated: number;
    totalJiraIssuesCreated: number;
    totalJiraCommentsAdded: number;
    totalActivities: number;
  };
}

export interface ReportExport {
  data: UserReport[];
  csvContent: string;
  filename: string;
  timestamp: Date;
}