const BasePage = require('./BasePage');
const SelectorType = require('../BaseUI/SelectorType');
const Button = require('../BaseUI/Component/Button');
const TextInput = require('../BaseUI/Component/TextInput');
const TextView = require('../BaseUI/Component/TextView');
class LoginPage extends BasePage {
  constructor(browser) {
    super(browser);
    this.url = browser.getAutomationPracticeBaseUrl() + '';
  }

  async goToLoginPage() {
    await super.goTo(this.url);
  }

  getUserName() {
    return new TextInput(this.browser, SelectorType.CSS, '#user-name');
  }

  getPassword() {
    return new TextInput(this.browser, SelectorType.CSS, '#password');
  }

  getLoginButton() {
    return new Button(this.browser, SelectorType.CSS, '#login-button');
  }

  async fillLoginForm(username, password) {
    await this.getUserName().slowType(username);
    await this.getPassword().slowType(password);
    await this.getLoginButton().click();
  }

  // Invalid
  getErrorMessage() {
    return new TextView(this.browser, SelectorType.CSS, '[data-test="error"]');
  }
}

module.exports = LoginPage;
