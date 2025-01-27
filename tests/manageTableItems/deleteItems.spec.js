import { expect } from '@playwright/test';
import { itemCount } from '../constants';
import { test } from '../../fixtures/authFixture';

export const updatedItemCount = {
  user: 7,
  label: 4,
  status: 4
}

test.describe('Check deleting item flow', () => {
  
    [
      { pageName: 'Users', itemLengthBeforeDelete: itemCount.user, itemLengthAftereDelete: updatedItemCount.user },
      { pageName: 'Labels', itemLengthBeforeDelete: itemCount.label, itemLengthAftereDelete: updatedItemCount.label },
      { pageName: 'Task statuses', itemLengthBeforeDelete: itemCount.status, itemLengthAftereDelete: updatedItemCount.status }
    ].forEach(({ pageName, itemLengthBeforeDelete, itemLengthAftereDelete }) => {
        test(`Deleted item should not be displayed in ${pageName} page`, async ({ adminPage, tableElem }) => {
          await adminPage.openPage(pageName);
  
          await tableElem.expectItemsCount(itemLengthBeforeDelete);
          
          await tableElem.openEditForm();

          await expect(tableElem.deleteButton).toBeVisible();

          await tableElem.deleteItem();
          
          await tableElem.expectItemsCount(itemLengthAftereDelete);
        });
    });

    [
      { pageName: 'Users', selectedItems: itemCount.user, expectedText: 'No Users yet.' },
      { pageName: 'Labels', selectedItems: itemCount.label, expectedText: 'No Labels yet.' },
      { pageName: 'Task statuses', selectedItems: itemCount.status, expectedText: 'No Task statuses yet.' }
    ].forEach(({ pageName, selectedItems, expectedText }) => {
        test(`${pageName} page: after deleting all items the empty page is displayed`, async ({ adminPage, tableElem }) => {
          await adminPage.openPage(pageName);
    
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
