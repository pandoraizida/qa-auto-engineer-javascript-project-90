export default class LoginPage {
    constructor(page) {
      this.page = page;
      this.lockIcon = page.getByTestId('LockIcon');
      this.usernameField = page.getByLabel('Username');
      this.passwordField = page.getByLabel('Password');
      this.loginButton = page.getByRole('button', { name: 'Sign in' });
      this.errorMessage = this.page.getByText('Required').last();
    }

    async goto() {
      await this.page.goto('/login');
    }

    async clickLoginButton() {
      await this.loginButton.click();
    }

    async login(userdata) {
      await this.goto();
      await this.usernameField.fill(userdata.username);
      await this.passwordField.fill(userdata.password);
      await this.clickLoginButton();
    }
}
