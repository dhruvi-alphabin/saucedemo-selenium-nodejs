const {Key} = require('selenium-webdriver');
const WebComponent = require('./WebComponent');

class TextInput extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  async verifyInputFieldIsDisplayed() {
    try {
      await this.browser.elementExists(this.selectorType, this.locator);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }

  async slowType(text, pressEnter = false) {
    try {
      await this.browser.randomDelay(500);
      await this.browser.slowType(this.selectorType, this.locator, text, pressEnter);
      await this.browser.randomDelay(1000);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }

  async fastType(text) {
    try {
      let inputField;
      await this.browser.randomDelay(500);
      console.log('Fast typing: ' + text);
      if (await this.browser.getBrowserName() === 'safari') {
        inputField = await this.browser.sendKeysJS(this.selectorType, this.locator, text);
      } else {
        inputField = await this.browser.sendKeys(this.selectorType, this.locator, text);
      }
      const typedText = await inputField.getAttribute('value');
      console.log('typedText: ' + typedText);
      await this.browser.randomDelay(500);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }

  async pressEnter() {
    const element = await this.findElementOrFailStep();
    try {
      element.sendKeys(Key.ENTER);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }

  async pressTab() {
    const element = await this.findElementOrFailStep();
    try {
      element.sendKeys(Key.TAB);
    } catch (error) {
      await this.browser.issueError(error);
    }
  }
}

module.exports = TextInput;
