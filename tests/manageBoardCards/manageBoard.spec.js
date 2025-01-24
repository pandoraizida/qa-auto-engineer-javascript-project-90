import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import AdminPage from '../../pages/adminPage';
import BoardElements from '../../pages/boardElemen';
import { userCreds, itemCount } from '../constants';

test.describe('Check interactions with board', () => {

    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(userCreds);

      const adminPage = new AdminPage(page);
      await adminPage.openPage('Tasks');

      const boardElem = new BoardElements(page);
      await boardElem.expectCardsCount(itemCount.task);
    });
  
    test.afterEach(async ({ page }) => {
      const adminPage = new AdminPage(page);
      await adminPage.logout();
    });

    test('D&D task card is works as expected', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.expectTaskCountWithStatus('Draft', 3);
      await boardElem.expectTaskCountWithStatus('Published', 3);
    
      await boardElem.dragAndDropFirsCardTo('Published');
      await boardElem.expectTaskCountWithStatus('Draft', 2);
      await boardElem.expectTaskCountWithStatus('Published', 4);
    });

    [
      { filterField: 'Assignee', valueToSelect: 'jack@yahoo.com', expectedTaskCount: 5 },
      { filterField: 'Status', valueToSelect: 'To Publish', expectedTaskCount: 3 },
      { filterField: 'Label', valueToSelect: 'bug', expectedTaskCount: 2 }
    ].forEach(({ filterField, valueToSelect, expectedTaskCount }) => {
        test(`Filtering by ${filterField} works as expected`, async ({ page }) => {
          const boardElem = new BoardElements(page);
          await boardElem.selectDropdownValue(filterField, valueToSelect);
          await expect(boardElem.addFilterButton).toBeVisible();
          await boardElem.expectCardsCount(expectedTaskCount);
        });
    });

    test('Multiple filtering works as expected', async ({ page }) => {
      const boardElem = new BoardElements(page);
        await boardElem.selectDropdownValue('Assignee', 'alice@hotmail.com');
        await boardElem.selectDropdownValue('Status', 'To Be Fixed');
        await boardElem.selectDropdownValue('Label', 'feature');
        await expect(boardElem.addFilterButton).toBeVisible();
        await boardElem.expectCardsCount(1);
    });
})
