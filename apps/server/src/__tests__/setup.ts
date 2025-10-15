import { beforeEach } from 'vitest';

// Setup test environment
beforeEach(() => {
  // Reset any global state before each test
  process.env.NODE_ENV = 'test';
});

// Mock environment variables for testing
process.env.CORS_ORIGIN = 'http://localhost:3001';