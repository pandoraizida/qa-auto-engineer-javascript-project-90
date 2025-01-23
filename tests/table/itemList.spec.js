import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import AdminPage from '../../pages/adminPage';
import TableElements from '../../pages/tableElemen';
import { userCreds, itemCount } from '../constants';

const usersTableColumns = ['Id', 'Email', 'First name', 'Last name', 'Created at'];
const labelTableColumns = ['Id', 'Name', 'Created at'];
const statusTableColumns = ['Id', 'Name', 'Slug', 'Created at'];

test.describe('Check item list view', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userCreds);
  });

  test.afterEach(async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.logout();
  });

  [
    { pageName: 'Users', tableHeaders: usersTableColumns, itemLength: itemCount.user },
    { pageName: 'Labels', tableHeaders: labelTableColumns, itemLength: itemCount.label },
    { pageName: 'Task statuses', tableHeaders: statusTableColumns, itemLength: itemCount.status },
  ].forEach(({ pageName, tableHeaders, itemLength }) => {
      test(`Should display correct ${pageName} page elements`, async ({ page }) => {
        const adminPage = new AdminPage(page);
        await adminPage.openPage(pageName);

        const tableElem = new TableElements(page);
        await expect(tableElem.createButton).toBeVisible();
        await expect(tableElem.exportButton).toBeVisible();
        await tableElem.expectElementsVisability(tableHeaders);
        await tableElem.expectItemsCount(itemLength);
      });
  });
})
