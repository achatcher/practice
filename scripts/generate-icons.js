#!/usr/bin/env node

/**
 * Icon Generation Script for The Greenville Social
 *
 * This script generates all required app icons and splash screens
 * from the master SVG file for iOS and Android app stores.
 *
 * Usage: node scripts/generate-icons.js
 *
 * Requirements:
 * - Sharp library for image processing
 * - SVG source file: public/app-icon.svg
 *
 * Install dependencies:
 * npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes for iOS
const iosIcons = [
  { name: 'apple-icon-57x57.png', size: 57 },
  { name: 'apple-icon-60x60.png', size: 60 },
  { name: 'apple-icon-72x72.png', size: 72 },
  { name: 'apple-icon-76x76.png', size: 76 },
  { name: 'apple-icon-114x114.png', size: 114 },
  { name: 'apple-icon-120x120.png', size: 120 },
  { name: 'apple-icon-144x144.png', size: 144 },
  { name: 'apple-icon-152x152.png', size: 152 },
  { name: 'apple-icon-180x180.png', size: 180 }
];

// Icon sizes for Android/Web
const androidIcons = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'pwa-64x64.png', size: 64 }
];

// Splash screen sizes for iOS
const splashScreens = [
  { name: 'splash-640x1136.png', width: 640, height: 1136 },
  { name: 'splash-750x1334.png', width: 750, height: 1334 },
  { name: 'splash-1125x2436.png', width: 1125, height: 2436 },
  { name: 'splash-1242x2688.png', width: 1242, height: 2688 },
  { name: 'splash-1536x2048.png', width: 1536, height: 2048 },
  { name: 'splash-1668x2388.png', width: 1668, height: 2388 },
  { name: 'splash-2048x2732.png', width: 2048, height: 2732 }
];

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'app-icon.svg');

async function generateIcons() {
  console.log('🎨 Generating app icons for The Greenville Social...');

  if (!fs.existsSync(svgPath)) {
    console.error('❌ SVG source file not found:', svgPath);
    process.exit(1);
  }

  try {
    // Generate iOS icons
    console.log('📱 Generating iOS app icons...');
    for (const icon of iosIcons) {
      await sharp(svgPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(publicDir, icon.name));
      console.log(`✓ Generated ${icon.name}`);
    }

    // Generate Android icons
    console.log('🤖 Generating Android app icons...');
    for (const icon of androidIcons) {
      await sharp(svgPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(publicDir, icon.name));
      console.log(`✓ Generated ${icon.name}`);
    }

    // Generate splash screens (using a modified version for splash)
    console.log('💫 Generating iOS splash screens...');
    for (const splash of splashScreens) {
      // Create a splash screen with centered logo
      const logoSize = Math.min(splash.width, splash.height) * 0.3; // 30% of smaller dimension

      await sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 4,
          background: { r: 26, g: 26, b: 26, alpha: 1 } // #1A1A1A background
        }
      })
      .composite([{
        input: await sharp(svgPath)
          .resize(Math.round(logoSize), Math.round(logoSize))
          .png()
          .toBuffer(),
        top: Math.round((splash.height - logoSize) / 2),
        left: Math.round((splash.width - logoSize) / 2)
      }])
      .png()
      .toFile(path.join(publicDir, splash.name));

      console.log(`✓ Generated ${splash.name}`);
    }

    console.log('✨ All icons and splash screens generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review generated icons in the public/ directory');
    console.log('2. Optimize file sizes if needed');
    console.log('3. Test on actual iOS and Android devices');
    console.log('4. Update app store listings with new assets');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };