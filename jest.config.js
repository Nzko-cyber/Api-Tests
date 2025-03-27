/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "allure-jest/node",
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

