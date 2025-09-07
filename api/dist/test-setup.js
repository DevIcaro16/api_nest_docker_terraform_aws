"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env.test' });
process.env.NODE_ENV = 'test';
process.env.LOCAL_DEVELOPMENT = 'true';
process.env.ENVIRONMENT = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.AWS_REGION = 'us-east-1';
process.env.PUBLIC_ENDPOINT_METADATA_KEY = 'public-endpoint';
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
//# sourceMappingURL=test-setup.js.map