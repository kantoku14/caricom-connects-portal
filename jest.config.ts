import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-environment-jsdom', // Correctly set up for jsdom
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)', // Tests inside __tests__ folders
    '**/?(*.)+(spec|test).[tj]s?(x)', // Test files ending with .spec.ts or .test.ts
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.ts', // Mock image imports
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Custom setup for Jest after the environment is set up
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
