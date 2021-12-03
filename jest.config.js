const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$';

module.exports = {
  testRegex: TEST_REGEX,
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: false,
  moduleDirectories: ['node_modules', './src'],
};
