const WebComponent = require('./WebComponent');

class CheckBox extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  async select() {
    await this.browser.randomDelay(500);
    await super.click(this.selectorType, this.locator);
    await this.browser.randomDelay(1000);
  }

  async unselect() {
    await this.browser.randomDelay(500);
    await super.click(this.selectorType, this.locator);
    await this.browser.randomDelay(2000);
  }
}

module.exports = CheckBox;
