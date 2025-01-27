import { expect } from '@playwright/test';
import { taskData, itemCount, taskStatus, taskCountWithStatus } from '../constants';
import { test } from '../../fixtures/authFixture';

const taskListFilters = ['Assignee', 'Status', 'Label'];
const taskFormFields = ['Assignee', 'Title', 'Status', 'Label'];
const increasedTaskCount = 16;
const decreasedTaskCount = 14;
const increasedTaskCountWithStatus = 4;
const decreasedTaskCountWithStatus = 2;

test.describe('Check interactions with tasks', () => {
    
  test.beforeEach(async ({ adminPage }) => {  
        await adminPage.openPage('Tasks');
  });

  test('Should display correct Task board elements', async ({ boardElem }) => {
      await expect(boardElem.createButton).toBeVisible();
      await expect(boardElem.exportButton).toBeVisible();
      await boardElem.expectElementsVisability(taskListFilters);
      await boardElem.expectHeadersVisability(taskStatus);
      await boardElem.expectCardsCount(itemCount.task);
  });

  test('Should display correct Create new task form elements', async ({ boardElem }) => {
      await boardElem.openCreateForm();

      await expect(boardElem.saveFormButton).toBeDisabled();
      await boardElem.expectTaskFieldsVisability();
  });

  test('Created new task should be displayed in the Task list', async ({ boardElem, adminPage }) => {
      await boardElem.expectCardsCount(itemCount.task);
      await boardElem.expectTaskCountWithStatus(taskData.status, taskCountWithStatus.toReview);

      await boardElem.openCreateForm();
      await boardElem.fillTaskForm(taskData);

      await expect(boardElem.saveFormButton).toBeDisabled();
      await boardElem.expectTaskFieldHasValue(taskData);

      await adminPage.openPage('Tasks');

      await boardElem.expectCardsCount(increasedTaskCount);
      await boardElem.expectTaskCardContain(taskData.title, [taskData.title, taskData.content]);
      await boardElem.expectTaskCountWithStatus(taskData.status, increasedTaskCountWithStatus);
  });

  test('Should display correct Edit task form elements', async ({ boardElem }) => {
      await boardElem.openEditFirstTaskForm();

      await expect(boardElem.saveFormButton).toBeDisabled();
      await expect(boardElem.showInfoButton).toBeVisible();
      await boardElem.expectFieldIsNotEmpty(taskFormFields);
      await expect(boardElem.contentField).not.toBeEmpty();
  });

  test('Edited task should be displayed in Task list with updated info', async ({ boardElem }) => {
      await boardElem.expectTaskCountWithStatus(taskStatus.draft, taskCountWithStatus.draft);
      await boardElem.expectTaskCountWithStatus(taskData.status, taskCountWithStatus.toReview);

      await boardElem.openEditFirstTaskForm();
      await boardElem.fillTaskForm(taskData);
      
      await boardElem.expectCardsCount(itemCount.task);
      await boardElem.expectTaskCardContain(taskData.title, [taskData.title, taskData.content]);
      await boardElem.expectTaskCountWithStatus(taskStatus.draft, decreasedTaskCountWithStatus);
      await boardElem.expectTaskCountWithStatus(taskData.status, increasedTaskCountWithStatus);
  });

  test('Edit task form: error message for empty Title field is displayed', async ({ boardElem }) => {
      await boardElem.openEditFirstTaskForm();
      await boardElem.clearFormField('Title');
      await boardElem.saveForm();

      await expect(boardElem.getErrorMessage('Required')).toBeVisible();
  });

  test('Deleted task should not be displayed in the Task list', async ({ boardElem }) => {
      await boardElem.expectCardsCount(itemCount.task);
      await boardElem.expectTaskCountWithStatus(taskStatus.draft ,taskCountWithStatus.draft);

      await boardElem.openEditFirstTaskForm();

      await expect(boardElem.deleteButton).toBeVisible();

      await boardElem.deleteItem();

      await boardElem.expectCardsCount(decreasedTaskCount);
      await boardElem.expectTaskCountWithStatus(taskStatus.draft, decreasedTaskCountWithStatus);
  });
})


