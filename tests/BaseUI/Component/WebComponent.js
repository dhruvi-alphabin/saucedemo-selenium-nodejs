const SelectorType = require('../SelectorType');
const {By} = require('selenium-webdriver');

class WebComponent {
  constructor(browser, selectorType, locator) {
    this.browser = browser;
    this.selectorType = selectorType;
    this.locator = locator;
  }

  async getLocator() {
    return await this.locator;
  }

  async click() {
    try {
      await this.browser.delay(100);
      await this.browser.randomDelay(100);
      await this.browser.scrollIntoView(this.selectorType, this.locator);
      await this.browser.randomDelay(200);
      await this.browser.click(this.selectorType, this.locator);
      await this.browser.randomDelay(100);
    } catch (error) {
      await console.log(error);
      await this.browser.delay(1000);
      await this.browser.clickJS(this.selectorType, this.locator);
      await console.log('Successfully clicked via JS executor');
    }
  }

  async hover() {
    try {
      await this.browser.hover(this.selectorType, this.locator);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }

  async findElementOrFailStep() {
    let element;
    try {
      element = await this.browser.findBySelectorType(this.selectorType, this.locator, 3000);
      return element;
    } catch (error) {
      await this.browser.issueError(error);
      throw error;
    }
  }

  async findChildElement(selectorType, locator) {
    let childElement;
    const element = await this.browser.findBySelectorType(this.selectorType, this.locator, 5000);
    try {
      console.info('Finding the child element...');
      if (selectorType === SelectorType.CSS) {
        childElement = element.findElement(By.css(locator));
      } else {
        childElement = element.findElement(By.xpath(locator));
      }
      return childElement;
    } catch (error) {
      await this.browser.issueError(error);
      await console.error('Element doesn\'t contain the child element.');
      throw error;
    }
  }


  async isAvailableAndDisplayed(withinSeconds) {
    try {
      const el = await this.browser.findBySelectorType(this.selectorType, this.locator, withinSeconds * 1000);
      const isElementDisplayed = await el.isDisplayed();
      console.info(`Element '${this.selectorType}': '${this.locator}' is '${isElementDisplayed}'!`);
      await this.browser.randomDelay(1000);
      return isElementDisplayed;
    } catch (e) {
      console.log(`Element '${this.selectorType}': '${this.locator}' is not found within: ${withinSeconds}. Timeout error occurred! \n${e} `);
      return false;
    }
  }


  async isDisplayedOnView(withinSeconds) {
    const el = await this.browser.findBySelectorType(this.selectorType, this.locator, withinSeconds * 1000);
    const isElementVisible = await this.browser.isElementVisibleOnView(el);
    console.info(`isElementVisibleOnView: For element '${this.selectorType}': '${this.locator}' is '${isElementVisible}'!`);
    await this.browser.randomDelay(1000);
    return isElementVisible;
  }

  /**
     * When called if the control is visible it will fail the test.
     * @return {Promise<boolean>}
     * @constructor
     */
  async isElementAvailable() {
    try {
      await this.findElementOrFailStep();
      console.info('isElementAvailable: true');
      return true;
    } catch (error) {
      console.info('isElementAvailable: false');
      console.error(error);
      return false;
    }
    // if (await element.isDisplayed()) {
    //   await this.browser.issueError(`Element: '${this.selectorType}': '${this.locator}' is Visible!!(It should not)`);
    // } else {
    //   await this.browser.issueError(`Element: ${this.selectorType}': '${this.locator}' is Invisible.`);
    // }
  }

  async waitUntilEnabled() {
    try {
      await this.browser.waitUntilEnabled(this.selectorType, this.locator);
    } catch (error) {
      await this.browser.issueError(error, `To wait until element: ${this.selectorType}': '${this.locator}' is enabled.`, error.message);
    }
    console.info(`Waited until element: ${this.selectorType}': '${this.locator}' was enabled.`);
  }

  async getCssValue(cssProperty) {
    try {
      return await this.browser.getCssValue(this.selectorType, this.locator, cssProperty);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }

  async getAttributeValue(attributeName) {
    const element = await this.browser.findBySelectorType(this.selectorType, this.locator);
    return await element.getAttribute(attributeName);
  }

  async getElementsSize() {
    const elements = await this.browser.findAllBySelectorType(this.selectorType, this.locator);
    return elements.length;
  }
}

module.exports = WebComponent;
