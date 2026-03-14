# App Icons and Splash Screens for The Hills Guide

This directory contains the required icon files for iOS and Android app stores.

## Required Icon Files

### iOS App Icons (PNG format)
- `apple-icon-57x57.png` - iPhone iOS 6 and earlier
- `apple-icon-60x60.png` - iPhone iOS 7+
- `apple-icon-72x72.png` - iPad iOS 6 and earlier
- `apple-icon-76x76.png` - iPad iOS 7+
- `apple-icon-114x114.png` - iPhone Retina iOS 6 and earlier
- `apple-icon-120x120.png` - iPhone Retina iOS 7+
- `apple-icon-144x144.png` - iPad Retina iOS 6 and earlier
- `apple-icon-152x152.png` - iPad Retina iOS 7+
- `apple-icon-180x180.png` - iPhone 6 Plus

### Android/Chrome Icons (PNG format)
- `favicon-16x16.png` - Browser tab icon
- `favicon-32x32.png` - Browser favicon
- `favicon-96x96.png` - Android Chrome icon
- `pwa-64x64.png` - PWA icon (small)
- `pwa-192x192.png` - PWA icon (medium) ✓ Already exists
- `pwa-512x512.png` - PWA icon (large) ✓ Already exists

### iOS Splash Screens (PNG format)
- `splash-640x1136.png` - iPhone 5/5s/SE
- `splash-750x1334.png` - iPhone 6/7/8
- `splash-1125x2436.png` - iPhone X/XS/11 Pro
- `splash-1242x2688.png` - iPhone XS Max/11 Pro Max
- `splash-1536x2048.png` - iPad Mini/Air (Portrait)
- `splash-1668x2388.png` - iPad Pro 11" (Portrait)
- `splash-2048x2732.png` - iPad Pro 12.9" (Portrait)

## Design Guidelines

### Brand Colors
- Primary Gold: #D4AF37
- Background Black: #1A1A1A
- Light Gold: #E6C756

### Design Elements
- Luxury aesthetic with gold and black color scheme
- "HG" monogram or full "The Hills Guide" branding
- Crown/diamond icon representing exclusivity
- Rounded corners for iOS (automatic)
- Square format for Android

### Technical Requirements
- All icons should be square (1:1 aspect ratio)
- High resolution (minimum 2x for Retina displays)
- PNG format with transparency where appropriate
- Consistent branding across all sizes

## App Store Requirements

### iOS App Store
- Icon must not include rounded corners (iOS adds them automatically)
- No transparency in the main icon area
- High contrast for legibility at small sizes

### Google Play Store
- Adaptive icon support (API 26+)
- 512x512 high resolution icon for Play Store listing
- Maskable icon support for various device themes

## How to Generate

1. Create a master SVG file at 1024x1024 resolution
2. Use the provided `app-icon.svg` as a template
3. Export to PNG at each required size
4. Optimize file sizes for web delivery
5. Test on actual devices for clarity

## Tools Recommended
- Figma, Sketch, or Adobe Illustrator for design
- ImageOptim or TinyPNG for optimization
- PWA Builder for automated icon generation
- App Icon Generator tools for batch creation