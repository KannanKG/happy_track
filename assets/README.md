# Assets Directory

## App Icon

To add an app icon:

1. Create a PNG file named `icon.png` in this directory
2. Recommended sizes: 256x256, 512x512, or 1024x1024 pixels
3. Uncomment the icon line in `src/main.ts`:
   ```typescript
   icon: path.join(__dirname, '../assets/icon.png'),
   ```

## Icon Requirements

- **Format**: PNG with transparency support
- **Size**: 256x256 pixels minimum (higher resolution recommended)
- **Content**: Should represent your Happy Track application
- **Style**: Consider using a design that works well at small sizes

## Creating an Icon

You can create an icon using:
- Design tools: Figma, Sketch, Adobe Illustrator
- Icon generators: Online PNG generators
- Free resources: Icons8, Flaticon (with proper licensing)

Once you have your icon file, place it here as `icon.png` and uncomment the icon line in the main process configuration.