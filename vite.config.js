import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sgdb': {
        target: 'https://www.steamgriddb.com/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sgdb/, ''),
      },
    },
  },
});