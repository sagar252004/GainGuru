import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Add alias for '@' to point to 'src'
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-router-dom'],
  },
});
