module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js'],
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    globalSetup: '<rootDir>/config/global-setup.js',
    globalTeardown: '<rootDir>/config/global-teardown.js',
};
