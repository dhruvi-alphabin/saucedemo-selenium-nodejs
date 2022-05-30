const fs = require('fs');
const path = require('path');
const os = require('os');
const SelectorType = require('./../BaseUI/SelectorType');
const ProcessUtil = require('./../BaseUI/ProcessUtil');
const FileUtil = require('./../BaseUI/FileUtil');
const ConfigFactory = require('./../BaseUI/ConfigFactory');
const {Key, By, until} = require('selenium-webdriver');

class Browser {
  static mainWindowHandler = '';

  constructor(mochaContext, driver) {
    this.testConfig = ConfigFactory.getConfig();
    this.mochaContext = mochaContext;
    this.driver = driver;
  }

  getEnv() {
    return this.testConfig.env;
  }

  getAutomationPracticeBaseUrl() {
    return this.testConfig.automationPracticeBaseUrl;
  }

  getExecutionMode() {
    return this.testConfig.executionMode;
  }

  getBrowserName() {
    return this.testConfig.browser;
  }

  async getCurrentUrl() {
    await this.delay(1000);
    return await this.driver.getCurrentUrl();
  }

  async navigate(url) {
    console.log('Navigating to : ' + url);
    await this.driver.navigate().to(url);
    this.clearMainWindowHandler();
  }

  clearMainWindowHandler() {
    this.mainWindowHandler = '';
  }

  async close() {
    await this.driver.quit();
  }

  async findBySelectorType(selectorType, locator, timeout) {
    if (selectorType === SelectorType.CSS) {
      if (timeout) return await this.findByCss(locator, timeout);
      else return await this.findByCss(locator);
    } else {
      if (timeout) return await this.findByXpath(locator, timeout);
      else return await this.findByXpath(locator);
    }
  }

  async findByCss(cssPath, timeout, multipleElements = false) {
    console.info('waitForCssPath' + cssPath);
    const optTimeout = timeout || this.testConfig.defaultElementTimeout;
    console.info('Timeout for css selector' + optTimeout);

    const condition = until.elementLocated(By.css(cssPath));
    await this.driver.wait(async (driver) => condition.fn(driver), optTimeout, `could not load the element with given css selector : ${cssPath}`);
    let element;
    if (multipleElements) {
      element = await this.driver.findElements(By.css(cssPath));
    } else {
      element = await this.driver.findElement(By.css(cssPath));
    }
    return element;
  }

  async findByXpath(xPath, timeout, multipleElements = false) {
    console.info('waitForXpath : ' + xPath);
    const optTimeout = timeout || this.testConfig.defaultElementTimeout;
    console.info('Timeout for Xpath selector' + optTimeout);

    const condition = until.elementLocated(By.xpath(xPath));
    await this.driver.wait(async (driver) => condition.fn(driver), optTimeout, `Could not load the element with given xpath selector : ${xPath}`);
    let element;
    if (multipleElements) {
      element = await this.driver.findElements(By.xpath(xPath));
    } else {
      element = await this.driver.findElement(By.xpath(xPath));
    }
    return element;
  }

  async findAllBySelectorType(cssPath, xPath, selectorType, locator) {
    if (selectorType === SelectorType.CSS) {
      return await this.findByCss(cssPath, this.testConfig.defaultElementTimeout, true);
    } else {
      return await this.findByXpath(xPath, this.testConfig.defaultElementTimeout, true);
    }
  }

  // Wait Functions
  async delay(timeInMillis) {
    console.log('Delay: ' + timeInMillis + 'in milliseconds');
    return new Promise((resolve) => {
      setTimeout(resolve, timeInMillis);
    });
  }

  async randomDelay(maximumTimeInMillis) {
    const randmomDelay = Math.random() * maximumTimeInMillis;
    await this.delay(randmomDelay);
  }

  async elementExists(selectorType, locator) {
    if (selectorType === SelectorType.CSS) {
      return (await this.driver.findElements(By.css(locator))).length > 0;
    } else {
      return (await this.driver.findElements(By.xpath(locator))).length > 0;
    }
  }

  async waitUntilEnabled(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);
  }

  async scrollToTopOfPage() {
    console.info('ScrollToTopOfPage');
    const javaScript = 'window.scrollTo(0, 0)';
    await this.executeJavaScript(javaScript, null);
    await this.delay(1000);
  }

  async scrollToBottomOfPage() {
    console.info('ScrollToBottomOfPage');
    const javaScript = 'window.scrollTo(0, document.body.scrollHeight)';
    await this.executeJavaScript(javaScript, null);
    await this.delay(1000);
  }

  async scrollElementIntoView(element) {
    console.info('scrollElementIntoView');
    const javaScript = 'arguments[0].scrollIntoView(true)';
    await this.executeJavaScript(javaScript, element);
    await this.delay(1000);
  }

  async scrollIntoView(selectorType, locator) {
    console.info('scrollIntoView');
    const element = await this.findBySelectorType(selectorType, locator);
    const javaScript = 'arguments[0].scrollIntoView(true)';
    await this.executeJavaScript(javaScript, element);
    await this.delay(700);
  }

  async isElementVisibleOnView(element) {
    console.info('isElementVisibleOnView');
    return await this.executeJavaScript('return window.getComputedStyle(arguments[0]).visibility !== hidden', element);
  }

  async clearTextWithKeyboardShortcut(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);

    await console.info('Clearing the input with Keyboard shortcut: Ctrl+A and Backspace');
    const controlKey = (os.platform() === 'darwin') ? Key.COMMAND : Key.CONTROL;
    await element.sendKeys(Key.chord(controlKey, 'a', Key.BACK_SPACE));
    await console.info('clearWithKeyboardShortcut() happened');
  }

  async sendKeys(selectorType, locator, text, clear = true) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.delay(500);
    await this.delay(500);
    await element.sendKeys(text);
    console.info('Sendkeys performed successfully. Types text is: ' + await element.getAttribute('value'));
    return element;
  }

  async sendKeysJS(selectorType, locator, text) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled();
    await this.delay();
    await element.clear();
    const javaScript = `arguments[0].setAttribute('value', ${text});`;
    await this.executeJavaScript(javaScript, element);
    console.info('sendKeyJS performed successfully. Typed text is: ' + await element.getAttribute('value'));
    return element;
  }

  async slowType(selectorType, locator, text, pressEnter) {
    const element = await this.findBySelectorType(selectorType, locator);
    await element.clear();
    for (let i = 0; i < text.length; i++) {
      console.info('Sendkeys: ' + text[i]);
      await element.sendKeys(text[i]);
      await this.delay(text.length - i > 4 ? 50 : 150);
      await this.randomDelay(150);
    }
    console.info('slowType text is :' + await element.getAttribute('value'));
    if (pressEnter) await element.sendKeys(Key.ENTER);
    return element;
  }

  async getText(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    const result = element.getText();
    console.info(`GetText is : ${result}`);
    return result;
  }

  async selectDropDownByText(selectorType, locator, text) {
    const element = await this.findBySelectorType(selectorType, locator);
    const options = await element.findElement(By.css('option'));
    console.info('selectDropDownByText: ' + text);

    for (const option of options) {
      const optionText = await option.getText();
      if (optionText === text) {
        await option.click();
        return;
      }
    }
    ProcessUtil.returnPromiseError(`selectDropDownByText text not found ${text} for control with path : ${path}`);
  }

  async selectDropDownByValue(selectorType, locator, value) {
    const element = await this.findBySelectorType(selectorType, locator);
    const options = await element.findElement(By.css('option'));
    console.info('selectDropDownByValue: ' + value);

    for (const option of options) {
      const optionValue = await option.getAttribute('value');
      if (optionValue === value) {
        await option.click();
        return;
      }
    }
    ProcessUtil.returnPromiseError(`selectDropDownByValue value not found ${value} for control with path : ${path}`);
  }

  async selectDropDownByOptionIndex(selectorType, path, index) {
    const dropdown = await this.findBySelectorType(selectorType, path);
    const options = await this.findBySelectorType(selectorType, path, `option:nth-child(${index})`);
    await this.waitUntilElementEnabled(dropdown);
    await dropdown.click();
    await this.delay(100);
    await this.waitUntilElementEnabled(options);
    await options.click();
    await this.delay(100);
  }

  async click(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    // await this.waitUntilElementEnabled(element)
    console.info('clicking');
    await element.click();
    console.info('Button() clicked...');
  }

  async clickJS(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    // await this.waitUntilElementEnabled(element)
    console.info('clicking using javascript');
    await element.executeJavaScript('arguments[0].click();', element);
    console.info('clickJS() clicked the button...!');
  }

  async clearTextJS(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);
    console.info('Replace text of element via JS ');
    await element.executeJavaScript('arguments[0].value=\'\';');
    console.info('clearTextJS() happened....');
  }

  getShopifyPartnerCredentials() {
    return [process.env.SHOPIFY_PARTNER_EMAIL, process.env.SHOPIFY_PARTNER_PASSWORD];
  }

  async captureScreenshot(imageName) {
    const screenshotDirectory = FileUtil.pathCombine(FileUtil.getCurrentDirectory(), 'TestResults', 'screenshots');
    FileUtil.createDirectory(screenshotDirectory);
    const filePath = FileUtil.pathCombine(screenshotDirectory, imageName);

    this.driver.takeScreenshot().then(function(data) {
      console.info('Capturing screenshot...');
      fs.writeFileSync(filePath, data, 'base64');
    });
  }

  async switchToFirstBrowserTab() {
    await this.switchToBrowserTab(0);
  }

  async getAllWindowHandles() {
    return await this.driver.getAllWindowHandles();
  }

  async getCurrentWindowHandle() {
    return await this.driver.getWindowHandle();
  }

  async switchToLastBrowserTab() {
    const allWinHandles = await this.getAllWindowHandles();
    const lastBrowserTabIndex = await allWinHandles.length - 1;
    await this.switchToBrowserTab(lastBrowserTabIndex);
  }

  async switchToBrowserTab(index) {
    console.info(`[SwitchToBrowserTab: ${index}]`);
    const tabs = await this.driver.getAllWindowHandles();
    await console.log(tabs);
    const handle = tabs[index];
    console.info(`[Handle: ${handle}]`);
    await this.driver.switchTo().window(handle);
    await this.delay(1000);
    const currentUrl = await this.driver.getCurrentUrl();
    console.info(`[After switching the current URL is: ${currentUrl}]`);
    return index;
  }

  async switchToBrowserTabWhichHasSpecificUrlPath(urlPath) {
    await this.delay(2000);
    const handles = await this.driver.getAllWindowHandles();
    const currentHandle = await this.driver.getWindowHandle();
    await console.log(`All handles: ${handles}`);
    await console.log(`Current handle: ${currentHandle}`);
    let currentUrl = await this.driver.getCurrentUrl();

    await console.log(`Current URL: ${currentUrl}`);
    await console.log(`Expected urlPath: ${urlPath}`);

    if (!currentUrl.includes(urlPath)) {
      // if current URL is not matching with given link, then switch the tab

      while (!currentUrl.includes(urlPath)) {
        let timeout = 0; // in seconds
        let flag = false;

        for (let i = 0; i < handles.length; i++) {
          await console.log(handles[i]);
          await console.log(`Current URL: ${currentUrl}`);

          await this.driver.switchTo().window(handles[i]);
          currentUrl = await this.driver.getCurrentUrl();
          await this.delay(1500);
          await console.log(`New Current URL: ${currentUrl}`);

          if (currentUrl.includes(urlPath)) {
            flag = true;
            break;
          }
        }

        timeout += 1;
        console.log('timeout: ' + timeout);

        if (flag) {
          break;
        }

        if (timeout === 10) {
          break;
        }
      }
    }
    await this.delay(1500);
  }

  async closeBrowserTab() {
    console.info('[Browser tab is being closed..]');
    const currentUrl = await this.driver.getCurrentUrl();
    console.info(`[Closing browser tab URL: ${currentUrl}]`);
    await this.delay(100);
    await this.driver.close();
    try {
      await this.delay(200);
      await this.driver.getCurrentUrl();
      await this.closeBrowserTab();
    } catch (e) {
      console.info('[Browser tab closed!]');
    }
    await this.delay(500);
  }

  ClearMainWindowHandler() {
    this.mainWindowHandler = '';
  }

  async switchToIFrame(selectorType, locator) {
    console.info('SwitchToIFrame');
    if (this.mainWindowHandler === '') {
      this.mainWindowHandler = await this.driver.getWindowHandle();
    }
    const element = await this.findBySelectorType(selectorType, locator);
    if (element.length > 1) {
      console.info('WARNING: More than 1 iframes are found, Please fix the locator.');
    }
    await this.waitUntilElementEnabled(element[0]);
    await this.driver.switchTo().frame(element[0]);
    await this.delay(1000);
  }

  async switchToWindow(handle) {
    console.log('Switching to window');
    await this.driver.switchTo().window(handle);
  }

  async switchToNotGivenWindow(handle) {
    const windowsHandles = await this.getAllWindowHandles();
    windowsHandles.splice(windowsHandles.indexOf(handle), 1);
    await this.driver.switchTo().window(windowsHandles[0]);
  }

  async switchToMainWindow() {
    console.info('SwitchToMainWindow');
    if (this.mainWindowHandler !== '') {
      await this.driver.switchTo().window(this.mainWindowHandler);
      this.clearMainWindowHandler();
    }
    await this.driver.switchTo().defaultContent();
  }

  async executeJavaScript(javaScript, args) {
    const jsOutput = await this.driver.executeScript(javaScript, args);
    await this.delay(300);
    return jsOutput;
  }

  async issueError(error) {
    await ProcessUtil.errorToPromiseError(error);
  }

  async getPageSource() {
    return await this.driver.getPageSource();
  }

  async savePageSourceToFile(testCaseName) {
    await FileUtil.createFile(`TestResults/${testCaseName.replace(/ /g, '-')}-page-source.txt`, await this.getPageSource());
  }

  async hover(selectorType, locator) {
    const element = await this.findBySelectorType(selectorType, locator);
    await this.waitUntilElementEnabled(element);
    await console.info('Hover via Selenium cmd');
    await this.driver.actions({bridge: true}).move({duration: 100, origin: element, x: 0, y: 0}).perform();

    await console.info('Hover via JS');
    const hoverJS = 'if(document.createEvent){var evObj = document.createEvent(\'MouseEvents\');evObj.initEvent(\'mouseover\', true, false); arguments[0].dispatchEvent(evObj);} else if(document.createEventObject) { arguments[0].fireEvent(\'onmouseover\');}';
    await this.executeJavaScript(hoverJS, element);
    await this.delay(1000);
  }

  async getCssValue(selectorType, locator, cssProperty) {
    const element = await this.findBySelectorType(selectorType, locator);
    return await element.getCssValue(cssProperty);
  }

  async refresh() {
    console.info('Refresh()');
    await this.driver.navigate().refresh();
  }

  async acceptJSModal() {
    await this.driver.switchTo().alert().accept();
  }
}

module.exports = Browser;
