# 🤝 Contributing to Happy Track

Thank you for your interest in contributing to Happy Track! This guide will help you get started with contributing to our TestRail & Jira Activity Reporter.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Release Process](#-release-process)

## 🤗 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors:

- **Be respectful** and considerate to other contributors
- **Be patient** with newcomers and provide constructive feedback
- **Focus on what's best** for the community and the project
- **Show empathy** towards other community members
- **Use inclusive language** and be mindful of different perspectives

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 8.0.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) with these extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

### First-Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/happy_track.git
   cd happy_track
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/KannanKG/happy_track.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Verify setup**:
   ```bash
   npm run dev
   ```

## 🔧 Development Setup

### Environment Configuration

1. **Development Environment**:
   ```bash
   # Start development with hot reload
   npm run dev
   
   # Start with enhanced logging
   npm run dev:watch
   
   # Start with Tailwind CSS watching
   npm run dev:styles
   ```

2. **Environment Variables** (optional):
   ```bash
   # Create .env file for development
   DEBUG=true
   ELECTRON_ENABLE_LOGGING=true
   ```

### Project Structure Understanding

```
src/
├── main.ts                 # 🔧 Electron main process
├── preload.ts             # 🔒 Security bridge
├── types/                 # 📝 TypeScript definitions
├── services/              # 🔌 API & business logic
├── renderer/              # 🎨 React frontend
│   ├── components/        # 🧩 UI components
│   ├── contexts/          # 🌐 State management
│   └── styles/           # 💄 CSS/Tailwind
└── utils/                # 🛠️ Helper functions
```

### Development Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint          # Check code style
   npm test             # Run test suite
   npm run build        # Verify build works
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

## 📏 Coding Standards

### TypeScript Guidelines

- **Always use TypeScript** for new files
- **Define proper types** for all function parameters and return values
- **Use interfaces** for object shapes
- **Prefer type unions** over `any`
- **Add JSDoc comments** for public methods

```typescript
/**
 * Fetches user activities from TestRail API
 * @param userIds - Array of TestRail user IDs
 * @param startDate - Start date for activity search
 * @param endDate - End date for activity search
 * @returns Promise resolving to user activities
 */
async getUserActivities(
  userIds: string[],
  startDate: Date,
  endDate: Date
): Promise<TestRailActivity[]> {
  // Implementation
}
```

### React Component Guidelines

- **Use functional components** with hooks
- **Define prop types** using interfaces
- **Use React.FC** for component typing
- **Implement proper error boundaries**
- **Follow component composition** patterns

```typescript
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  isSelected?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  isSelected = false 
}) => {
  // Component implementation
};
```

### Styling Guidelines

- **Use Tailwind CSS** utility classes
- **Follow mobile-first** responsive design
- **Maintain consistent spacing** using Tailwind's scale
- **Use CSS custom properties** for theme variables
- **Keep styles co-located** with components

```tsx
// Good: Tailwind utility classes
<button className="btn-primary px-4 py-2 rounded-lg hover:bg-blue-600 transition">
  Click me
</button>

// Avoid: Inline styles
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Click me
</button>
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- **Services**: `PascalCase.ts` (e.g., `TestRailService.ts`)
- **Utilities**: `camelCase.ts` (e.g., `errorHandler.ts`)
- **Types**: `index.ts` or descriptive names
- **Constants**: `UPPER_SNAKE_CASE`

### Import Organization

```typescript
// 1. Node modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal modules (absolute paths)
import { User, TestRailConfig } from '../types';
import { TestRailService } from '../services/TestRailService';

// 3. Relative imports
import './UserCard.css';
```

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
# Good commit messages
feat(reports): add CSV export functionality
fix(auth): resolve TestRail API authentication issue
docs(readme): update installation instructions
style(components): format UserCard component
refactor(services): extract common API error handling
perf(renderer): optimize React component re-renders
test(services): add unit tests for EmailService
chore(deps): update electron to v31.0.0

# Bad commit messages
fixed bug
update stuff
changes
WIP
```

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run quality checks**:
   ```bash
   npm run lint:fix      # Fix linting issues
   npm test             # Run tests
   npm run build        # Verify build
   ```

3. **Update documentation** if needed

### PR Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots of UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by at least one maintainer
3. **Manual testing** for UI changes
4. **Documentation review** for new features
5. **Approval and merge** by maintainer

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template and include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Node.js version, etc.)
- **Screenshots** if applicable
- **Console logs** or error messages

### Feature Requests

Use the feature request template and include:

- **Problem description** you're trying to solve
- **Proposed solution** with detailed explanation
- **Alternative solutions** considered
- **Additional context** or mockups

### Security Issues

**DO NOT** create public issues for security vulnerabilities. Instead:

1. Email security@happytrack.dev (if available)
2. Include detailed description
3. Wait for acknowledgment before disclosure

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- UserCard.test.tsx
```

### Writing Tests

- **Unit tests** for services and utilities
- **Component tests** for React components
- **Integration tests** for API interactions
- **E2E tests** for critical user flows

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} onEdit={() => {}} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for all public methods
- **README updates** for new features
- **Type definitions** with descriptive comments
- **Component prop documentation**

### Documentation Updates

When adding features, update:

- `README.md` - User-facing documentation
- `CONTRIBUTING.md` - Development guidelines
- Inline code comments
- Type definitions
- API documentation

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Test release build
5. Create GitHub release
6. Update documentation

## 🎯 Good First Issues

Looking for ways to contribute? Check issues labeled:

- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `documentation` - Documentation improvements
- `bug` - Bug fixes needed
- `enhancement` - Feature improvements

## 🆘 Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Discord/Slack** - Real-time community chat (if available)
- **Email** - Direct contact for sensitive issues

## 🙏 Recognition

All contributors are recognized in:

- `README.md` contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to Happy Track! 🎉