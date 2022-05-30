const BasePage = require('./BasePage');
const SelectorType = require('./../BaseUI/SelectorType');
const TextView = require('./../BaseUI/Component/TextView');
const Button = require('./../BaseUI/Component/Button');
const TextInput = require('./../BaseUI/Component/TextInput');
class AddToCart extends BasePage {
  constructor(browser) {
    super(browser);
    this.url = browser.getAutomationPracticeBaseUrl() + 'inventory.html';
  }

  async goToHomePage() {
    await super.goTo(this.url);
  }

  getAddToCartButton() {
    return new Button(this.browser, SelectorType.CSS, '#add-to-cart-sauce-labs-backpack');
  }

  getShoppingCartContainer() {
    return new Button(this.browser, SelectorType.CSS, '#shopping_cart_container');
  }

  getCheckOutButton() {
    return new Button(this.browser, SelectorType.CSS, '#checkout');
  }

  getInfoText() {
    return new TextView(this.browser, SelectorType.CSS, '.title');
  }

  inputFirstName() {
    return new TextInput(this.browser, SelectorType.CSS, 'input[id="first-name"]');
  }

  inputLastName() {
    return new TextInput(this.browser, SelectorType.CSS, 'input[id="last-name"]');
  }

  inputZipCode() {
    return new TextInput(this.browser, SelectorType.CSS, '#postal-code');
  }

  getContinueButton() {
    return new Button(this.browser, SelectorType.CSS, '#continue');
  }

  async fillInfoForm(fname, lname, zcode) {
    await this.inputFirstName().fastType(fname);
    await this.inputLastName().fastType(lname);
    await this.inputZipCode().fastType(zcode);
    await this.getContinueButton().click();
  }

  getFinishButton() {
    return new Button(this.browser, SelectorType.CSS, '#finish');
  }

  getCompletedOrderText() {
    return new TextView(this.browser, SelectorType.CSS, '.complete-header');
  }

  getBackToHomeButton() {
    return new Button(this.browser, SelectorType.CSS, '[id="back-to-products"]');
  }
}

module.exports = AddToCart;
