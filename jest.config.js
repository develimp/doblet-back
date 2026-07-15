/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  // Separate folder from src/__tests__ (that one belongs to Mocha) so that lb-tsc
  // doesn't compile it or try to run it by mistake.
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {tsconfig: 'tsconfig.jest.json'}],
  },
  maxWorkers: 1,
  testTimeout: 15000,
};