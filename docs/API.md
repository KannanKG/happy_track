# 🔌 API Integration Guide

This document provides detailed information about the API integrations in Happy Track, including TestRail and Jira APIs, authentication, error handling, and usage patterns.

## 📋 Table of Contents

- [TestRail API Integration](#-testrail-api-integration)
- [Jira API Integration](#-jira-api-integration)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Rate Limiting](#-rate-limiting)
- [Data Flow](#-data-flow)
- [Testing APIs](#-testing-apis)

## 🧪 TestRail API Integration

### Overview
Happy Track integrates with TestRail to fetch user activities including test executions, case updates, and run creation.

### Base Configuration
```typescript
interface TestRailConfig {
  url: string;        // e.g., "https://company.testrail.io"
  username: string;   // TestRail username
  apiKey: string;     // API key from user profile
}
```

### Key Endpoints Used

#### User Activities
```http
GET /get_results_for_run/{run_id}
GET /get_tests/{run_id}
GET /get_runs/{project_id}
```

#### Project Data
```http
GET /get_projects
GET /get_suites/{project_id}
GET /get_cases/{project_id}
```

#### User Management
```http
GET /get_users
GET /get_user_by_email&email={email}
```

### Data Structures

#### TestRail Activity
```typescript
interface TestRailActivity {
  id: string;
  userId: string;
  userName: string;
  activity: 'test_execution' | 'case_update' | 'run_creation';
  type: string;
  projectName: string;
  testCaseTitle?: string;
  testRunName?: string;
  status?: string;
  timestamp: Date;
  comment?: string;
}
```

### Usage Example
```typescript
const testRailService = new TestRailService({
  url: 'https://company.testrail.io',
  username: 'user@company.com',
  apiKey: 'your-api-key'
});

// Test connection
const isConnected = await testRailService.testConnection();

// Get user activities
const activities = await testRailService.getUserActivities(
  ['user1', 'user2'],
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

## 🎫 Jira API Integration

### Overview
Happy Track integrates with Jira to track issue creation and comment activities across projects.

### Base Configuration
```typescript
interface JiraConfig {
  url: string;          // e.g., "https://company.atlassian.net"
  username: string;     // Jira username
  apiToken: string;     // API token from account settings
  projectKey?: string;  // Optional default project filter
}
```

### Key Endpoints Used

#### Issue Activities
```http
GET /rest/api/3/search
GET /rest/api/3/issue/{issueKey}/comment
```

#### Project Data
```http
GET /rest/api/3/project
GET /rest/api/3/project/{projectKey}
```

#### User Management
```http
GET /rest/api/3/users/search
GET /rest/api/3/myself
```

### JQL Queries

#### Recent Issues Created
```jql
project = "{PROJECT}" AND created >= "{START_DATE}" AND created <= "{END_DATE}" AND creator = "{USER}"
```

#### Recent Comments
```jql
project = "{PROJECT}" AND commented >= "{START_DATE}" AND commented <= "{END_DATE}" AND commentAuthor = "{USER}"
```

### Data Structures

#### Jira Activity
```typescript
interface JiraActivity {
  id: string;
  userId: string;
  userName: string;
  activity: 'created' | 'commented';
  issueKey: string;
  issueTitle: string;
  projectKey: string;
  timestamp: Date;
  comment?: string;
}
```

### Usage Example
```typescript
const jiraService = new JiraService({
  url: 'https://company.atlassian.net',
  username: 'user@company.com',
  apiToken: 'your-api-token',
  projectKey: 'PROJ'
});

// Test connection
const isConnected = await jiraService.testConnection();

// Get user activities
const activities = await jiraService.getUserActivities(
  ['user1-account-id', 'user2-account-id'],
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

## 🔐 Authentication

### TestRail Authentication
TestRail uses HTTP Basic Authentication:
- **Username**: TestRail username (usually email)
- **Password**: API key (not actual password)

```typescript
// Axios configuration
const client = axios.create({
  baseURL: `${config.url}/index.php?/api/v2`,
  auth: {
    username: config.username,
    password: config.apiKey  // API key as password
  }
});
```

### Jira Authentication
Jira uses API tokens for authentication:
- **Username**: Jira username (email)
- **Password**: API token (generated in account settings)

```typescript
// Axios configuration
const client = axios.create({
  baseURL: `${config.url}/rest/api/3`,
  auth: {
    username: config.username,
    password: config.apiToken
  }
});
```

### Security Best Practices

1. **Store credentials securely** using electron-store
2. **Never log credentials** in console or files
3. **Use HTTPS only** for API connections
4. **Validate credentials** before storing
5. **Handle token expiration** gracefully

## ⚠️ Error Handling

### Common Error Types

#### Authentication Errors
```typescript
// TestRail: 401 Unauthorized
{
  status: 401,
  message: "Authentication failed"
}

// Jira: 401 Unauthorized
{
  status: 401,
  message: "Basic authentication failed"
}
```

#### Rate Limiting
```typescript
// TestRail: 429 Too Many Requests
{
  status: 429,
  message: "Rate limit exceeded"
}

// Jira: 429 Too Many Requests
{
  status: 429,
  headers: {
    'retry-after': '60' // seconds to wait
  }
}
```

#### Network Errors
```typescript
// Connection timeout
{
  code: 'ECONNABORTED',
  message: 'timeout of 30000ms exceeded'
}

// DNS resolution failed
{
  code: 'ENOTFOUND',
  message: 'getaddrinfo ENOTFOUND company.testrail.io'
}
```

### Error Handling Strategy

```typescript
async function makeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          throw new Error('Authentication failed. Check credentials.');
        case 403:
          throw new Error('Permission denied. Check user permissions.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(`API error: ${error.message}`);
      }
    }
    throw error;
  }
}
```

## ⏱️ Rate Limiting

### TestRail Rate Limits
- **Default**: ~180 requests per minute
- **Enterprise**: Higher limits available
- **Recommendation**: Implement exponential backoff

### Jira Rate Limits
- **Cloud**: 10,000 requests per hour per app
- **Server**: Varies by configuration
- **Recommendation**: Use bulk APIs when possible

### Implementation Strategy

```typescript
class RateLimiter {
  private lastRequest = 0;
  private minInterval = 100; // ms between requests

  async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      const delay = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequest = Date.now();
  }
}
```

## 🔄 Data Flow

### Activity Collection Process

1. **User Selection**: Users select date range and team members
2. **API Calls**: Parallel calls to TestRail and Jira APIs
3. **Data Processing**: Transform API responses to common format
4. **Activity Merging**: Combine activities from both platforms
5. **Report Generation**: Create consolidated reports and exports

### Data Transformation

```typescript
// Raw TestRail response → Activity
function transformTestRailResult(result: TestRailResult): TestRailActivity {
  return {
    id: `test-${result.test_id}-${result.id}`,
    userId: result.created_by.toString(),
    userName: getUserName(result.created_by),
    activity: 'test_execution',
    type: 'test_execution',
    projectName: getProjectName(result.project_id),
    testCaseTitle: getTestCaseTitle(result.test_id),
    status: getStatusName(result.status_id),
    timestamp: new Date(result.created_on * 1000),
    comment: result.comment
  };
}

// Raw Jira response → Activity  
function transformJiraIssue(issue: JiraIssue): JiraActivity {
  return {
    id: `issue-${issue.id}`,
    userId: issue.fields.creator.accountId,
    userName: issue.fields.creator.displayName,
    activity: 'created',
    issueKey: issue.key,
    issueTitle: issue.fields.summary,
    projectKey: issue.fields.project.key,
    timestamp: new Date(issue.fields.created)
  };
}
```

## 🧪 Testing APIs

### Connection Testing

```typescript
// Test TestRail connection
async function testTestRailConnection(config: TestRailConfig): Promise<boolean> {
  try {
    const service = new TestRailService(config);
    return await service.testConnection();
  } catch (error) {
    console.error('TestRail connection failed:', error);
    return false;
  }
}

// Test Jira connection
async function testJiraConnection(config: JiraConfig): Promise<boolean> {
  try {
    const service = new JiraService(config);
    return await service.testConnection();
  } catch (error) {
    console.error('Jira connection failed:', error);
    return false;
  }
}
```

### Manual Testing

#### Using curl for TestRail
```bash
# Test authentication
curl -u "username:api_key" \
  "https://company.testrail.io/index.php?/api/v2/get_projects"

# Get user activities
curl -u "username:api_key" \
  "https://company.testrail.io/index.php?/api/v2/get_runs/1"
```

#### Using curl for Jira
```bash
# Test authentication
curl -u "username:api_token" \
  "https://company.atlassian.net/rest/api/3/myself"

# Search for issues
curl -u "username:api_token" \
  "https://company.atlassian.net/rest/api/3/search?jql=created>=2024-01-01"
```

## 🔧 Development Tips

### API Response Caching
```typescript
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}
```

### Debugging API Calls
```typescript
// Add request/response interceptors
client.interceptors.request.use(request => {
  console.log('API Request:', request.method?.toUpperCase(), request.url);
  return request;
});

client.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
```

## 📚 Additional Resources

- [TestRail API Documentation](https://www.gurock.com/testrail/docs/api)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Happy Track Type Definitions](../src/types/index.ts)