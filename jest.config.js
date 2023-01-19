module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js'],
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    globalSetup: '<rootDir>/tests/config/global-setup.js',
    globalTeardown: '<rootDir>/tests/config/global-teardown.js',
};
