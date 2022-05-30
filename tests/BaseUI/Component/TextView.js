const WebComponent = require('./WebComponent');

class TextView extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  async getText() {
    try {
      return await this.browser.getText(this.selectorType, this.locator);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }

  async getTextByJS() {
    try {
      const element = await this.findElementOrFailStep();
      return await this.browser.executeJavaScript('return arguments[0].innerText', element);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }
}

module.exports = TextView;
