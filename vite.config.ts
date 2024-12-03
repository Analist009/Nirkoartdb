import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-select',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slider',
      '@radix-ui/react-tabs',
      'html-to-image',
      'sonner',
      'fabric'
    ]
  },
  define: {
    'process.env': process.env
  }
});