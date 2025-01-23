import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import AdminPage from '../../pages/adminPage';
import TableElements from '../../pages/tableElemen';
import { userCreds, itemCount } from '../constants';

test.describe('Check deleting item flow', () => {

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
      { pageName: 'Users', itemLength: itemCount.user },
      { pageName: 'Labels', itemLength: itemCount.label },
      { pageName: 'Task statuses', itemLength: itemCount.status }
    ].forEach(({ pageName, itemLength }) => {
        test(`Deleted item should not be displayed in ${pageName} page`, async ({ page }) => {
          const adminPage = new AdminPage(page);
          await adminPage.openPage(pageName);
  
          const tableElem = new TableElements(page);
          await tableElem.expectItemsCount(itemLength);
          
          await tableElem.openEditForm();
          await expect(tableElem.deleteButton).toBeVisible();
          await tableElem.deleteItem();
          await tableElem.expectItemsCount(itemLength - 1);
        });
    });

    [
      { pageName: 'Users', selectedItems: itemCount.user, expectedText: 'No Users yet.' },
      { pageName: 'Labels', selectedItems: itemCount.label, expectedText: 'No Labels yet.' },
      { pageName: 'Task statuses', selectedItems: itemCount.status, expectedText: 'No Task statuses yet.' }
    ].forEach(({ pageName, selectedItems, expectedText }) => {
        test(`${pageName} page: after deleting all items the empty page is displayed`, async ({ page }) => {
          const adminPage = new AdminPage(page);
          await adminPage.openPage(pageName);
    
          const tableElem = new TableElements(page);
          await expect(tableElem.checkboxForAllItems).toBeVisible();
          await tableElem.selectAllItems();
          await expect(tableElem.selectedItemsNote(`${selectedItems} items selected`)).toBeVisible();
          await expect(tableElem.deleteButton).toBeVisible();
          
          await tableElem.deleteItem();
          await expect(tableElem.getText(expectedText)).toBeVisible();
          await expect(tableElem.createButton).toBeVisible();
        });
    });
})
