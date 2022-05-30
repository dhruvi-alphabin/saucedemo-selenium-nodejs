const SelectorType = require('../BaseUI/SelectorType');
const Button = require('./../BaseUI/Component/Button');
const BasePage = require('./BasePage');

class LogOutPage extends BasePage {
  constructor(browser) {
    super(browser);
    this.url = browser.getAutomationPracticeBaseUrl() + 'inventory.html';
  }

  getToggleButton() {
    return new Button(this.browser, SelectorType.CSS, 'button[id="react-burger-menu-btn"]');
  }

  getLogOutLink() {
    return new Button(this.browser, SelectorType.CSS, 'a[id=\'logout_sidebar_link\']');
  }
}

module.exports = LogOutPage;
