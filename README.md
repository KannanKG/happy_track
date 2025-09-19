# 🚀 Happy Track - TestRail & Jira Activity Reporter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

A professional desktop application built with Electron and TypeScript for tracking and reporting user activities across TestRail and Jira platforms. Generate consolidated reports with automated email delivery.

> **🎯 Open Source & Contributors Welcome!** This project is designed to be easily picked up by new contributors. Comprehensive documentation, clean architecture, and detailed setup instructions make it perfect for developers looking to contribute to a real-world Electron application.

![Application Screenshot](docs/screenshot.png)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#-development)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [API Documentation](#-api-integration)
- [Security](#-security)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

### 🔐 Configuration Management
- **User Management**: Configure TestRail and Jira user mappings
- **API Integration**: Secure credential storage for TestRail and Jira APIs
- **Email Configuration**: SMTP settings for automated report delivery
- **Theme Support**: Dark and light mode with system preference detection

### 📊 Activity Tracking
- **TestRail Integration**: Track test executions, case updates, and run creation
- **Jira Integration**: Monitor issue creation and comment activities
- **Date Range Filtering**: Generate reports for specific time periods
- **User-Based Filtering**: Focus on specific team members or individuals

### 📈 Report Generation
- **Consolidated Dashboard**: Unified view of all user activities
- **Data Visualization**: Charts and graphs showing activity trends
- **CSV Export**: Export detailed reports for external analysis
- **Summary Statistics**: Quick overview of team productivity

### 📧 Email Automation
- **Automated Delivery**: Schedule regular report distribution
- **Template System**: Customizable email templates with placeholders
- **Attachment Support**: Include CSV reports as email attachments
- **Multiple Recipients**: Support for TO and CC email lists

### 🎨 Modern UI/UX
- **Professional Design**: Clean, modern interface built with Tailwind CSS
- **Responsive Layout**: Optimized for different screen sizes
- **Dark/Light Themes**: Automatic theme switching based on system preferences
- **Accessibility**: WCAG compliant interface elements

## Technology Stack

- **Framework**: Electron 31.0 for cross-platform desktop application
- **Language**: TypeScript 5.4 for type-safe development
- **Frontend**: React 18.3 with React Router for navigation
- **Styling**: Tailwind CSS 3.4 for modern, responsive design
- **State Management**: React Context API for global state
- **Data Storage**: Electron Store for persistent configuration
- **Email**: Nodemailer for SMTP email delivery
- **HTTP Client**: Axios for API communications
- **CSV Export**: csv-writer for data export functionality
- **Icons**: Heroicons for consistent iconography

## ⚡ Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/KannanKG/happy_track.git
cd happy_track
npm install

# 2. Start development
npm run dev

# 3. Build for production
npm run dist
```

**New Contributors:** Check out our [Contributing Guide](CONTRIBUTING.md) for detailed setup instructions and development workflow!

## Installation

### Prerequisites
- Node.js 18 or later
- npm (comes with Node.js)

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd happy_track

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build for current platform
npm run dist

# Build for specific platform
npm run dist:mac    # macOS
npm run dist:win    # Windows
npm run dist:linux  # Linux

# Build for all platforms
npm run dist:all
```

## Configuration

### TestRail Setup
1. Navigate to Configuration → TestRail
2. Enter your TestRail instance URL
3. Provide username and API key
4. Test connection to verify credentials

### Jira Setup
1. Navigate to Configuration → Jira
2. Enter your Jira instance URL
3. Provide username and API token
4. Test connection to verify credentials

### User Mapping
1. Add team members in the Users section
2. Map each user to their TestRail user ID
3. Map each user to their Jira account ID
4. Configure email addresses for reporting

### Email Configuration
1. Configure SMTP server settings
2. Set up authentication credentials
3. Define default recipients and email templates
4. Test email delivery

## Usage

### Generating Reports
1. **Select Date Range**: Choose the time period for the report
2. **Filter Users**: Select specific team members (optional)
3. **Generate Report**: Click "Generate Report" to fetch data
4. **Review Results**: Examine the consolidated activity dashboard
5. **Export Data**: Download CSV file or email the report

### Dashboard Features
- **Activity Overview**: See total activities across both platforms
- **User Breakdown**: Individual user activity summaries
- **Trend Analysis**: Visual representation of activity patterns
- **Quick Filters**: Filter by activity type, user, or date range

### Email Reports
- **Manual Sending**: Generate and send reports on-demand
- **Template Customization**: Modify email subject and body templates
- **Attachment Options**: Include CSV data or summary statistics
- **Delivery Confirmation**: Track email delivery status

## API Integration

### TestRail API
- **Projects**: Fetch available projects and test suites
- **Test Cases**: Retrieve test case information and updates
- **Test Runs**: Monitor test execution activities
- **Results**: Track test result submissions and comments
- **Users**: Map TestRail users to application users

### Jira API
- **Issues**: Search for issues created within date ranges
- **Comments**: Extract comment activities and content
- **Projects**: Fetch project information and metadata
- **Users**: Map Jira account IDs to application users
- **JQL Support**: Custom queries for advanced filtering

## Security

### Data Protection
- **Encrypted Storage**: API credentials stored securely using Electron Store
- **No Cloud Storage**: All data remains on the local machine
- **Secure Communication**: HTTPS-only API communications
- **Credential Validation**: Real-time credential verification

### Privacy
- **Local Processing**: All data processing happens locally
- **No Telemetry**: No usage data collection or transmission
- **User Control**: Complete control over data export and sharing
- **Audit Trail**: Track all configuration changes and data access

## Building and Distribution

See [BUILD.md](BUILD.md) for detailed instructions on:
- Building for different platforms
- Code signing for production
- Creating installers and packages
- Setting up auto-updates
- Distribution strategies

## 🏗️ Development

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 8+ (comes with Node.js)
- **Git** for version control
- **VS Code** (recommended) with TypeScript extension

### Development Setup
```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/happy_track.git
cd happy_track

# 2. Install dependencies
npm install

# 3. Start development server with hot reload
npm run dev

# 4. Optional: Start with style watching
npm run dev:styles
```

### Available Scripts
```bash
# Development
npm run dev              # Start Electron in development mode
npm run dev:watch        # Development with enhanced logging
npm run dev:styles       # Development with Tailwind CSS watching

# Building
npm run build           # Build all components
npm run build:main      # Build main process only
npm run build:renderer  # Build renderer process only

# Distribution
npm run dist            # Build for current platform
npm run dist:mac        # Build for macOS
npm run dist:win        # Build for Windows
npm run dist:linux      # Build for Linux
npm run dist:all        # Build for all platforms

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically
npm test               # Run test suite

# Styling
npm run tailwind:build  # Build Tailwind CSS
npm run tailwind:watch  # Watch Tailwind CSS changes
```

### Development Workflow
1. **Setup**: Fork repo, create feature branch
2. **Code**: Make changes with TypeScript/React
3. **Test**: Run `npm test` and `npm run lint`
4. **Build**: Verify with `npm run build`
5. **Submit**: Create pull request with description

### 🗂️ Project Structure
```
happy_track/
├── 📁 src/                          # Source code
│   ├── 🔧 main.ts                   # Electron main process (app lifecycle)
│   ├── 🔒 preload.ts                # Preload script (secure IPC bridge)
│   ├── 📁 types/                    # TypeScript definitions
│   │   ├── index.ts                 # Main type exports
│   │   ├── electron.d.ts            # Electron API types
│   │   └── global.d.ts              # Global type declarations
│   ├── 📁 services/                 # Business logic & API integrations
│   │   ├── TestRailService.ts       # TestRail API client
│   │   ├── JiraService.ts           # Jira API client
│   │   ├── ReportService.ts         # Data consolidation service
│   │   └── EmailService.ts          # Email automation service
│   ├── 📁 renderer/                 # React frontend (UI)
│   │   ├── App.tsx                  # Root React component
│   │   ├── index.tsx                # React entry point
│   │   ├── index.html               # HTML template
│   │   ├── 📁 components/           # React components
│   │   │   ├── 📁 layout/           # Layout components
│   │   │   │   ├── Header.tsx       # App header/navigation
│   │   │   │   └── Sidebar.tsx      # Navigation sidebar
│   │   │   ├── 📁 pages/            # Page components
│   │   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   │   ├── Configuration.tsx # Settings page
│   │   │   │   └── Reports.tsx      # Reports page
│   │   │   └── NotificationToast.tsx # Toast notifications
│   │   ├── 📁 contexts/             # React Context providers
│   │   │   ├── ConfigContext.tsx    # App configuration state
│   │   │   ├── ThemeContext.tsx     # Theme management
│   │   │   └── NotificationContext.tsx # Notifications
│   │   └── 📁 styles/               # CSS/Styling
│   │       ├── globals.css          # Global styles
│   │       ├── globals-basic.css    # Basic theme
│   │       └── output.css           # Generated Tailwind CSS
│   └── 📁 utils/                    # Utility functions
│       ├── errorHandler.ts          # Error handling utilities
│       └── validation.ts            # Input validation helpers
├── 📁 assets/                       # Static assets
│   ├── icon.png                     # App icon (256x256)
│   ├── icon-512.png                 # App icon (512x512)
│   ├── logo.png                     # Logo (1024x1024)
│   └── logo.svg                     # Vector logo
├── 📁 build/                        # Build resources
├── 📁 dist/                         # Compiled output
├── 📁 dist-electron/                # Electron build output
├── 📁 scripts/                      # Build scripts
├── 📁 docs/                         # Documentation
├── ⚙️ Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript config
│   ├── tsconfig.renderer.json       # Renderer TypeScript config
│   ├── webpack.*.config.js          # Webpack configurations
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   └── forge.config.js              # Electron Forge config
└── 📝 Documentation
    ├── README.md                    # This file
    ├── CONTRIBUTING.md              # Contribution guidelines
    ├── LICENSE                      # MIT License
    └── BUILD.md                     # Build instructions
```

### 🏛️ Architecture Overview

**Happy Track** follows a clean, modular architecture that separates concerns and makes the codebase easy to understand and extend:

#### 🔄 **Electron Multi-Process Architecture**
```
┌─────────────────┐    IPC     ┌─────────────────┐
│   Main Process  │ ◄─────────► │ Renderer Process│
│   (Node.js)     │             │   (Chromium)    │
│                 │             │                 │
│ • App lifecycle │             │ • React UI      │
│ • Menu & native │             │ • User interact │
│ • File system   │             │ • State mgmt    │
│ • Config store  │             │                 │
└─────────────────┘             └─────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│   Services      │             │   Components    │
│                 │             │                 │
│ • TestRail API  │             │ • Pages         │
│ • Jira API      │             │ • Layout        │
│ • Email SMTP    │             │ • Contexts      │
│ • Report Gen    │             │                 │
└─────────────────┘             └─────────────────┘
```

#### 📊 **Data Flow**
1. **User Input** → React Components
2. **State Changes** → Context Providers
3. **API Calls** → Service Classes
4. **Data Processing** → Report Service
5. **UI Updates** → React Re-render
6. **Persistence** → Electron Store

#### 🔌 **Service Layer**
- **TestRailService**: Handles TestRail API authentication, data fetching, and response parsing
- **JiraService**: Manages Jira API calls, issue querying, and comment extraction
- **EmailService**: SMTP configuration, email templating, and delivery
- **ReportService**: Data consolidation, CSV generation, and report formatting

#### 🎨 **UI Layer**
- **React Components**: Modular, reusable UI elements
- **Context Providers**: Global state management without external libraries
- **Tailwind CSS**: Utility-first styling for rapid development
- **TypeScript**: Type safety throughout the UI layer

### Testing
```bash
# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Troubleshooting

### Common Issues

1. **API Connection Failures**
   - Verify network connectivity
   - Check API credentials
   - Confirm API endpoint URLs
   - Review firewall settings

2. **Email Delivery Issues**
   - Verify SMTP server settings
   - Check authentication credentials
   - Test with different email providers
   - Review spam folder for delivered emails

3. **Data Export Problems**
   - Check file permissions
   - Verify available disk space
   - Confirm CSV format requirements
   - Test with smaller date ranges

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
DEBUG=true npm start
```

### Log Files
Application logs are stored in:
- **macOS**: `~/Library/Logs/TestRail & Jira Activity Reporter/`
- **Windows**: `%USERPROFILE%\\AppData\\Roaming\\TestRail & Jira Activity Reporter\\logs\\`
- **Linux**: `~/.config/TestRail & Jira Activity Reporter/logs/`

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your help makes Happy Track better for everyone.

### 🚀 Quick Contribution Guide

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💻 Code** your changes following our [style guide](CONTRIBUTING.md#coding-standards)
4. **✅ Test** your changes (`npm test && npm run lint`)
5. **📝 Commit** with clear messages (`git commit -m 'Add: amazing new feature'`)
6. **🚀 Push** to your branch (`git push origin feature/amazing-feature`)
7. **📬 Submit** a Pull Request

### 🎯 Good First Issues

Perfect for new contributors:
- 📝 **Documentation**: Improve code comments, README sections, or API docs
- 🐛 **Bug Fixes**: Fix small bugs or edge cases
- 🎨 **UI Improvements**: Enhance styling, accessibility, or user experience
- 🧪 **Tests**: Add unit tests or integration tests
- 🔧 **Refactoring**: Improve code organization or performance

### 💡 Contribution Ideas

- **🌐 API Integrations**: Add support for other project management tools
- **📊 Reporting**: New chart types or export formats
- **🔔 Notifications**: Desktop notifications or status indicators
- **🌍 Internationalization**: Multi-language support
- **♿ Accessibility**: WCAG compliance improvements
- **⚡ Performance**: Optimization and caching improvements

### 📋 Development Standards

- **TypeScript**: All new code must use TypeScript
- **Testing**: Add tests for new functionality
- **Documentation**: Update relevant docs and comments
- **Linting**: Code must pass ESLint checks
- **Formatting**: Use consistent code formatting

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)

### 🏆 Recognition

Contributors are recognized in our:
- 📜 **Contributors section** in README
- 🎉 **Release notes** for each version
- 💬 **Community discussions** and social media

Join our community of contributors and help make Happy Track even better!

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [FAQ](docs/FAQ.md) for common questions
- Review the [troubleshooting guide](docs/TROUBLESHOOTING.md)

## Roadmap

### Version 2.0
- [ ] Advanced filtering and search capabilities
- [ ] Custom dashboard widgets
- [ ] Scheduled report generation
- [ ] Multi-language support
- [ ] Plugin architecture for custom integrations

### Version 2.1
- [ ] Real-time activity monitoring
- [ ] Team collaboration features
- [ ] Advanced data visualization
- [ ] Mobile companion app
- [ ] Cloud backup and sync

---

Built with ❤️ using Electron, TypeScript, and React.