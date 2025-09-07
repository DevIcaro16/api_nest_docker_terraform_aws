// Global test setup
import { config } from 'dotenv';

// Load environment variables for testing
config({ path: '.env.test' });

// Set default environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LOCAL_DEVELOPMENT = 'true';
process.env.ENVIRONMENT = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.AWS_REGION = 'us-east-1';
process.env.PUBLIC_ENDPOINT_METADATA_KEY = 'public-endpoint';

// Mock console.log to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};


