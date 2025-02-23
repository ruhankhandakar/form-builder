import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        diagnostics: {
          warnOnly: true,
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!lucide-react)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lucide-react$': '<rootDir>/src/__mocks__/lucide-react.tsx',
    '@/components/ui/(.*)$': '<rootDir>/src/__tests__/__mocks__/ui.tsx',
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};

export default config;
