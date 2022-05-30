const AllPages = require('../Pages/AllPages');
const BrowserFactory = require('./../BaseUI/BrowserFactory');
const {expect} = require('chai');
const {describe, before} = require('mocha');

describe('Demo Website Test', () => {
  let allPages;
  before('Open Browser', async () => {
    this.browser = await BrowserFactory.createBrowser();
    await this.browser.getAutomationPracticeBaseUrl();
    allPages = await new AllPages(this.browser);
  });

  describe('Login Page Testing', () => {
    const username = 'standard_user';
    const password = 'secret_sauce';
    const lockuser = 'locked_out_user';
    const lockPass = 'lock_password';
    const firstname = 'Maahi';
    const lastname = 'Patel';
    const ZipCode = '23454';

    it('Verify User Should login with valid credentials', async () => {
      await allPages.loginPage.goToLoginPage();
      expect(await this.browser.getCurrentUrl()).to.equal(allPages.loginPage.url);
      await allPages.loginPage.fillLoginForm(username, password);
    });

    it('verify should not login with invalid credentials', async () => {
      await allPages.loginPage.goToLoginPage();
      expect(await this.browser.getCurrentUrl()).to.equal(allPages.loginPage.url);
      await allPages.loginPage.fillLoginForm(lockuser, lockPass);

      const errMsg = await allPages.loginPage.getErrorMessage().getText();
      expect(errMsg).to.equal('Epic sadface: Username and password do not match any user in this service');

      await allPages.loginPage.fillLoginForm(username, password);
    });

    it('Should display Home page and user should able to add to cart product', async () => {
      expect(await this.browser.getCurrentUrl()).to.equal(allPages.addToCart.url);
      await allPages.addToCart.getAddToCartButton().click();
      await allPages.addToCart.getShoppingCartContainer().click();
      await allPages.addToCart.getCheckOutButton().click();

      const infoText = await allPages.addToCart.getInfoText().getText();
      expect(infoText).to.equal('CHECKOUT: YOUR INFORMATION');
      await allPages.addToCart.fillInfoForm(firstname, lastname, ZipCode);
      await allPages.addToCart.getFinishButton().click();

      const orderText = await allPages.addToCart.getCompletedOrderText().getText();
      expect(orderText).to.equal('THANK YOU FOR YOUR ORDER');

      await allPages.addToCart.getBackToHomeButton().click();
      await this.browser.delay(1000);
    });

    it('User should able to logout', async () => {
      await allPages.logoutPage.getToggleButton().click();
      await allPages.logoutPage.getLogOutLink().click();
      await this.browser.delay(2000);
    });
  });

  after('Close the browser', async () => {
    await this.browser.close();
  });
});
