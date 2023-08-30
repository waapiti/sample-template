import { defineConfig } from 'vite';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import FullReload from 'vite-plugin-full-reload';
import zipPack from 'vite-plugin-zip-pack';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WaapitiJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'Waapiti.json'), 'utf8'));

const noAttr = () => {
  return {
    name: 'no-attribute',
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === 'development') {
        return html;
      } else {
        return html.replace(`<script type="module" crossorigin src="./bundle.js"></script>`, '');
      }
    },
  };
};

const moveScript = () => {
  return {
    name: 'move-script',
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === 'development') {
        return html;
      } else {
        return html.replace(`</body>`, '<script src="./bundle.js"></script></body>');
      }
    },
  };
};

const generateDescription = () => {
  return {
    name: 'generate-description-json',
    generateBundle(options, bundle) {
      if (process.env.NODE_ENV !== 'development') {
        const srcPath = path.resolve(__dirname, 'Waapiti.json');
        const destPath = path.resolve(__dirname, 'build/DESCRIPTION.json');

        try {
          fs.copyFileSync(srcPath, destPath);
          console.log('JSON file copied successfully to the "build" folder.');
        } catch (err) {
          console.error('Error al copiar el archivo JSON:', err);
        }
      }
    },
  };
};

export default defineConfig({
  base: '',
  build: {
    outDir: 'build',
    minify: false,
    assetsDir: '',
    modulePreload: true,
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',
      },
    },
  },
  server: {
    hmr: {
      host: 'localhost',
    },
  },
  plugins: [
    react(),
    FullReload(['./public/Waapiti.json']),
    noAttr(),
    moveScript(),
    generateDescription(),
    zipPack({
      inDir: path.resolve(__dirname, 'build/'),
      outDir: path.resolve(__dirname),
      outFileName: `${WaapitiJson.config.title.replace(/ /g, '_')}${WaapitiJson.config.type === 'template' ? '.wtpl' : '.wapp'}`,
    }),
  ],
});
