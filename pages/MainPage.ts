import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Step } from '../core/decorators';
import IUtils from '../utils/utils';
import { BasePage } from '../core/BasePage';

// Load environment variables from .env file
dotenv.config();

const URL: string = process.env.URL as string;
const EMAIL: string = process.env.USERNAME as string; // This should return the full email
const PASSWORD: string = process.env.PASSWORD as string;
const SPACE: string = String.fromCharCode(32); // ASCII code for space
const PASSWORDWITHSPACE: string = PASSWORD.concat(SPACE);

export class MainPage extends BasePage {
  private readonly emailBox: Locator | undefined;
  private readonly PasswordBox: Locator | undefined;
  private readonly submitBtn: Locator | undefined;
  private readonly forgotPassword: Locator | undefined;
  private readonly forgotEmailInput: Locator | undefined;
  private readonly forgotEmailSubmitBtn: Locator | undefined;
  private readonly logoutBtn: Locator | undefined;
  private readonly logoutUrl: Locator | undefined;
  static instance: MainPage | null = null;

  constructor(public readonly page: Page, private iUtils: IUtils) {
    super(page);
    // Singleton logic
    if (MainPage.instance) {
      return MainPage.instance;
    }

    MainPage.instance = this;

    this.emailBox = this.page.locator('[id="email"]');
    this.PasswordBox = this.page.locator('[id="password"]');
    this.submitBtn = this.page.locator('[id="btn-login"]');
    this.forgotPassword = this.page.locator('[id="forgotswitcher"]');
    this.forgotEmailInput = this.page.locator('[id="forgotemail"]');
    this.forgotEmailSubmitBtn = this.page.locator('[id="btn-forgot"]');
    this.logoutBtn = this.page.locator('[data-id="button-user-menu"]');
    this.logoutUrl = this.page.locator('[href="/api/auth/logout"]');
  }

  @Step('Navigate to main page')
  async gotoPage() {
    await this.open(URL);
  }

  updateEnvFiles() {
    this.iUtils.updateEnv();
  }

  // async clickLogoutBtn() {
  //   await this.logoutBtn.click();
  // }

  // async clickLogoutUrl() {
  //   await this.logoutUrl.click();
  // }

  async compareToSnapeshot() {
    expect(await this.page.screenshot()).toMatchSnapshot(
      '../screenshots/screenshot.png'
    );
  }

  // async validateEmailFieldVisible() {
  //   await expect(this.emailBox).toBeVisible();
  // }

  // async validateEmailAttribute() {
  //   await expect(this.emailBox).toHaveAttribute(
  //     'placeholder',
  //     'Enter your email'
  //   );
  // }

  async validatePasswordFieldVisible() {
    await expect(this.PasswordBox).toBeVisible();
  }

  async validatePasswordPlaceholder(expectedPlaceholder: string) {
    await expect(this.PasswordBox).toHaveAttribute(
      'placeholder',
      expectedPlaceholder
    );
  }

  async validateSubmitButtonVisible() {
    await expect(this.submitBtn).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.emailBox.fill(email);
  }

  async fillForgotEmail(text: string) {
    await this.forgotEmailInput.fill(text);
  }

  async fillPassword(password: string) {
    await this.PasswordBox.fill(password);
  }

  async clickForgotPassword() {
    await this.forgotPassword.click();
  }

  async clickForgotEmailSubmitBtn() {
    await this.forgotEmailSubmitBtn.click();
  }

  async submit() {
    await this.submitBtn.click();
  }

  async validateLoginError(errorMessage: string) {
    const errorLocator = this.page.locator('.error-message');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toHaveText(errorMessage);
  }

  async clearCookiesWithUtils(browser: any): Promise<void> {
    await this.iUtils.clearCookies(browser, URL);
  }

  destroyinstance() {
    MainPage.instance = null;
  }
}
