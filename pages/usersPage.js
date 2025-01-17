import { expect } from "@playwright/test";

export default class UsersPage {
    constructor(page) {
      this.page = page;
      this.createUserButton = this.page.getByRole('link').filter({ hasText: 'Create' });
      this.exportUsersButton = this.page.getByRole('button', { name: 'Export' });
      this.table = this.page.getByRole('table');
      this.tableRow = this.page.getByRole('row');
      this.showUserInfo = this.page.getByRole('link').filter({ hasText: 'Show' });
      this.saveUserButton = this.page.getByRole('button', { name: 'Save' });
      this.deleteUserButton = this.page.getByRole('button', { name: 'Delete' });
    }

    getField(label) {
      return this.page.getByLabel(label);
    }

    getErrorMessage(text) {
        return this.page.getByRole('paragraph').filter({ hasText: text });
    }

    checkboxForAll() {
        return this.page.getByTestId('CheckBoxOutlineBlankIcon').first();
    }

    getText(text) {
        return this.page.getByText(text);
    }

    async openCreateUserForm() {
      await this.createUserButton.click();
    }

    async saveUserForm() {
        await this.saveUserButton.click();
    }

    async deleteUser() {
        await this.deleteUserButton.click();
    }

    async clearField(label) {
        await this.page.getByLabel(label).clear();
    }

    async fillUserForm(userdata) {
      await this.page.getByLabel('Email').fill(userdata.email);
      await this.page.getByLabel('First name').fill(userdata.first_name);
      await this.page.getByLabel('Last name').fill(userdata.last_name);
      await this.saveUserForm();
    }

    async openEditUserForm() {
        const lastRow = this.page.getByRole('row').last();
        await lastRow.click();
    }

    async selectAllUsers() {
        await this.checkboxForAll().click({ force: true });
    }

    async expectTableRowLength(number) {
        expect(await this.tableRow.count()).toBe(number);
    }

    async expectElementsVisability(elements) {
      elements.forEach((elem) => {
        expect(this.page.getByLabel(elem)).toBeVisible();
      })
    }

    async expectLastRowContain(userdata, condition = true) {
      const values = Object.values(userdata);
      const lastRow =  this.page.getByRole('row').last();
      if (condition) {
        values.forEach((value) => {
            expect(lastRow).toContainText(value);
          })
      } else {
        values.forEach((value) => {
            expect(lastRow).not.toContainText(value);
          })
      }
    }

    async expectFieldHasValue(userdata) {
        await expect(this.page.getByLabel('Email')).toHaveValue(userdata.email);
        await expect(this.page.getByLabel('First name')).toHaveValue(userdata.first_name);
        await expect(this.page.getByLabel('Last name')).toHaveValue(userdata.last_name);
    }

}