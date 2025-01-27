import { expect } from '@playwright/test';
import { userData, labelData, statusData, itemCount } from '../constants';
import { test } from '../../fixtures/authFixture';

test.describe('Check editing item flow', () => {
  
    [
      { pageName: 'user', formFields: userData },
      { pageName: 'label', formFields: labelData },
      { pageName: 'task status', formFields: statusData }
    ].forEach(({ pageName, formFields }) => {
        test(`Should display correct Edit ${pageName} form elements`, async ({ adminPage, tableElem }) => {
          await adminPage.openPage(pageName);
          await tableElem.openEditForm();

          await tableElem.expectElementsVisability(formFields);
          await expect(tableElem.saveFormButton).toBeDisabled();
          await expect(tableElem.showInfoButton).toBeVisible();
          await expect(tableElem.deleteButton).toBeVisible();
          await tableElem.expectFieldIsNotEmpty(formFields);
        });
    });

    [
      { pageName: 'Users', dataValues: userData, tableLength: itemCount.user },
      { pageName: 'Labels', dataValues: labelData, tableLength: itemCount.label },
      { pageName: 'Task statuses', dataValues: statusData, tableLength: itemCount.status }
    ].forEach(({ pageName, dataValues, tableLength }) => {
        test(`Edited item should be displayed in ${pageName} table with updated info`, async ({ adminPage, tableElem }) => {
          await adminPage.openPage(pageName);
          await tableElem.openEditForm();
          await tableElem.fillFormWithData(dataValues);
    
          await tableElem.expectItemsCount(tableLength);
          await tableElem.expectItemContain(dataValues);
        });
    });
})

test.describe('Check Edit form fields validation', () => {

    [
      { field: 'Email', message: 'Required' },
      { field: 'First name', message: 'Required' },
      { field: 'Last name', message: 'Required' }
    ].forEach(({ field, message }) => {
        test(`Edit user form: error message for empty ${field} field is displayed`, async ({ adminPage, tableElem }) => {
            await adminPage.openPage('Users');
            await tableElem.openEditForm();
            await tableElem.clearFormField(field);
            await tableElem.saveForm();

            await expect(tableElem.getErrorMessage(message)).toBeVisible();
        });
    });
    
    test('Edit user form: error message for invalid email is displayed', async ({ adminPage, tableElem }) => {
        await adminPage.openPage('Users');
        await tableElem.openEditForm();
        await tableElem.clearFormField('Email');
        await tableElem.getField('Email').fill('email');
        await tableElem.saveForm();

        await expect(tableElem.getErrorMessage('Incorrect email format')).toBeVisible();
    });

    test('Edit label form: error message for empty Name field is displayed', async ({ adminPage, tableElem }) => {
        await adminPage.openPage('Labels');
        await tableElem.openEditForm();
        await tableElem.clearFormField('Name');
        await tableElem.saveForm();

        await expect(tableElem.getErrorMessage('Required')).toBeVisible();
    });

    [
      { field: 'Name', message: 'Required' },
      { field: 'Slug', message: 'Required' }
    ].forEach(({ field, message }) => {
        test(`Edit status form: Error message for empty ${field} field is displayed`, async ({ adminPage, tableElem }) => {
            await adminPage.openPage('Task statuses');
            await tableElem.openEditForm();
            await tableElem.clearFormField(field);
            await tableElem.saveForm();
            
            await expect(tableElem.getErrorMessage(message)).toBeVisible();
        });
    });
})
