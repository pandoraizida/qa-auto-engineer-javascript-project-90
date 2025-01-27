import { expect } from "@playwright/test";
import TableElements from '../pages/tableElemen';

export default class BoardElements extends TableElements {
    
    constructor(page) {
        super(page);
        this.page = page;
        this.taskCard = this.page.locator('.MuiCard-root');
        this.contentField = this.page.getByLabel('Content', { exact: true });
        this.firstTaskCard = this.taskCard.first();
        this.addFilterButton = this.page.getByRole('button', { name: 'Add Filter' });
    }

    async currentTaskCard(text) {
        return this.page.getByRole('button').filter({ hasText: text });
    }

    async getTaskColumn(text) {
        return this.page.locator('.MuiBox-root').locator('.MuiBox-root').filter({ hasText: text });
    }

    async selectDropdownValue(label, text) {
        await this.getField(label).click();
        await this.page.getByRole('option').filter({ hasText: text }).click();
    }

    async fillTaskForm(data) {
        await this.selectDropdownValue('Assignee', data.assignee);
        await this.getField('Title').fill(data.title);
        await this.contentField.fill(data.content);
        await this.selectDropdownValue('Status', data.status);
        await this.selectDropdownValue('Label', data.label);
        await this.page.keyboard.press('Escape');
        await this.saveForm();
    }

    async openEditFirstTaskForm() {
        await this.firstTaskCard.getByRole('link').filter({ hasText: 'Edit' }).click();
    }

    async dragAndDropFirsCardTo(toColumn) {
        const source = await this.firstTaskCard;
        const target = await this.getTaskColumn(toColumn);
        const targetBox = await target.boundingBox();
        await source.hover();
        await this.page.mouse.down();
        await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
        await this.page.mouse.up();
    }

    async expectCardsCount(number) {
        await expect(this.taskCard).toHaveCount(number);
    }

    async expectTaskCountWithStatus(status, number) {
        const column = await this.getTaskColumn(status);
        await expect(column.locator('.MuiCard-root')).toHaveCount(number);
    }

    async expectHeadersVisability(userdata) {
        const elements = Object.values(userdata);
        elements.forEach((elem) => {
          expect(this.page.getByRole('heading', { name: elem })).toBeVisible();
        })
    }

    async expectTaskFieldsVisability() {
        await expect(this.getField('Assignee')).toBeVisible();
        await expect(this.getField('Title')).toBeVisible();
        await expect(this.getField('Status')).toBeVisible();
        await expect(this.getField('Label')).toBeVisible();
        await expect(this.contentField).toBeVisible();
    }

    async expectTaskFieldHasValue(data) {
      await expect(this.page.getByRole('combobox').filter({ hasText: data.assignee })).toBeVisible();
      await expect(this.getField('Title')).toHaveValue(data.title);
      await expect(this.contentField).toHaveValue(data.content);
      await expect(this.page.getByRole('combobox').filter({ hasText: data.status })).toBeVisible();
      await expect(this.page.getByRole('combobox').filter({ hasText: data.label })).toBeVisible();
    }

    async expectTaskCardContain(text, data) {
        const card = await this.currentTaskCard(text);
        data.forEach((value) => {
            expect(card).toContainText(value);
        })
    }
}