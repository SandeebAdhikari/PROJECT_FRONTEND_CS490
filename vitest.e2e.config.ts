import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  test: {
    name: 'e2e',
    globals: true,
    environment: 'node',
    include: ['tests/e2e/**/*.spec.ts'],
    testTimeout: 60000,
    hookTimeout: 30000,
    retry: process.env.CI ? 2 : 0,
    // Sequential execution to avoid driver conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    reporters: [
      'default',
      ['html', { outputFile: 'test-results/e2e-report.html' }],
      ['json', { outputFile: 'test-results/e2e-results.json' }],
    ],
    setupFiles: ['tests/e2e-setup.ts'],
    teardownTimeout: 10000,
  },
});
