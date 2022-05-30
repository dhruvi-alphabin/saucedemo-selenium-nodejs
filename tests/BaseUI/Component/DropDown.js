const WebComponent = require('./WebComponent');

class DropDown extends WebComponent {
  constructor(browser, selectorType, locator) {
    super(browser, selectorType, locator);
  }

  // Select an item in the drop down based on the text shown to the user
  async selectDropdownByText(text) {
    try {
      return await this.browser.selectDropDownByText(this.selectorType, this.locator, text);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }

  // Select an item in the drop down based on the value
  async selectDropdownByValue(text) {
    try {
      return await this.browser.selectDropDownByValue(this.selectorType, this.locator, text);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }

  // Select an item in the drop down based on the index of the child option.
  async selectDropdownByOptionIndex(index) {
    try {
      await this.browser.selectDropDownByOptionIndex(this.selectorType, this.locator, index);
    } catch (error) {
      return await this.browser.issueError(error);
    }
  }
}

module.exports = DropDown;
