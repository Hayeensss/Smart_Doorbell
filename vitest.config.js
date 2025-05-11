import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setup-tests.js'],
    alias: {
      '@': resolve(__dirname, './'),
      '@/db': resolve(__dirname, './tests/__mocks__/db.js'),
    },
  },
}); 