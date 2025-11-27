const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    '<rootDir>/app/**/*.{ts,tsx}',
    '<rootDir>/components/**/*.{ts,tsx}',
    '<rootDir>/lib/**/*.{ts,tsx}',
    '!<rootDir>/.next/**',
    '!<rootDir>/node_modules/**',
  ],
  coverageReporters: ['html', 'text-summary'],
  clearMocks: true,
};

module.exports = createJestConfig(customJestConfig);

