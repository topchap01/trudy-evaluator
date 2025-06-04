import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 🟢 Make sure Vercel knows where to find the built files
  },
  base: './', // 🟢 Ensures correct relative paths in production
});
