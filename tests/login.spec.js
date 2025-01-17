import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import AdminPage from '../pages/adminPage';

test.describe('Check Login page', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Should be visible correct Login from elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.lockIcon).toBeVisible();
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Error message for empty auth fild is displayed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.clickLoginButton();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Successful login and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();

    const adminPage = new AdminPage(page);
    await expect(adminPage.adminPageHeader).toBeVisible();
    await expect(adminPage.adminPageHeader).toHaveText('Welcome to the administration');

    await adminPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
})
