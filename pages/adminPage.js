export default class AdminPage {
    constructor(page) {
      this.page = page;
      this.adminPageHeader = page.getByRole('heading');
      this.userProfileButton = page.getByAltText('Jane Doe');
    }

    async logout() {
      await this.userProfileButton.click();
      await this.page.getByTestId('PowerSettingsNewIcon').click();
    }

    async openPage(text) {
      await this.page.getByRole('menuitem').filter({ hasText: text }).click();
    }
}