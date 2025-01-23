import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import AdminPage from '../../pages/adminPage';
import TableElements from '../../pages/tableElemen';
import { userCreds, userData, labelData, statusData, itemCount } from '../constants';

test.describe('Check creating item flow', () => {

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
      { pageName: 'user', formFields: userData },
      { pageName: 'label', formFields: labelData },
      { pageName: 'task status', formFields: statusData }
    ].forEach(({ pageName, formFields }) => {
        test(`Should display correct Create new ${pageName} form elements`, async ({ page }) => {
          const adminPage = new AdminPage(page);
          await adminPage.openPage(pageName);
  
          const tableElem = new TableElements(page);
          await tableElem.openCreateForm();
          await tableElem.expectElementsVisability(formFields);
          await expect(tableElem.saveFormButton).toBeDisabled();
        });
    });

    [
        { pageName: 'Users', dataValues: userData, itemLength: itemCount.user },
        { pageName: 'Labels', dataValues: labelData, itemLength: itemCount.label },
        { pageName: 'Task statuses', dataValues: statusData, itemLength: itemCount.status },
      ].forEach(({ pageName, dataValues, itemLength }) => {
          test(`Created new item should be displayed in ${pageName} table`, async ({ page }) => {
            const adminPage = new AdminPage(page);
            await adminPage.openPage(pageName);
    
            const tableElem = new TableElements(page);
            await tableElem.openCreateForm();
            await tableElem.fillFormWithData(dataValues);
            await expect(tableElem.saveFormButton).toBeDisabled();
            await tableElem.expectFieldHasValue(dataValues);

            await adminPage.openPage(pageName);
            await tableElem.expectItemsCount(itemLength + 1);
            await tableElem.expectItemContain(dataValues);
          });
      });
})
