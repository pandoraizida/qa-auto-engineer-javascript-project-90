import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import AdminPage from '../../pages/adminPage';
import BoardElements from '../../pages/boardElemen';
import { userCreds, taskData, itemCount } from '../constants';

const taskListFilters = ['Assignee', 'Status', 'Label'];
const taskListHeaders = ['Draft', 'To Review', 'To Be Fixed', 'To Publish', 'Published'];
const taskFormFields = ['Assignee', 'Title', 'Status', 'Label'];


test.describe('Check interactions with tasks', () => {

  test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(userCreds);

      const adminPage = new AdminPage(page);
      await adminPage.openPage('Tasks');
  });
  
  test.afterEach(async ({ page }) => {
      const adminPage = new AdminPage(page);
      await adminPage.logout();
  });

  test('Should display correct Task board elements', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await expect(boardElem.createButton).toBeVisible();
      await expect(boardElem.exportButton).toBeVisible();
      await boardElem.expectElementsVisability(taskListFilters);
      await boardElem.expectHeadersVisability(taskListHeaders);
      await boardElem.expectCardsCount(itemCount.task);
  });

  test('Should display correct Create new task form elements', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.openCreateForm();
      await expect(boardElem.saveFormButton).toBeDisabled();
      await boardElem.expectTaskFieldsVisability();
  });

  test('Created new task should be displayed in the Task list', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.openCreateForm();
      await boardElem.fillTaskForm(taskData);
      await expect(boardElem.saveFormButton).toBeDisabled();
      await boardElem.expectTaskFieldHasValue(taskData);

      const adminPage = new AdminPage(page);
      await adminPage.openPage('Tasks');
      await boardElem.expectCardsCount(itemCount.task + 1);
      await boardElem.expectTaskCardContain(taskData.title, [taskData.title, taskData.content]);
      await boardElem.expectTaskCountWithStatus(taskData.status, 4);
  });

  test('Should display correct Edit task form elements', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.openEditFirstTaskForm();
      await expect(boardElem.saveFormButton).toBeDisabled();
      await expect(boardElem.showInfoButton).toBeVisible();
      await boardElem.expectFieldIsNotEmpty(taskFormFields);
      await expect(boardElem.contentField).not.toBeEmpty();
  });

  test('Edited task should be displayed in Task list with updated info', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.expectTaskCountWithStatus('Draft', 3);
      await boardElem.expectTaskCountWithStatus(taskData.status, 3);

      await boardElem.openEditFirstTaskForm();
      await boardElem.fillTaskForm(taskData);
      
      await boardElem.expectCardsCount(itemCount.task);
      await boardElem.expectTaskCardContain(taskData.title, [taskData.title, taskData.content]);
      await boardElem.expectTaskCountWithStatus('Draft', 2);
      await boardElem.expectTaskCountWithStatus(taskData.status, 4);
  });

  test('Edit task form: error message for empty Title field is displayed', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.openEditFirstTaskForm();
      await boardElem.clearFormField('Title');
      await boardElem.saveForm();
      await expect(boardElem.getErrorMessage('Required')).toBeVisible();
  });

  test('Deleted task should not be displayed in the Task list', async ({ page }) => {
      const boardElem = new BoardElements(page);
      await boardElem.expectCardsCount(itemCount.task);

      await boardElem.openEditFirstTaskForm();
      await expect(boardElem.deleteButton).toBeVisible();
      await boardElem.deleteItem();
      await boardElem.expectCardsCount(itemCount.task - 1);
      await boardElem.expectTaskCountWithStatus('Draft', 2);
  });
})


