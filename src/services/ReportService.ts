import { format } from 'date-fns';
import { createObjectCsvWriter } from 'csv-writer';
import { User, UserReport, TestRailActivity, JiraActivity, AppConfig } from '../types';
import TestRailService from './TestRailService';
import JiraService from './JiraService';

export interface ConsolidatedActivity {
  user: User;
  date: string;
  source: 'TestRail' | 'Jira';
  activityType: string;
  description: string;
  details: string;
  timestamp: string;
}

export interface ReportSummary {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalUsers: number;
  totalActivities: number;
  testRailActivities: number;
  jiraActivities: number;
  userSummaries: Array<{
    user: User;
    testRailCount: number;
    jiraCount: number;
    totalCount: number;
  }>;
}

export class ReportService {
  private testRailService?: TestRailService;
  private jiraService?: JiraService;

  constructor(config: AppConfig) {
    if (config.testrail.url && config.testrail.username && config.testrail.apiKey) {
      this.testRailService = new TestRailService(config.testrail);
    }

    if (config.jira.url && config.jira.username && config.jira.apiToken) {
      this.jiraService = new JiraService(config.jira);
    }
  }

  /**
   * Test API connections
   */
  async testConnections(): Promise<{
    testRail: boolean;
    jira: boolean;
  }> {
    const result = {
      testRail: false,
      jira: false,
    };

    if (this.testRailService) {
      try {
        result.testRail = await this.testRailService.testConnection();
      } catch (error) {
        console.error('TestRail connection test failed:', error);
      }
    }

    if (this.jiraService) {
      try {
        result.jira = await this.jiraService.testConnection();
      } catch (error) {
        console.error('Jira connection test failed:', error);
      }
    }

    return result;
  }

  /**
   * Generate comprehensive report for users in date range
   */
  async generateReport(
    users: User[],
    startDate: Date,
    endDate: Date
  ): Promise<{
    reports: UserReport[];
    consolidated: ConsolidatedActivity[];
    summary: ReportSummary;
  }> {
    try {
      const reports: UserReport[] = [];
      const consolidated: ConsolidatedActivity[] = [];

      // Process each user
      for (const user of users) {
        const userReport: UserReport = {
          user,
          dateRange: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          testrailActivities: [],
          jiraActivities: [],
          summary: {
            totalTestsExecuted: 0,
            totalTestCasesUpdated: 0,
            totalTestRunsCreated: 0,
            totalJiraIssuesCreated: 0,
            totalJiraCommentsAdded: 0,
            totalActivities: 0,
          },
        };

        // Fetch TestRail activities
        if (this.testRailService && user.testrailId) {
          try {
            const testRailData = await this.testRailService.getActivityReport(
              [user.testrailId],
              startDate,
              endDate
            );
            
            userReport.testrailActivities = testRailData.activities;
            userReport.summary.totalTestsExecuted = testRailData.activities.length;

            // Add to consolidated activities
            testRailData.activities.forEach(activity => {
              consolidated.push({
                user,
                date: format(new Date(activity.timestamp), 'yyyy-MM-dd'),
                source: 'TestRail',
                activityType: `Test Case: ${activity.status || 'Unknown'}`,
                description: activity.testCaseTitle || 'Unknown Test Case',
                details: `Project: ${activity.projectName || 'Unknown'}, Run: ${activity.testRunName || 'Unknown'}${activity.comment ? `, Comment: ${activity.comment}` : ''}`,
                timestamp: activity.timestamp.toISOString(),
              });
            });
          } catch (error) {
            console.error(`Failed to fetch TestRail activities for user ${user.name}:`, error);
          }
        }

        // Fetch Jira activities
        if (this.jiraService && user.jiraAccountId) {
          try {
            const jiraAccountIds = [user.jiraAccountId];
            const jiraData = await this.jiraService.getActivityReport(
              jiraAccountIds,
              startDate,
              endDate
            );
            
            userReport.jiraActivities = jiraData.activities;
            userReport.summary.totalJiraIssuesCreated = jiraData.summary.newIssuesCount;
            userReport.summary.totalJiraCommentsAdded = jiraData.summary.commentsCount;

            // Add to consolidated activities
            jiraData.activities.forEach(activity => {
              consolidated.push({
                user,
                date: format(new Date(activity.timestamp), 'yyyy-MM-dd'),
                source: 'Jira',
                activityType: activity.activity === 'created' ? 'Issue Created' : 'Comment Added',
                description: activity.issueTitle || 'Unknown Issue',
                details: `Issue: ${activity.issueKey}${activity.comment ? `, Comment: ${activity.comment}` : ''}`,
                timestamp: activity.timestamp.toISOString(),
              });
            });
          } catch (error) {
            console.error(`Failed to fetch Jira activities for user ${user.name}:`, error);
          }
        }

        // Calculate total activities for the user
        userReport.summary.totalActivities = userReport.testrailActivities.length + userReport.jiraActivities.length;

        reports.push(userReport);
      }

      // Sort consolidated activities by timestamp
      consolidated.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Generate summary
      const summary: ReportSummary = {
        dateRange: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
        totalUsers: users.length,
        totalActivities: consolidated.length,
        testRailActivities: consolidated.filter(a => a.source === 'TestRail').length,
        jiraActivities: consolidated.filter(a => a.source === 'Jira').length,
        userSummaries: reports.map(report => ({
          user: report.user,
          testRailCount: report.testrailActivities.length,
          jiraCount: report.jiraActivities.length,
          totalCount: report.testrailActivities.length + report.jiraActivities.length,
        })),
      };

      return {
        reports,
        consolidated,
        summary,
      };
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw new Error('Failed to generate activity report');
    }
  }

  /**
   * Export consolidated report to CSV
   */
  async exportToCSV(
    consolidated: ConsolidatedActivity[],
    filePath: string
  ): Promise<void> {
    try {
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'user', title: 'User Name' },
          { id: 'email', title: 'Email' },
          { id: 'date', title: 'Date' },
          { id: 'source', title: 'Source' },
          { id: 'activityType', title: 'Activity Type' },
          { id: 'description', title: 'Description' },
          { id: 'details', title: 'Details' },
          { id: 'timestamp', title: 'Timestamp' },
        ],
      });

      const records = consolidated.map(activity => ({
        user: activity.user.name,
        email: activity.user.email,
        date: activity.date,
        source: activity.source,
        activityType: activity.activityType,
        description: activity.description,
        details: activity.details,
        timestamp: activity.timestamp,
      }));

      await csvWriter.writeRecords(records);
    } catch (error) {
      console.error('Failed to export to CSV:', error);
      throw new Error('Failed to export report to CSV');
    }
  }

  /**
   * Export user summary to CSV
   */
  async exportSummaryToCSV(
    summary: ReportSummary,
    filePath: string
  ): Promise<void> {
    try {
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'user', title: 'User Name' },
          { id: 'email', title: 'Email' },
          { id: 'testRailCount', title: 'TestRail Activities' },
          { id: 'jiraCount', title: 'Jira Activities' },
          { id: 'totalCount', title: 'Total Activities' },
          { id: 'dateRange', title: 'Date Range' },
        ],
      });

      const records = summary.userSummaries.map(userSummary => ({
        user: userSummary.user.name,
        email: userSummary.user.email,
        testRailCount: userSummary.testRailCount,
        jiraCount: userSummary.jiraCount,
        totalCount: userSummary.totalCount,
        dateRange: `${summary.dateRange.startDate} to ${summary.dateRange.endDate}`,
      }));

      await csvWriter.writeRecords(records);
    } catch (error) {
      console.error('Failed to export summary to CSV:', error);
      throw new Error('Failed to export summary to CSV');
    }
  }

  /**
   * Generate activity breakdown by user and date
   */
  getActivityBreakdown(consolidated: ConsolidatedActivity[]): {
    byUser: Record<string, ConsolidatedActivity[]>;
    byDate: Record<string, ConsolidatedActivity[]>;
    bySource: Record<string, ConsolidatedActivity[]>;
  } {
    const byUser: Record<string, ConsolidatedActivity[]> = {};
    const byDate: Record<string, ConsolidatedActivity[]> = {};
    const bySource: Record<string, ConsolidatedActivity[]> = {};

    consolidated.forEach(activity => {
      // By user
      const userName = activity.user.name;
      if (!byUser[userName]) byUser[userName] = [];
      byUser[userName].push(activity);

      // By date
      if (!byDate[activity.date]) byDate[activity.date] = [];
      byDate[activity.date].push(activity);

      // By source
      if (!bySource[activity.source]) bySource[activity.source] = [];
      bySource[activity.source].push(activity);
    });

    return { byUser, byDate, bySource };
  }

  /**
   * Get activity statistics
   */
  getActivityStatistics(consolidated: ConsolidatedActivity[]): {
    totalActivities: number;
    averageActivitiesPerUser: number;
    averageActivitiesPerDay: number;
    mostActiveUser: { user: User; count: number } | null;
    mostActiveDay: { date: string; count: number } | null;
    activityTypeDistribution: Record<string, number>;
  } {
    const breakdown = this.getActivityBreakdown(consolidated);
    
    // Calculate statistics
    const totalActivities = consolidated.length;
    const uniqueUsers = Object.keys(breakdown.byUser).length;
    const uniqueDays = Object.keys(breakdown.byDate).length;
    
    const averageActivitiesPerUser = uniqueUsers > 0 ? totalActivities / uniqueUsers : 0;
    const averageActivitiesPerDay = uniqueDays > 0 ? totalActivities / uniqueDays : 0;

    // Most active user
    let mostActiveUser: { user: User; count: number } | null = null;
    Object.entries(breakdown.byUser).forEach(([userName, activities]) => {
      if (!mostActiveUser || activities.length > mostActiveUser.count) {
        mostActiveUser = {
          user: activities[0].user,
          count: activities.length,
        };
      }
    });

    // Most active day
    let mostActiveDay: { date: string; count: number } | null = null;
    Object.entries(breakdown.byDate).forEach(([date, activities]) => {
      if (!mostActiveDay || activities.length > mostActiveDay.count) {
        mostActiveDay = {
          date,
          count: activities.length,
        };
      }
    });

    // Activity type distribution
    const activityTypeDistribution: Record<string, number> = {};
    consolidated.forEach(activity => {
      activityTypeDistribution[activity.activityType] = 
        (activityTypeDistribution[activity.activityType] || 0) + 1;
    });

    return {
      totalActivities,
      averageActivitiesPerUser,
      averageActivitiesPerDay,
      mostActiveUser,
      mostActiveDay,
      activityTypeDistribution,
    };
  }
}

export default ReportService;