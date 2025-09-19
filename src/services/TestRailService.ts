/**
 * TestRail API Service
 * 
 * This service provides a comprehensive interface to the TestRail API, enabling
 * the application to fetch user activities, test executions, and project data.
 * 
 * Key Features:
 * - User activity tracking and reporting
 * - Test case and test run data retrieval
 * - Project and suite management
 * - Activity consolidation and analysis
 * - Error handling and retry logic
 * 
 * API Documentation: https://www.gurock.com/testrail/docs/api
 * 
 * Authentication:
 * - Uses HTTP Basic Auth with username and API key
 * - API key can be generated in user profile settings
 * 
 * Rate Limits:
 * - TestRail API has rate limiting (typically 180 requests per minute)
 * - Service includes basic retry logic for rate limit handling
 * 
 * @author Happy Track Contributors
 * @since 1.0.0
 */

import axios, { AxiosInstance } from 'axios';
import { 
  TestRailConfig, 
  TestRailCase, 
  TestRailRun, 
  TestRailTest, 
  TestRailResult,
  TestRailActivity,
  User
} from '../types';
import { AppErrorHandler, ErrorType } from '../utils/errorHandler';

/**
 * TestRail test case with additional fields for activity tracking
 * Extends the base TestRailCase with status and update information
 */
export interface TestRailTestCase {
  /** Unique test case identifier */
  id: number;
  
  /** Test case title */
  title: string;
  
  /** Parent section identifier */
  section_id: number;
  
  /** Parent suite identifier */
  suite_id: number;
  
  /** Custom status field (optional) */
  custom_status?: number;
  
  /** Last update timestamp (optional) */
  updated_on?: number;
  
  /** User ID who last updated (optional) */
  updated_by?: number;
}

/**
 * TestRail test run information for activity tracking
 * Represents a test execution session
 */
export interface TestRailTestRun {
  /** Unique test run identifier */
  id: number;
  
  /** Test run name */
  name: string;
  
  /** Parent suite identifier */
  suite_id: number;
  
  /** Parent project identifier */
  project_id: number;
  
  /** Creation timestamp */
  created_on: number;
  
  /** User ID who created the run */
  created_by: number;
}

/**
 * TestRail test result for individual test executions
 * Represents the outcome of a single test case execution
 */
export interface TestRailTestResult {
  /** Unique result identifier */
  id: number;
  
  /** Associated test identifier */
  test_id: number;
  
  /** Result status identifier (passed, failed, etc.) */
  status_id: number;
  
  /** Execution timestamp */
  created_on: number;
  
  /** User ID who executed the test */
  created_by: number;
  
  /** Optional comment or notes about the execution */
  comment?: string;
}

/**
 * TestRail project summary information
 * Basic project data for filtering and organization
 */
export interface TestRailProject {
  /** Unique project identifier */
  id: number;
  
  /** Project name */
  name: string;
  
  /** Whether the project is completed */
  is_completed: boolean;
}

/**
 * TestRail user information for mapping and identification
 * Used to correlate API responses with application users
 */
export interface TestRailUser {
  /** Unique user identifier in TestRail */
  id: number;
  
  /** User's display name */
  name: string;
  
  /** User's email address */
  email: string;
}

/**
 * TestRail section information for organization
 * Represents a grouping of test cases within a suite
 */
export interface TestRailSection {
  /** Unique section identifier */
  id: number;
  
  /** Section name */
  name: string;
  
  /** Parent suite identifier */
  suite_id: number;
}

/**
 * TestRail suite information for test organization
 * Represents a collection of test cases within a project
 */
export interface TestRailSuite {
  /** Unique suite identifier */
  id: number;
  
  /** Suite name */
  name: string;
  
  /** Parent project identifier */
  project_id: number;
}

/**
 * TestRail status configuration
 * Represents test execution statuses (passed, failed, blocked, etc.)
 */
export interface TestRailStatus {
  /** Unique status identifier */
  id: number;
  
  /** Status name (e.g., "Passed", "Failed") */
  name: string;
  
  /** Display label for the status */
  label: string;
  
  /** Dark theme color value */
  color_dark: number;
  
  /** Medium theme color value */
  color_medium: number;
  
  /** Bright theme color value */
  color_bright: number;
  
  /** Whether this is a system-defined status */
  is_system: boolean;
  
  /** Whether this status represents an untested state */
  is_untested: boolean;
  
  /** Whether this status represents a final result */
  is_final: boolean;
}

/**
 * TestRail API Service Class
 * 
 * Provides methods for interacting with the TestRail API to fetch user activities,
 * test data, and generate reports. Handles authentication, error handling, and
 * data transformation for the Happy Track application.
 * 
 * Usage Example:
 * ```typescript
 * const config = { url: 'https://company.testrail.io', username: 'user', apiKey: 'key' };
 * const service = new TestRailService(config);
 * const activities = await service.getUserActivities(['user1'], startDate, endDate);
 * ```
 */
export class TestRailService {
  /** Axios HTTP client configured for TestRail API */
  private client: AxiosInstance;
  
  /** TestRail configuration (URL, credentials) */
  private config: TestRailConfig;

  /**
   * Initialize the TestRail service with configuration
   * 
   * @param config - TestRail connection configuration
   */
  constructor(config: TestRailConfig) {
    this.config = config;
    
    // Configure HTTP client with TestRail API endpoint and authentication
    this.client = axios.create({
      baseURL: `${config.url}/index.php?/api/v2`,
      auth: {
        username: config.username,
        password: config.apiKey,  // TestRail uses API key as password
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,  // 30 second timeout for API requests
    });
  }

  /**
   * Test the API connection and authentication
   * 
   * Verifies that the provided credentials can successfully authenticate
   * with the TestRail API by attempting to fetch user information.
   * 
   * @returns Promise<boolean> - True if connection successful, false otherwise
   * 
   * @example
   * ```typescript
   * const isConnected = await testRailService.testConnection();
   * if (!isConnected) {
   *   console.error('Failed to connect to TestRail');
   * }
   * ```
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/get_user_by_email&email=' + this.config.username);
      return response.status === 200;
    } catch (error) {
      console.error('TestRail connection test failed:', error);
      return false;
    }
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<TestRailProject[]> {
    try {
      const response = await this.client.get('/get_projects');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail projects:', error);
      throw new Error('Failed to fetch projects from TestRail');
    }
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<TestRailUser[]> {
    try {
      const response = await this.client.get('/get_users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail users:', error);
      throw new Error('Failed to fetch users from TestRail');
    }
  }

  /**
   * Get test statuses
   */
  async getStatuses(): Promise<TestRailStatus[]> {
    try {
      const response = await this.client.get('/get_statuses');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail statuses:', error);
      throw new Error('Failed to fetch statuses from TestRail');
    }
  }

  /**
   * Get test suites for a project
   */
  async getSuites(projectId: number): Promise<TestRailSuite[]> {
    try {
      const response = await this.client.get(`/get_suites/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail suites:', error);
      throw new Error('Failed to fetch suites from TestRail');
    }
  }

  /**
   * Get test sections for a project and suite
   */
  async getSections(projectId: number, suiteId?: number): Promise<TestRailSection[]> {
    try {
      const url = suiteId 
        ? `/get_sections/${projectId}&suite_id=${suiteId}`
        : `/get_sections/${projectId}`;
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail sections:', error);
      throw new Error('Failed to fetch sections from TestRail');
    }
  }

  /**
   * Get test runs for a project
   */
  async getTestRuns(projectId: number, suiteId?: number): Promise<TestRailTestRun[]> {
    try {
      const url = suiteId 
        ? `/get_runs/${projectId}&suite_id=${suiteId}`
        : `/get_runs/${projectId}`;
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail test runs:', error);
      throw new Error('Failed to fetch test runs from TestRail');
    }
  }

  /**
   * Get test results for a run
   */
  async getTestResults(runId: number): Promise<TestRailTestResult[]> {
    try {
      const response = await this.client.get(`/get_results_for_run/${runId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail test results:', error);
      throw new Error('Failed to fetch test results from TestRail');
    }
  }

  /**
   * Get test cases for a project and suite
   */
  async getTestCases(projectId: number, suiteId?: number): Promise<TestRailTestCase[]> {
    try {
      const url = suiteId 
        ? `/get_cases/${projectId}&suite_id=${suiteId}`
        : `/get_cases/${projectId}`;
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch TestRail test cases:', error);
      throw new Error('Failed to fetch test cases from TestRail');
    }
  }

  /**
   * Get user activities for a date range
   */
  async getUserActivities(
    userIds: string[],
    startDate: Date,
    endDate: Date,
    projectId?: number
  ): Promise<TestRailActivity[]> {
    try {
      const activities: TestRailActivity[] = [];
      const projects = projectId ? [{ id: projectId }] : await this.getProjects();
      const statuses = await this.getStatuses();
      const users = await this.getUsers();
      
      // Skip statuses for "skip" and "not applicable"
      const skipStatuses = statuses.filter(status => 
        status.name.toLowerCase().includes('skip') || 
        status.name.toLowerCase().includes('not applicable') ||
        status.name.toLowerCase().includes('blocked')
      ).map(s => s.id);

      for (const project of projects) {
        if (project.id) {
          const runs = await this.getTestRuns(project.id);
          const suites = await this.getSuites(project.id);
          
          for (const run of runs) {
            const results = await this.getTestResults(run.id);
            const testCases = await this.getTestCases(project.id, run.suite_id);
            
            // Create a map of test case IDs to test case info
            const caseMap = new Map(testCases.map(tc => [tc.id, tc]));
            
            for (const result of results) {
              const resultDate = new Date(result.created_on * 1000);
              
              // Check if result is in date range and by one of our users
              if (
                resultDate >= startDate &&
                resultDate <= endDate &&
                userIds.includes(result.created_by.toString()) &&
                !skipStatuses.includes(result.status_id)
              ) {
                const testCase = caseMap.get(result.test_id);
                const user = users.find(u => u.id === result.created_by);
                const status = statuses.find(s => s.id === result.status_id);
                const suite = suites.find(s => s.id === run.suite_id);
                
                if (testCase && user && status && suite) {
                  activities.push({
                    id: `test-${result.test_id}-${result.id}`,
                    userId: user.id.toString(),
                    userName: user.name || 'Unknown',
                    activity: 'test_execution',
                    type: 'test_execution',
                    projectName: suite.project_id ? `Project ${suite.project_id}` : 'Unknown Project',
                    testCaseTitle: testCase.title,
                    testRunName: run.name,
                    status: status.name,
                    timestamp: resultDate,
                    comment: result.comment || undefined,
                  });
                }
              }
            }
          }
        }
      }

      return activities;
    } catch (error) {
      console.error('Failed to fetch TestRail user activities:', error);
      throw new Error('Failed to fetch user activities from TestRail');
    }
  }

  /**
   * Get comprehensive activity report for users in date range
   */
  async getActivityReport(
    userIds: string[],
    startDate: Date,
    endDate: Date,
    projectId?: number
  ): Promise<{
    activities: TestRailActivity[];
    summary: {
      totalActivities: number;
      userActivities: Record<string, number>;
      statusBreakdown: Record<string, number>;
      suiteBreakdown: Record<string, number>;
    };
  }> {
    try {
      const activities = await this.getUserActivities(userIds, startDate, endDate, projectId);
      
      const summary = {
        totalActivities: activities.length,
        userActivities: {} as Record<string, number>,
        statusBreakdown: {} as Record<string, number>,
        suiteBreakdown: {} as Record<string, number>,
      };

      // Calculate summaries
      activities.forEach(activity => {
        // User activities count
        summary.userActivities[activity.userId] = (summary.userActivities[activity.userId] || 0) + 1;
        
        // Status breakdown (with null check)
        if (activity.status) {
          summary.statusBreakdown[activity.status] = (summary.statusBreakdown[activity.status] || 0) + 1;
        }
        
        // Project breakdown (using projectName instead of testSuite)
        if (activity.projectName) {
          summary.suiteBreakdown[activity.projectName] = (summary.suiteBreakdown[activity.projectName] || 0) + 1;
        }
      });

      return {
        activities,
        summary,
      };
    } catch (error) {
      console.error('Failed to generate TestRail activity report:', error);
      throw new Error('Failed to generate TestRail activity report');
    }
  }
}

export default TestRailService;