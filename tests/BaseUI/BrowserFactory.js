// require('chromedriver')
// require('dotenv').config()
const Browser = require('./../BaseUI/Browser');
const ConfigFactory = require('./../BaseUI/ConfigFactory');
const ProcessUtil = require('./../BaseUI/ProcessUtil');
const {Builder} = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
// const edge = require("@microsoft/edge-selenium-tools");

class BrowserFactory {
  static async createBrowser(mochaContext) {
    const config = ConfigFactory.getConfig();
    // console.log(`Test ${mochaContext.test.title} is beign executed`)

    const driver = await this.createDriverFromBrowserType(config.browser);
    const browser = await new Browser(mochaContext, driver);
    return await browser;
  }

  catch(error) {
    ProcessUtil.errorToPromiseError(error);
    throw error;
  }

  static async createDriverFromBrowserType(browserType) {
    console.log(`Create driver from browser type : ${browserType}`);

    switch (browserType) {
    case 'chrome':
      return await this.createChromeDriver();
    case 'chromeheadless':
      return await this.createChromeHeadlessDriver();
    case 'chrome-browserstack':
      return await this.createBrowserStackChromeDriver();
    case 'chrome-saucelabs':
      return await this.createSaucelabsChromeDriver();
    case 'edge':
      return await this.createEdgeDriver();
    case 'safari':
      return await this.createSafariDriver();
    default:
    {const message = 'User has not selected any browser to run automation tests upon!';
      console.log(message);
      await ProcessUtil.returnPromiseError(message);
      throw new Error(message);
    }
    }
  }

  static async createChromeDriver() {
    console.log('Chrome driver creating');

    const options = new Chrome.Options();
    options.addArguments('--test-type');

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    options.addArguments(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
    );
    await driver.manage().window().maximize();
    return driver;
  }

  static async createSafariDriver() {
    console.log('Creating safari driver...');

    const options = new Chrome.Options();
    options.addArguments('--test-type');
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    const driver = await new Builder()
      .forBrowser('safari')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();

    return driver;
  }

  static async createChromeHeadlessDriver() {
    console.log('Creating headless chrome driver...');
    const options = new Chrome.Options();
    options.addArguments('--test-type');
    options.addArguments('--incognito');
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();

    return driver;
  }

  static async createBrowserStackChromeDriver() {
    console.log('Creating chrome driver on BrowserStack...');
    const USERNAME = 'abc_0WF48k';
    const AUTOMATE_KEY = 'mjNF3uP4s4S9yfwtp5bn';
    const browserstackURL = 'https://' + USERNAME + ':' + AUTOMATE_KEY + '@hub-cloud.browserstack.com/wd/hub';

    const capabilities = {
      os: 'OS X',
      os_version: 'Catalina',
      browserName: 'Chrome',
      browser_version: 'latest',
      resolution: '1920x1080'
    };

    const driver = await new Builder()
      .usingServer(browserstackURL)
      .withCapabilities(capabilities)
      .build();

    await driver.manage().window().maximize();

    return driver;
  }

  static async createSaucelabsChromeDriver() {
    console.log('Creating chrome driver on SauceLabs...');

    const USERNAME = 'pratik-kubric-sl';
    const AUTOMATE_KEY = 'bd60aace-dbba-4b09-ac91-1b7ee61b09d1';
    const browserstackURL = 'https://' + USERNAME + ':' + AUTOMATE_KEY + '@ondemand.us-west-1.saucelabs.com:443/wd/hub';

    const capabilities = {
      'browserName': 'chrome',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      'sauce:options': {
      }
    };
    const driver = await new Builder()
      .usingServer(browserstackURL)
      .withCapabilities(capabilities)
      .build();

    await driver.manage().window().maximize();
    return driver;
  }

  static async createEdgeDriver() {
    console.log('Creating ms edge driver on local machine...');

    const options = new edge.Options().setEdgeChromium(true);
    const driver = edge.Driver.createSession(options);

    await driver.manage().window().maximize();

    return driver;
  }
}

module.exports = BrowserFactory;
