/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "allure-jest/node",
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
  testEnvironmentOptions: {
    resultsDir: "allure-results",
    // links: {
    //   issue: {
    //     nameTemplate: "Issue #%s",
    //     urlTemplate: "https://issues.example.com/%s",
    //   },
    //   tms: {
    //     nameTemplate: "TMS #%s",
    //     urlTemplate: "https://tms.example.com/%s",
    //   },
    //   jira: {
    //     urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
    //   },
    // },
    // categories: [
    //   {
    //     name: "GET Requests",
    //     messageRegex: "GET",  
    //     traceRegex: "GET",
    //     matchedStatuses: ["passed", "failed"],
    //   },
    //   {
    //     name: "POST Requests",
    //     messageRegex: "POST", 
    //     traceRegex: "POST",
    //     matchedStatuses: ["passed", "failed"],
    //   },
    //   {
    //     name: "DELETE Requests",
    //     messageRegex: "DELETE",  
    //     traceRegex: "DELETE",
    //     matchedStatuses: ["passed", "failed"],
    //   },
    //   {
    //     name: "Failed Tests",
    //     messageRegex: "FAILED",  
    //     traceRegex: "FAILED",
    //     matchedStatuses: ["failed"],
    //   },
    //   {
    //     name: "Broken Tests",
    //     messageRegex: "BROKEN",  
    //     traceRegex: "BROKEN",
    //     matchedStatuses: ["broken"],
    //   },
    // ],
    environmentInfo: {
      os_platform: require("node:os").platform(),
      os_release: require("node:os").release(),
      os_version: require("node:os").version(),
      node_version: process.version,
    },
  },
};
