import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // the path library a built in node module

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // using the path library set a allias for the src directory as @
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  define: {
    'process.env': {}, // for env compatibility
  },
});
