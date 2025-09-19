#!/bin/bash

# Build script for TestRail & Jira Activity Reporter
# This script compiles TypeScript and packages the application

echo "🔨 Building TestRail & Jira Activity Reporter..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf dist-electron

# Copy static assets
echo "📁 Copying static assets..."
mkdir -p dist
if [ -d "src/assets" ]; then
    cp -r src/assets dist/
fi

# Copy HTML files
if [ -f "src/renderer/index.html" ]; then
    cp src/renderer/index.html dist/
fi

# Compile TypeScript
echo "⚙️  Compiling TypeScript..."
npx tsc

if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed!"
    exit 1
fi

echo "✅ TypeScript compilation successful!"

# Check what to build
case "${1:-all}" in
    "mac"|"darwin")
        echo "🍎 Building for macOS..."
        npm run dist:mac
        ;;
    "win"|"windows")
        echo "🪟 Building for Windows..."
        npm run dist:win
        ;;
    "linux")
        echo "🐧 Building for Linux..."
        npm run dist:linux
        ;;
    "pack"|"dir")
        echo "📦 Creating unpacked directory..."
        npm run pack
        ;;
    "all")
        echo "🌍 Building for all platforms..."
        npm run dist:all
        ;;
    *)
        echo "Usage: $0 [mac|win|linux|pack|all]"
        echo "  mac    - Build for macOS"
        echo "  win    - Build for Windows"
        echo "  linux  - Build for Linux"
        echo "  pack   - Create unpacked directory"
        echo "  all    - Build for all platforms (default)"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo "🎉 Build completed successfully!"
    echo "📁 Output files are in: dist-electron/"
    ls -la dist-electron/
else
    echo "❌ Build failed!"
    exit 1
fi