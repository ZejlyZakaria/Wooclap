import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // Le backend écoute sur ce port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Ajustez si nécessaire
      },
    },
  },
});