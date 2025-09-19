# 🏗️ Development Setup Guide

This guide will help you set up your development environment for contributing to Happy Track.

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (v8.0.0 or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

### Recommended Tools

4. **VS Code** (recommended IDE)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)
   - Install recommended extensions (see below)

5. **GitHub Desktop** (optional)
   - For easier Git management
   - Download from [desktop.github.com](https://desktop.github.com/)

## 🔧 VS Code Extensions

Install these extensions for the best development experience:

### Essential Extensions
```bash
# TypeScript support
code --install-extension ms-vscode.vscode-typescript-next

# ESLint for code quality
code --install-extension dbaeumer.vscode-eslint

# Prettier for code formatting
code --install-extension esbenp.prettier-vscode

# Tailwind CSS IntelliSense
code --install-extension bradlc.vscode-tailwindcss
```

### Helpful Extensions
```bash
# Auto Rename Tag
code --install-extension formulahendry.auto-rename-tag

# Bracket Pair Colorizer
code --install-extension coenraads.bracket-pair-colorizer-2

# GitLens
code --install-extension eamodio.gitlens

# Path Intellisense
code --install-extension christian-kohler.path-intellisense

# React snippets
code --install-extension dsznajder.es7-react-js-snippets
```

## 🚀 Project Setup

### 1. Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/happy_track.git
   cd happy_track
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/KannanKG/happy_track.git
   ```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install:
- Electron framework
- React and related packages
- TypeScript compiler
- Development tools (ESLint, Tailwind CSS, etc.)

### 3. Verify Setup

```bash
# Start development server
npm run dev
```

If everything is set up correctly:
- Electron app should launch
- Hot reload should work when you edit files
- No error messages in terminal

## 🔄 Development Workflow

### Daily Workflow

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Make changes and test**:
   - Edit files in `src/`
   - App will hot-reload automatically
   - Check console for errors

5. **Run quality checks**:
   ```bash
   npm run lint          # Check code style
   npm test             # Run tests (when available)
   npm run build        # Test production build
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

## 📝 Available Scripts

### Development
- `npm run dev` - Start development with hot reload
- `npm run dev:watch` - Development with enhanced logging
- `npm run dev:styles` - Development with Tailwind watching

### Building
- `npm run build` - Build all components
- `npm run build:main` - Build main process only
- `npm run build:renderer` - Build renderer only

### Styling
- `npm run tailwind:build` - Build Tailwind CSS
- `npm run tailwind:watch` - Watch Tailwind changes

### Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run test suite

### Distribution
- `npm run dist` - Build for current platform
- `npm run dist:mac` - Build for macOS
- `npm run dist:win` - Build for Windows
- `npm run dist:linux` - Build for Linux

## 🐛 Debugging

### Development Tools

1. **Electron DevTools**:
   - Press `F12` or `Cmd+Option+I` in the app
   - Inspect React components and debug renderer

2. **Main Process Debugging**:
   - Use VS Code debugger with launch configuration
   - Add breakpoints in main process files

3. **Console Logging**:
   ```typescript
   // Renderer process (shows in DevTools)
   console.log('Renderer debug info');
   
   // Main process (shows in terminal)
   console.log('Main process debug info');
   ```

### Common Issues

1. **App won't start**:
   - Check Node.js version (`node --version`)
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors

2. **Hot reload not working**:
   - Restart development server
   - Check file watchers aren't disabled

3. **Build failures**:
   - Run `npm run lint` to check for code issues
   - Verify all imports are correct
   - Check TypeScript compilation

### Environment Variables

Create a `.env` file for development settings:

```bash
# .env (for development only)
DEBUG=true
ELECTRON_ENABLE_LOGGING=true
NODE_ENV=development
```

## 📚 Learning Resources

### Technologies Used
- **Electron**: [electronjs.org/docs](https://www.electronjs.org/docs)
- **React**: [react.dev](https://react.dev/)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)

### API Documentation
- **TestRail API**: [gurock.com/testrail/docs/api](https://www.gurock.com/testrail/docs/api)
- **Jira API**: [developer.atlassian.com/cloud/jira](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)

## 🤝 Getting Help

If you run into issues:

1. Check this documentation
2. Look at existing issues on GitHub
3. Ask in GitHub Discussions
4. Create a new issue with:
   - Your operating system
   - Node.js version
   - Steps to reproduce
   - Error messages

## 🎯 Next Steps

Once your environment is set up:

1. Read the [Contributing Guide](CONTRIBUTING.md)
2. Look for "good first issue" labels
3. Check the project architecture in README
4. Start with documentation or small bug fixes
5. Join the community discussions

Happy coding! 🚀