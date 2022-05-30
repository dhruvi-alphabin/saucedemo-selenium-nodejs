const LoginPage = require('./../Pages/LoginPage');
const AddToCart = require('./AddToCart');
const LogOutPage = require('./LogoutPage');

class AllPages {
  constructor(browser) {
    this.loginPage = new LoginPage(browser);
    this.addToCart = new AddToCart(browser);
    this.logoutPage = new LogOutPage(browser);
  }
}

module.exports = AllPages;
