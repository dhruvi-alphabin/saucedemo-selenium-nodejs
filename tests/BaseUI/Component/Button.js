const WebComponent = require('./WebComponent');

class Button extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  async click() {
    await this.browser.randomDelay(200);
    if (await this.browser.getBrowserName() === 'safari') {
      await this.browser.clickJS(this.selectorType, this.locator);
    } else {
      await super.click(this.selectorType, this.locator);
    }
    await this.browser.randomDelay(200);
  }

  async clickJS() {
    await this.browser.randomDelay(100);
    await this.browser.clickJS(this.selectorType, this.locator);
    await this.browser.randomDelay(100);
  }

  async getText() {
    try {
      return await this.browser.getText(this.selectorType, this.locator);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }
}

module.exports = Button;
