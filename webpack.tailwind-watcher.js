const chokidar = require('chokidar');
const path = require('path');

class TailwindWatcherPlugin {
  constructor(options = {}) {
    this.watchPath = options.watchPath || './src/renderer/styles/output.css';
    this.watchTypeScript = options.watchTypeScript !== false; // Default to true
  }

  apply(compiler) {
    if (compiler.options.mode !== 'development') {
      return; // Only watch in development mode
    }

    let cssWatcher;
    let tsWatcher;

    compiler.hooks.afterEnvironment.tap('TailwindWatcherPlugin', () => {
      // Watch for CSS changes (Tailwind output)
      const cssPath = path.resolve(process.cwd(), this.watchPath);
      
      cssWatcher = chokidar.watch(cssPath, {
        persistent: true,
        ignoreInitial: true
      });

      cssWatcher.on('change', () => {
        console.log('🎨 Tailwind CSS updated, triggering hot reload...');
        
        if (compiler.watching) {
          compiler.watching.invalidate();
          console.log('📦 Webpack rebuild triggered for CSS');
        }
      });

      // Watch for TypeScript/JSX changes
      if (this.watchTypeScript) {
        const tsPattern = path.resolve(process.cwd(), 'src/renderer/**/*.{ts,tsx}');
        
        tsWatcher = chokidar.watch(tsPattern, {
          persistent: true,
          ignoreInitial: true,
          ignored: ['**/node_modules/**', '**/.git/**']
        });

        tsWatcher.on('change', (filePath) => {
          const relativePath = path.relative(process.cwd(), filePath);
          console.log(`🔄 TypeScript file changed: ${relativePath}`);
          
          if (compiler.watching) {
            compiler.watching.invalidate();
            console.log('📦 Webpack rebuild triggered for TypeScript');
          }
        });
      }
    });

    compiler.hooks.watchClose.tap('TailwindWatcherPlugin', () => {
      if (cssWatcher) {
        cssWatcher.close();
      }
      if (tsWatcher) {
        tsWatcher.close();
      }
    });
  }
}

module.exports = TailwindWatcherPlugin;