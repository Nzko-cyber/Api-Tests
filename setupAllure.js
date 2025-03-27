const { AllureRuntime } = require('allure-jest2-reporter');

global.allure = new AllureRuntime({
  resultsDir: "allure-results"
});