module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ['html'],
  testTimeout: 20000,
  moduleFileExtensions: ['js'],
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/config/global-setup.js',
  globalTeardown: '<rootDir>/tests/config/global-teardown.js',
};
