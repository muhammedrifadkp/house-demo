import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'copy-raw-assets',
      closeBundle() {
        const assetsSrc = path.resolve(__dirname, 'assets');
        const assetsDest = path.resolve(__dirname, 'dist', 'assets');
        if (fs.existsSync(assetsSrc)) {
          fs.cpSync(assetsSrc, assetsDest, { recursive: true });
        }
      }
    }
  ]
});
