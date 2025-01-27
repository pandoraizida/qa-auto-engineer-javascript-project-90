import { test as base } from './baseFixture';
import LoginPage from '../pages/loginPage';
import AdminPage from '../pages/adminPage';
import { userCreds } from '../tests/constants';

export const test = base.extend({

  loginLogoutFixture: [async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(userCreds);

    await use();
   
    const adminPage = new AdminPage(page);
    await adminPage.logout();
  }, {auto: true}],

});
