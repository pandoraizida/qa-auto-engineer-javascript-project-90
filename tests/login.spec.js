import {  expect } from '@playwright/test';
import  { userCreds }  from '../tests/constants';
import { test } from '../fixtures/baseFixture';

test.describe('Check Login page', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Should be visible correct Login from elements', async ({ loginPage }) => {
    await expect(loginPage.lockIcon).toBeVisible();
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Error message "Required" for empty auth fild is displayed', async ({ loginPage }) => {
    await loginPage.clickLoginButton();

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Successful login and logout', async ({loginPage, adminPage }) => {
    await loginPage.login(userCreds);

    await expect(adminPage.adminPageHeader).toBeVisible();
    await expect(adminPage.adminPageHeader).toHaveText('Welcome to the administration');

    await adminPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });
})
