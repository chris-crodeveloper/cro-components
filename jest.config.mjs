/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import fs from "fs";
import path from "path";

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFilesAfterEnv: ["./setupTests.js"],
  testEnvironment: "jsdom",
  
  // Include both core and cro-components test patterns
  testRegex: [
    "/stories/.*test\\.(js|jsx|ts|tsx)$",
    "/cro-components/.*test\\.(js|jsx|ts|tsx)$"
  ].concat(
    // Dynamically add cro-components path if it exists
    fs.existsSync(path.resolve(process.cwd(), "cro-components"))
      ? ["/cro-components/.*test\\.(js|jsx|ts|tsx)$"]
      : []
  ),

  transform: {
    "^.+\\.js$": "babel-jest"
  },
  
  // Coverage collection from both directories
  collectCoverageFrom: [
    "stories/**/*.js",
    "cro-components/**/*.js",
    "!**/*.stories.js",
    "!**/*.test.js",
    "!**/node_modules/**"
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Module path mapping for easier imports
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@stories/(.*)$": "<rootDir>/stories/$1",
    "^@cro/(.*)$": "<rootDir>/cro-components/$1"
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/storybook-static/",
    "/coverage/"
  ],
  
  // Watch mode configuration
  watchPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/storybook-static/",
    "/coverage/"
  ],
  
  // Verbose output for better debugging
  verbose: true,
  
  // Test timeout
  testTimeout: 10000
};

export default config;