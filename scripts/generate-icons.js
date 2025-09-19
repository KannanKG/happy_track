#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Icon Generation Script');
console.log('========================');

// Check if SVG icon exists
const svgPath = path.join(__dirname, '../assets/icon.svg');
const pngPath = path.join(__dirname, '../assets/icon.png');
const png512Path = path.join(__dirname, '../assets/icon-512.png');
const buildDir = path.join(__dirname, '../build');

if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG icon not found at:', svgPath);
  process.exit(1);
}

console.log('✅ SVG icon found:', svgPath);

// Check if PNG icon exists
if (!fs.existsSync(pngPath)) {
  console.error('❌ PNG icon not found at:', pngPath);
  console.log('📝 Please ensure you have a PNG version of the icon');
  process.exit(1);
}

console.log('✅ PNG icon found:', pngPath);

// Create 512x512 version for macOS if it doesn't exist
if (!fs.existsSync(png512Path)) {
  try {
    console.log('📏 Creating 512x512 version for macOS...');
    execSync(`sips -z 512 512 "${pngPath}" --out "${png512Path}"`);
    console.log('✅ Created 512x512 icon for macOS');
  } catch (error) {
    console.error('❌ Failed to create 512x512 icon. Please create it manually.');
    console.log('💡 Required: assets/icon-512.png (512x512 pixels)');
  }
} else {
  console.log('✅ 512x512 icon already exists');
}

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  console.log('📁 Created build directory');
}

// Copy icons to build directory
const buildSvgPath = path.join(buildDir, 'icon.svg');
const buildPngPath = path.join(buildDir, 'icon.png');

fs.copyFileSync(svgPath, buildSvgPath);
fs.copyFileSync(pngPath, buildPngPath);
console.log('📋 Copied icons to build directory');

console.log('');
console.log('📋 Configuration Summary:');
console.log('- Electron Forge: Using assets/icon.png');
console.log('- Electron Builder: Using assets/icon-512.png (macOS), assets/icon.png (others)');
console.log('- Runtime Window: Using assets/icon.png');
console.log('');
console.log('🎯 Your app will now use the custom icon with proper sizing');
console.log('');
console.log('📝 Available Files:');
console.log('- assets/icon.svg (original vector)');
console.log('- assets/icon.png (256x256 for general use)');
console.log('- assets/icon-512.png (512x512 for macOS builds)');
console.log('');
console.log('✅ Ready to build:');
console.log('- npm run make (electron-forge)');
console.log('- npm run dist:mac (macOS DMG/ZIP)');
console.log('- npm run dist:win (Windows installer)');
console.log('- npm run dist:linux (Linux AppImage/DEB)');