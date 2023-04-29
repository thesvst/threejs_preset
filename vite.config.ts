import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@gui': path.resolve(__dirname, './src/gui'),
      '@models': path.resolve(__dirname, './src/models'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
})
