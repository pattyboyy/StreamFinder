// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Optional: Add a console log to verify that Vite is loading this config
console.log('Vite config loaded');

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      // Optional: Externalize dependencies if needed
      // external: ['some-external-package'],
    }
  }
});
