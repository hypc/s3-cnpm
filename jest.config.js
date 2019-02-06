module.exports = {
  coverageDirectory: 'coverage',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.ts'],
}
