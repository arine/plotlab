export default {
  preset: 'ts-jest/presets/default-esm', // Use ts-jest preset for ESM
  testEnvironment: 'jsdom', // Simulate a browser environment
  extensionsToTreatAsEsm: ['.ts'], // Treat TypeScript files as ES modules
  globals: {
    'ts-jest': {
      useESM: true, // Enable ESM support for TypeScript
    },
  },
  testMatch: ['<rootDir>/test/**/*.test.ts'], // Test files location
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [], // Force Jest to transform all `node_modules`
};

