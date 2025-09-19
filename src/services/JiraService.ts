import axios, { AxiosInstance } from 'axios';
import { JiraConfig, JiraActivity } from '../types';

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
      statusCategory: {
        name: string;
      };
    };
    creator: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    };
    reporter: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    };
    created: string;
    updated: string;
    project: {
      key: string;
      name: string;
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
  };
}

export interface JiraComment {
  id: string;
  author: {
    accountId: string;
    displayName: string;
    emailAddress?: string;
  };
  body: any; // Atlassian Document Format
  created: string;
  updated: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  active: boolean;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

export interface JiraSearchResult {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

export class JiraService {
  private client: AxiosInstance;
  private config: JiraConfig;

  constructor(config: JiraConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.url}/rest/api/3`,
      auth: {
        username: config.username,
        password: config.apiToken,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/myself');
      return response.status === 200;
    } catch (error) {
      console.error('Jira connection test failed:', error);
      return false;
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<JiraUser> {
    try {
      const response = await this.client.get('/myself');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current Jira user:', error);
      throw new Error('Failed to fetch current user from Jira');
    }
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<JiraProject[]> {
    try {
      const response = await this.client.get('/project');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Jira projects:', error);
      throw new Error('Failed to fetch projects from Jira');
    }
  }

  /**
   * Search for users
   */
  async searchUsers(query?: string): Promise<JiraUser[]> {
    try {
      const params = query ? { query } : {};
      const response = await this.client.get('/users/search', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to search Jira users:', error);
      throw new Error('Failed to search users in Jira');
    }
  }

  /**
   * Get user by account ID
   */
  async getUser(accountId: string): Promise<JiraUser> {
    try {
      const response = await this.client.get(`/user?accountId=${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Jira user:', error);
      throw new Error('Failed to fetch user from Jira');
    }
  }

  /**
   * Search for issues using JQL
   */
  async searchIssues(
    jql: string,
    fields?: string[],
    expand?: string[],
    maxResults: number = 100,
    startAt: number = 0
  ): Promise<JiraSearchResult> {
    try {
      const params: any = {
        jql,
        maxResults,
        startAt,
      };

      if (fields && fields.length > 0) {
        params.fields = fields.join(',');
      }

      if (expand && expand.length > 0) {
        params.expand = expand.join(',');
      }

      const response = await this.client.get('/search', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to search Jira issues:', error);
      throw new Error('Failed to search issues in Jira');
    }
  }

  /**
   * Get comments for an issue
   */
  async getIssueComments(issueKey: string): Promise<JiraComment[]> {
    try {
      const response = await this.client.get(`/issue/${issueKey}/comment`);
      return response.data.comments;
    } catch (error) {
      console.error('Failed to fetch Jira issue comments:', error);
      throw new Error('Failed to fetch issue comments from Jira');
    }
  }

  /**
   * Convert Atlassian Document Format to plain text
   */
  private extractTextFromADF(adf: any): string {
    if (!adf || typeof adf !== 'object') {
      return '';
    }

    let text = '';

    if (adf.type === 'text') {
      text += adf.text || '';
    }

    if (adf.content && Array.isArray(adf.content)) {
      for (const child of adf.content) {
        text += this.extractTextFromADF(child);
      }
    }

    // Add space after paragraphs
    if (adf.type === 'paragraph') {
      text += ' ';
    }

    return text;
  }

  /**
   * Get user activities for a date range
   */
  async getUserActivities(
    accountIds: string[],
    startDate: Date,
    endDate: Date,
    projectKey?: string
  ): Promise<JiraActivity[]> {
    try {
      const activities: JiraActivity[] = [];
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Build JQL for created issues
      const accountIdsJql = accountIds.map(id => `"${id}"`).join(',');
      let createdJql = `creator in (${accountIdsJql}) AND created >= "${startDateStr}" AND created <= "${endDateStr} 23:59"`;
      
      if (projectKey) {
        createdJql += ` AND project = "${projectKey}"`;
      }

      // Search for created issues
      const createdIssues = await this.searchIssues(
        createdJql,
        ['summary', 'created', 'creator', 'project', 'issuetype'],
        undefined,
        1000
      );

      // Process created issues
      for (const issue of createdIssues.issues) {
        activities.push({
          id: `${issue.key}-created`,
          userId: issue.fields.creator.accountId,
          userName: issue.fields.creator.displayName || 'Unknown',
          issueKey: issue.key,
          issueTitle: issue.fields.summary,
          activity: 'created',
          type: 'issue_created',
          timestamp: new Date(issue.fields.created),
        });
      }

      // For comments, we need to search issues that were updated in the date range
      // and then check comments by our users
      let updatedJql = `updated >= "${startDateStr}" AND updated <= "${endDateStr} 23:59"`;
      if (projectKey) {
        updatedJql += ` AND project = "${projectKey}"`;
      }

      const updatedIssues = await this.searchIssues(
        updatedJql,
        ['summary', 'updated', 'project'],
        undefined,
        1000
      );

      // Check comments for each updated issue
      for (const issue of updatedIssues.issues) {
        try {
          const comments = await this.getIssueComments(issue.key);
          
          for (const comment of comments) {
            const commentDate = new Date(comment.created);
            
            // Check if comment is in our date range and by one of our users
            if (
              commentDate >= startDate &&
              commentDate <= endDate &&
              accountIds.includes(comment.author.accountId)
            ) {
              activities.push({
                id: `${issue.key}-comment-${comment.id}`,
                userId: comment.author.accountId,
                userName: comment.author.displayName || 'Unknown',
                issueKey: issue.key,
                issueTitle: issue.fields.summary,
                activity: 'commented',
                type: 'comment_added',
                timestamp: new Date(comment.created),
                comment: this.extractTextFromADF(comment.body),
              });
            }
          }
        } catch (error) {
          // If we can't fetch comments for an issue, log but continue
          console.warn(`Failed to fetch comments for issue ${issue.key}:`, error);
        }
      }

      // Sort activities by timestamp
      activities.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      return activities;
    } catch (error) {
      console.error('Failed to fetch Jira user activities:', error);
      throw new Error('Failed to fetch user activities from Jira');
    }
  }

  /**
   * Get comprehensive activity report for users in date range
   */
  async getActivityReport(
    accountIds: string[],
    startDate: Date,
    endDate: Date,
    projectKey?: string
  ): Promise<{
    activities: JiraActivity[];
    summary: {
      totalActivities: number;
      userActivities: Record<string, number>;
      activityTypeBreakdown: Record<string, number>;
      newIssuesCount: number;
      commentsCount: number;
    };
  }> {
    try {
      const activities = await this.getUserActivities(accountIds, startDate, endDate, projectKey);
      
      const summary = {
        totalActivities: activities.length,
        userActivities: {} as Record<string, number>,
        activityTypeBreakdown: {} as Record<string, number>,
        newIssuesCount: 0,
        commentsCount: 0,
      };

      // Calculate summaries
      activities.forEach(activity => {
        // User activities count
        summary.userActivities[activity.userId] = (summary.userActivities[activity.userId] || 0) + 1;
        
        // Activity type breakdown
        summary.activityTypeBreakdown[activity.activity] = (summary.activityTypeBreakdown[activity.activity] || 0) + 1;
        
        // Specific counts
        if (activity.activity === 'created') {
          summary.newIssuesCount++;
        } else if (activity.activity === 'commented') {
          summary.commentsCount++;
        }
      });

      return {
        activities,
        summary,
      };
    } catch (error) {
      console.error('Failed to generate Jira activity report:', error);
      throw new Error('Failed to generate Jira activity report');
    }
  }

  /**
   * Get user activities with issue details
   */
  async getUserActivitiesDetailed(
    accountIds: string[],
    startDate: Date,
    endDate: Date,
    projectKey?: string
  ): Promise<{
    activities: JiraActivity[];
    issueDetails: Record<string, JiraIssue>;
  }> {
    try {
      const activities = await this.getUserActivities(accountIds, startDate, endDate, projectKey);
      const issueKeys = [...new Set(activities.map(a => a.issueKey))];
      const issueDetails: Record<string, JiraIssue> = {};

      // Fetch detailed information for all involved issues
      for (const issueKey of issueKeys) {
        if (issueKey) {
          try {
            const response = await this.client.get(`/issue/${issueKey}`);
            issueDetails[issueKey] = response.data;
          } catch (error) {
            console.warn(`Failed to fetch details for issue ${issueKey}:`, error);
          }
        }
      }

      return {
        activities,
        issueDetails,
      };
    } catch (error) {
      console.error('Failed to fetch detailed Jira user activities:', error);
      throw new Error('Failed to fetch detailed user activities from Jira');
    }
  }
}

export default JiraService;