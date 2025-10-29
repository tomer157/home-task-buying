import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Step } from '../core/decorators';
import IUtils from '../utils/utils';
import { BasePage } from '../core/BasePage';
import { LocatorFinder } from '../utils/smartLocator';

// Load environment variables from .env file
dotenv.config();

const URL: string = process.env.URL as string;
const EMAIL: string = process.env.EMAIL as string; // This should return the full email
const PASSWORD: string = process.env.PASSWORD as string;
const SPACE: string = String.fromCharCode(32); // ASCII code for space
const PASSWORDWITHSPACE: string = PASSWORD.concat(SPACE);

export class MainPage extends BasePage {
  private readonly loginBtnSelector?: string;
  private readonly loginBtnXpath?: string;
  private readonly loginFieldSelector?: string;
  private readonly loginFieldXpath?: string;
  private readonly passwordSelector?: string;
  private readonly passwordXpath?: string;
  private readonly loginBtnFirst?: string;
  private readonly loginBtnSecond?: string;
  private readonly userWelcomeMsgFirst?: string;
  private readonly userWelcomeMsgSecond?: string;
  private readonly logOutBtnSelector?: string;
  private readonly phonesXpath?: string;
  private readonly secondaryPhoneXpath?: string;
  private readonly logOutBtnXpath?: string;
  private readonly laptopsXpath?: string;
  private readonly secondaryLaptopsXapth?: string;
  private readonly monitorXpath?: string;
  private readonly secondaryMonitorXpath?: string;
  private readonly cardContainerXpath?: string;
  private readonly secondCardContainerXpath?: string;
  static instance: MainPage | null = null;
  private readonly locatorFinder!: LocatorFinder;

  constructor(public readonly page: Page, private iUtils: IUtils) {
    super(page);
    // Singleton logic
    if (MainPage.instance) {
      return MainPage.instance;
    }

    MainPage.instance = this;
    this.locatorFinder = new LocatorFinder(page);

    this.loginBtnSelector = '[id="login2"]';
    this.loginBtnXpath = "//*[@id='login2']";
    this.loginFieldSelector = "[id='loginusername']";
    this.loginFieldXpath = "//input[@id='loginusername']";
    this.passwordSelector = '[id="loginpassword"]';
    this.passwordXpath = "//input[@id='loginpassword']";
    this.loginBtnFirst = "//button[text()='Log in']";
    this.loginBtnSecond =
      "//div[@class='modal-footer']/button[text()='Log in']";
    this.logOutBtnSelector = "[id='logout2']";
    this.logOutBtnXpath = "//a[@id='logout2']";

    this.userWelcomeMsgFirst = "[id='nameofuser']";
    this.userWelcomeMsgSecond = "//a[@id='nameofuser']";
    this.phonesXpath = "//a[text()='Phones']";
    this.secondaryPhoneXpath = "//div[@class='list-group']//a[text()='Phones']";
    this.laptopsXpath = "//div[@class='list-group']//a[text()='Laptops']";
    this.secondaryLaptopsXapth = "(//a[text()='Laptops'])";
    this.monitorXpath = "//div[@class='list-group']//a[text()='Monitors']";
    this.secondaryMonitorXpath = "//a[text()='Monitors']";
    this.cardContainerXpath = "//div[@id='tbodyid']/div";
    this.secondCardContainerXpath =
      "//div[@class='col-lg-9']//div[@id='tbodyid']/div";
  }

  @Step('Navigate to main page')
  async gotoPage() {
    await this.open(URL);
  }

  updateEnvFiles() {
    this.iUtils.updateEnv();
  }

  @Step('Click Login Button with Smart Selector')
  async clickLoginBtn(): Promise<void> {
    const selectors = [this.loginBtnSelector, this.loginBtnXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'Login Button'
    );

    await element?.click();
    console.log('✅ Clicked login button successfully');
  }

  @Step('validate login page username opened correctly')
  async validateLoginPageUserName(): Promise<Locator | undefined> {
    const selectors = [this.loginFieldSelector, this.loginFieldXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'username'
    );
    await element?.isVisible();
    return element;
  }

  @Step('open phones category')
  async openPhonesCategory(): Promise<Locator | undefined> {
    const selectors = [this.phonesXpath, this.secondaryPhoneXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'phones category'
    );
    await element?.isVisible();
    return element;
  }

  @Step('open laptops category')
  async openLaptopsCategory(): Promise<Locator | undefined> {
    const selectors = [this.laptopsXpath, this.secondaryLaptopsXapth].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'laptops category'
    );
    await element?.isVisible();
    return element;
  }

  @Step('open monitors category')
  async openMonitorsCategory(): Promise<Locator | undefined> {
    const selectors = [this.monitorXpath, this.secondaryMonitorXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'monitor category'
    );
    await element?.isVisible();
    return element;
  }

  @Step('validate login page password opened correctly')
  async validateLoginPagePassword(): Promise<Locator | undefined> {
    const selectors = [this.passwordSelector, this.passwordXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'password',
      8000
    );

    await element?.isVisible();
    return element;
  }

  @Step('fill in the login field')
  async fillLoginPageUsername(email = EMAIL): Promise<void> {
    const selectors = [this.loginFieldSelector, this.loginFieldXpath].filter(
      Boolean
    ) as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'login username input',
      8000
    );

    await element?.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(300);
    await element?.fill(email);
    console.log('✅ Username filled successfully');
  }

  @Step('fill in the password field')
  async fillLoginPagePassword(password = PASSWORD): Promise<void> {
    console.log('password param: ', password);
    const selectors = [this.passwordSelector, this.passwordXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'password field updating',
      5555
    );

    // ✅ Wait for it to be editable and visible
    await element?.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(300);
    await element?.fill(password);
  }

  @Step('click the login buttin')
  async clickOnLogInBtn(): Promise<void> {
    const selectors = [this.loginBtnFirst, this.loginBtnSecond].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'login button',
      5555
    );

    await element?.waitFor({ state: 'visible', timeout: 5000 });
    await element?.click();
  }

  @Step('fetch cards container div')
  async fetchCardsContainer(): Promise<Locator | undefined> {
    const selectors = [
      this.cardContainerXpath,
      this.secondCardContainerXpath,
    ].filter(Boolean) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'cards container',
      5555
    );
    await element?.waitFor({ state: 'visible', timeout: 5000 });
    return element;
  }

  @Step('validate welcome field message')
  async validateWelcomeFieldMsg(): Promise<Locator | undefined> {
    const selectors = [
      this.userWelcomeMsgFirst,
      this.userWelcomeMsgSecond,
    ].filter(Boolean) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'user welcome message',
      5555
    );
    await element?.waitFor({ state: 'visible', timeout: 5000 });
    return element;
  }

  @Step('Handle wrong password popup')
  async handleLoginPopup(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      console.log(`⚠️ Alert detected: ${dialog.message()}`);

      // ✅ Validate message
      if (dialog.message().includes('Wrong password')) {
        console.log('✅ Detected correct alert message');
      } else {
        throw new Error(`Unexpected alert message: ${dialog.message()}`);
      }

      // ✅ Accept or dismiss the popup
      await dialog.accept(); // click OK
    });
  }

  @Step('Logout method')
  async logout(): Promise<void> {
    const selectors = [this.logOutBtnSelector, this.logOutBtnXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'logout',
      5555
    );
  }

  async clearCookiesWithUtils(browser: any): Promise<void> {
    await this.iUtils.clearCookies(browser, URL);
  }

  destroyinstance() {
    MainPage.instance = null;
  }
}
