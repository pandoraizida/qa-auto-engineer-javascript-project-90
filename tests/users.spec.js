import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import UsersPage from '../pages/usersPage';
import LeftSideBar from '../pages/leftSidebar';
import AdminPage from '../pages/adminPage';

const userData1 = {
    email: 'test@gmail.com',
    first_name: 'Firstname',
    last_name: 'Lastname'
}

const userData2 = {
    email: 'edit@gmail.com',
    first_name: 'Edit',
    last_name: 'Edit'
}

const userFormFields = ['Email', 'First name', 'Last Name'];
const usersTableColumns = ['Id', 'Email', 'First name', 'Last name', 'Created at'];

test.describe('Check creating user flow', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login();

    const sideBar = new LeftSideBar(page);
    await sideBar.openUsersPage();
  });

  test.afterEach(async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.logout();
  });

  test('Should display correct Users page elements', async ({ page }) => {
    const usersPage = new UsersPage(page);
    await expect(usersPage.createUserButton).toBeVisible();
    await expect(usersPage.exportUsersButton).toBeVisible();
    await expect(usersPage.table).toBeVisible();
    await usersPage.expectTableRowLength(9);
    await usersPage.expectElementsVisability(usersTableColumns);
  });

  test('Should display correct Create new user form elements', async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.openCreateUserForm();
    await usersPage.expectElementsVisability(userFormFields);
    await expect(usersPage.saveUserButton).toBeDisabled();
  });

  test('Created new user should be displayed in the Users table', async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.openCreateUserForm();
    await usersPage.fillUserForm(userData1);

    const sideBar = new LeftSideBar(page);
    await sideBar.openUsersPage();

    await usersPage.expectTableRowLength(10);
    await usersPage.expectLastRowContain(userData1);
  });
})

test.describe('Check editing user flow', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login();
  
    const sideBar = new LeftSideBar(page);
    await sideBar.openUsersPage();

    const usersPage = new UsersPage(page);
    await usersPage.openCreateUserForm();
    await usersPage.fillUserForm(userData1);

    await sideBar.openUsersPage();
    await usersPage.expectTableRowLength(10);
    await usersPage.openEditUserForm();
  });
  
  test.afterEach(async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.logout();
  });

  test('Should display correct Edit user form elements', async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.expectElementsVisability(userFormFields);
    await expect(usersPage.saveUserButton).toBeDisabled();
    await expect(usersPage.showUserInfo).toBeVisible();
    await expect(usersPage.deleteUserButton).toBeVisible();
    await usersPage.expectFieldHasValue(userData1);
  });

  test('Edited user info should be displayed in the User table', async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.fillUserForm(userData2);
    await usersPage.expectTableRowLength(10);
    await usersPage.expectLastRowContain(userData2);
  });
})

test.describe('Check Edit form validation', () => {

    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login();
    
      const sideBar = new LeftSideBar(page);
      await sideBar.openUsersPage();
        
      const usersPage = new UsersPage(page);
      await usersPage.expectTableRowLength(9);
      await usersPage.openEditUserForm();
    });
    
    test.afterEach(async ({ page }) => {
      const adminPage = new AdminPage(page);
      await adminPage.logout();
    });
  
    [
      { field: 'Email', message: 'Required' },
      { field: 'First name', message: 'Required' },
      { field: 'Last name', message: 'Required' }
    ].forEach(({ field, message }) => {
        test(`Error message for empty ${field} is displayed`, async ({ page }) => {
            const usersPage = new UsersPage(page);
            await usersPage.clearField(field);
            usersPage.saveUserForm();
            await expect(usersPage.getErrorMessage(message)).toBeVisible();
        });
    });

    test('Error message for invalid email is displayed', async ({ page }) => {
        const usersPage = new UsersPage(page);
    
        await usersPage.clearField('Email');
        await usersPage.getField('Email').fill('email');
        await usersPage.saveUserForm();
        await expect(usersPage.getErrorMessage('Incorrect email format')).toBeVisible();
    });
})

test.describe('Check deleting users flow', () => {

    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login();
    
      const sideBar = new LeftSideBar(page);
      await sideBar.openUsersPage();
    });
    
    test.afterEach(async ({ page }) => {
      const adminPage = new AdminPage(page);
      await adminPage.logout();
    });

    test('Deleted user should not be displayed in the User table', async ({ page }) => {
        const usersPage = new UsersPage(page);
        await usersPage.openCreateUserForm();
        await usersPage.fillUserForm(userData1);
        const sideBar = new LeftSideBar(page);
        await sideBar.openUsersPage();
        await usersPage.expectTableRowLength(10);
        await usersPage.openEditUserForm();
        await expect(usersPage.deleteUserButton).toBeVisible();
        
        await usersPage.deleteUser();
        await usersPage.expectTableRowLength(9);
        await usersPage.expectLastRowContain(userData1, false);
    });

    test('After deleting all users the empty page is displayed', async ({ page }) => {
        const usersPage = new UsersPage(page);
        await expect(usersPage.checkboxForAll()).toBeVisible();
        await usersPage.selectAllUsers();
        await expect(usersPage.deleteUserButton).toBeVisible();
        await usersPage.deleteUser();
        await expect(usersPage.getText('No Users yet.')).toBeVisible();

    });
})
