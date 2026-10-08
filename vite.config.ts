import {realpathSync} from 'node:fs';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base:'/vai_mathematics_atlas/',
  plugins:[react(),tailwindcss()],
  server:{fs:{allow:[process.cwd(),realpathSync('./node_modules')]}},
  build:{chunkSizeWarningLimit:900}
});
