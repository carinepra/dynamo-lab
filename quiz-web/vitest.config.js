import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/unit/setup.js'],
    include: ['tests/unit/**/*.spec.js'],
    exclude: ['tests/e2e/**', 'tests/quiz.spec.js', 'node_modules/**'],
    testTimeout: 10000, // 10 segundos por teste
    hookTimeout: 10000, // 10 segundos para hooks (beforeEach, etc)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/e2e/',
        'tests/quiz.spec.js',
        '*.config.js'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './js')
    }
  }
});

