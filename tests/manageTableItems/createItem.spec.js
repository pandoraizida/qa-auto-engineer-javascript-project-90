import { expect } from '@playwright/test';
import { userData, labelData, statusData } from '../constants';
import { test } from '../../fixtures/authFixture';

export const updatedItemCount = {
  user: 9,
  label: 6,
  status: 6
}

test.describe('Check creating item flow', () => {
  
    [
      { pageName: 'user', formFields: userData },
      { pageName: 'label', formFields: labelData },
      { pageName: 'task status', formFields: statusData }
    ].forEach(({ pageName, formFields }) => {
        test(`Should display correct Create new ${pageName} form elements`, async ({ adminPage, tableElem }) => {
          await adminPage.openPage(pageName);
          await tableElem.openCreateForm();

          await tableElem.expectElementsVisability(formFields);
          await expect(tableElem.saveFormButton).toBeDisabled();
        });
    });

    [
        { pageName: 'Users', dataValues: userData, itemLengthAfterCreating: updatedItemCount.user },
        { pageName: 'Labels', dataValues: labelData, itemLengthAfterCreating: updatedItemCount.label },
        { pageName: 'Task statuses', dataValues: statusData, itemLengthAfterCreating: updatedItemCount.status },
      ].forEach(({ pageName, dataValues, itemLengthAfterCreating }) => {
          test(`Created new item should be displayed in ${pageName} table`, async ({ adminPage, tableElem }) => {
            await adminPage.openPage(pageName);
            await tableElem.openCreateForm();
            await tableElem.fillFormWithData(dataValues);

            await expect(tableElem.saveFormButton).toBeDisabled();
            await tableElem.expectFieldHasValue(dataValues);

            await adminPage.openPage(pageName);
            
            await tableElem.expectItemsCount(itemLengthAfterCreating);
            await tableElem.expectItemContain(dataValues);
          });
      });
})
