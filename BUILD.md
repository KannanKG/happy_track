# Building and Distributing TestRail & Jira Activity Reporter

This document explains how to build and distribute the application for different platforms.

## Prerequisites

- Node.js 18 or later
- npm (comes with Node.js)
- For Windows builds on macOS/Linux: Wine (optional)
- For macOS builds on other platforms: macOS machine (required for code signing)

## Quick Start

### Build for Current Platform
```bash
npm run dist
```

### Build for Specific Platform
```bash
# macOS
npm run dist:mac

# Windows
npm run dist:win

# Linux
npm run dist:linux

# All platforms
npm run dist:all
```

### Development Build (Unpacked)
```bash
npm run pack
```

## Using the Build Script

The included `build.sh` script provides an easy way to build the application:

```bash
# Build for all platforms
./build.sh

# Build for specific platform
./build.sh mac
./build.sh win
./build.sh linux

# Create unpacked directory for testing
./build.sh pack
```

## Build Outputs

Built applications will be placed in the `dist-electron/` directory:

### macOS
- `*.dmg` - Disk image installer
- `*.zip` - Zipped application bundle
- Supports both Intel (x64) and Apple Silicon (arm64)

### Windows
- `*.exe` - NSIS installer
- `*-portable.exe` - Portable executable
- Supports both x64 and x86 (ia32)

### Linux
- `*.AppImage` - Universal Linux application
- `*.deb` - Debian package
- Supports x64 architecture

## Code Signing (Production)

For production releases, you'll need to sign your applications:

### macOS
1. Get an Apple Developer account
2. Create certificates in Keychain Access
3. Configure environment variables:
   ```bash
   export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"
   ```

### Windows
1. Get a code signing certificate
2. Configure environment variables:
   ```bash
   export CSC_LINK="path/to/certificate.p12"
   export CSC_KEY_PASSWORD="certificate_password"
   ```

## Customization

### Application Icons
Replace the placeholder icons in the `build/` directory:
- `icon.icns` - macOS (512x512)
- `icon.ico` - Windows (256x256)
- `icon.png` - Linux (512x512)

### Application Information
Edit the build configuration in `package.json`:
- `appId` - Unique application identifier
- `productName` - Display name
- `copyright` - Copyright notice

### Installer Options
- **NSIS (Windows)**: Configure installation options
- **DMG (macOS)**: Customize disk image layout
- **AppImage (Linux)**: Configure application metadata

## Troubleshooting

### Common Issues

1. **Missing dependencies**: Run `npm install`
2. **TypeScript errors**: Run `npm run build` first
3. **Permission errors**: Use `sudo` for global installations
4. **Platform-specific builds**: Some platforms require specific tools

### Build Logs
Check the console output for detailed error messages. Electron Builder provides verbose logging for debugging.

### Testing Builds
Always test builds on the target platform before distribution:
1. Install the application
2. Test all functionality
3. Verify auto-updater (if implemented)
4. Check application signing

## Automated Builds

For CI/CD pipelines, consider using:
- GitHub Actions
- GitLab CI/CD
- Azure DevOps
- Travis CI

Example GitHub Action workflow available in the repository.

## Distribution

### Direct Distribution
- Upload builds to your website
- Provide download links for each platform

### App Stores
- **Mac App Store**: Requires additional configuration
- **Microsoft Store**: Use MSIX packaging
- **Snap Store**: Create snap packages for Linux

### Auto-Updates
Implement auto-updates using electron-updater:
1. Set up update server
2. Configure update URLs
3. Handle update notifications

## Security Considerations

1. **Code Signing**: Always sign production builds
2. **Update Security**: Use HTTPS for update checks
3. **Dependency Auditing**: Regularly audit npm packages
4. **Virus Scanning**: Scan builds before distribution

For more information, refer to the [Electron Builder documentation](https://www.electron.build/).