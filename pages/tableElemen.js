import { expect } from "@playwright/test";

export default class TableElements {
    constructor(page) {
      this.page = page;
      this.createButton = this.page.getByRole('link').filter({ hasText: 'Create' });
      this.exportButton = this.page.getByRole('button', { name: 'Export' });
      this.tableRow = this.page.getByRole('row');
      this.tableTitle = this.tableRow.first();
      this.showInfoButton = this.page.getByRole('link').filter({ hasText: 'Show' });
      this.saveFormButton = this.page.getByRole('button', { name: 'Save' });
      this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
      this.checkboxForAllItems = this.page.getByTestId('CheckBoxOutlineBlankIcon').first();
    }

    getErrorMessage(text) {
        return this.page.getByRole('paragraph').filter({ hasText: text });
    }

    getText(text) {
        return this.page.getByText(text);
    }

    getField(label) {
        return this.page.getByLabel(label);
    }

    selectedItemsNote(text) {
        return this.page.getByRole("heading", { name: text });
    }

    async openCreateForm() {
      await this.createButton.click();
    }

    async saveForm() {
        await this.saveFormButton.click();
    }

    async deleteItem() {
        await this.deleteButton.click();
    }

    async clearFormField(label) {
        await this.page.getByLabel(label).clear();
    }

    async openEditForm() {
        const lastRow = this.page.getByRole('row').last();
        await lastRow.click();
    }

    async selectAllItems() {
        await this.checkboxForAllItems.click({ force: true });
    }

    async fillFormWithData(data) {
      for (const item in data) {
          await this.getField(item).fill(data[item]);
        }
      await this.saveForm();
    }

    async expectItemsCount(number) {
      expect(await this.tableRow.count() - 1).toBe(number);
    }

    async expectElementsVisability(elements) {
      const elementsArray = Array.isArray(elements) ? elements : Object.keys(elements);
      elementsArray.forEach((elem) => {
        expect(this.getField(elem)).toBeVisible();
      })
    }

    async expectItemContain(userdata, condition = true) {
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
      for (const item in userdata) {
        await expect(this.getField(item)).toHaveValue(userdata[item]);
      }
    }

    async expectFieldIsNotEmpty(userdata) {
      const fields = Array.isArray(userdata) ? userdata : Object.keys(userdata);
      for (const field of fields) {
        await expect(this.getField(field)).not.toBeEmpty();
      }
    }
}
