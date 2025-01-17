export default class LeftSideBar {
    constructor(page) {
      this.page = page;
      this.dashboardMenu = this.page.getByTestId('DashboardIcon');
    }

    async openUsersPage() {
      await this.page.getByRole('menuitem').filter({ hasText: 'Users' }).click();
    }   
}