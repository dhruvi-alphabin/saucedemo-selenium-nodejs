class TestConfig {
  // Properties
  executionMode;
  automationPracticeBaseUrl;
  browser;
  isHeadless;
  browserStackEnabled;
  browserStackOS;
  browserStackOSVersion;
  defaultElementTimeout;
  defaultPageLoadTimeout;
  defaultTestTimeout;
  env;

  // Constructor
  constructor() {
    this.executionMode = 'remote';
    this.automationPracticeBaseUrl = 'https://www.saucedemo.com/';
    this.defaultElementTimeout = 30000; // 30 seconds
    this.defaultPageLoadTimeout = 30000; // 30 seconds
    this.defaultTestTimeout = 300000; // 5 Minutes
    this.browser = 'chrome-browserstack';
    this.isHeadless = 'false';
    this.browserStackEnabled = 'true';
    this.browserStackOS = 'windows';
    this.browserStackOSVersion = '10';
    this.env = 'prod';
  }
}

module.exports = TestConfig;
