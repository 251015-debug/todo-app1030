// jest.config.mjs

import nextJest from 'next/jest.js'


const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: ['app/**/*.js', 'components/**/*.js', 'lib/**/*.js', '!**/*.test.js'],
  coverageThreshold:{
    global:{
      lines: 80,
    },
    './lib':{
      lines: 100,
      branches: 100,
    }
  },

}

export default createJestConfig(config)
