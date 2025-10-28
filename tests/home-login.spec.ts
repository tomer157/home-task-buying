import { test, chromium, Browser, expect } from '@playwright/test';

import { MainPage } from '../pages/MainPage';
import UtilsClass from '../utils/utils';

let browser: Browser;
let context;
let page;
let utils: UtilsClass;
let mainPage: MainPage;

test.describe('Login Tests', () => {
  test.beforeAll(async () => {
    utils = new UtilsClass();
    browser = await chromium.launch({ headless: false });

    context = await browser.newContext();
    page = await context.newPage();

    mainPage = new MainPage(page, utils);
    await mainPage.updateEnvFiles();
    // clean cookies and navigate to login page
    await mainPage.clearCookiesWithUtils(browser);
    await mainPage.gotoPage();
  });

  test.afterAll(async () => {
    await browser.close();
    mainPage.destroyinstance();
  });

  test('test authentication functionality and validate fields', async () => {
    await mainPage.clickLoginBtn();

    const loginUserName = await mainPage.validateLoginPageUserName();
    await expect(loginUserName!).toBeVisible();

    const loginPassword = await mainPage.validateLoginPagePassword();
    await expect(loginPassword!).toBeVisible();

    await mainPage.fillLoginPageUsername();
    await mainPage.fillLoginPagePassword();
    await mainPage.clickOnLogInBtn();

    const welcomeMsg = await mainPage.validateWelcomeFieldMsg();
    await expect(welcomeMsg!).toBeVisible();
    await expect(welcomeMsg!).toHaveText('Welcome https://temp-mail.org/en');
  });

  //TODO : ADD COOKIS AND SESSION DELETION
  test('Logout', async () => {});

  test('Negative test authentication functionality ', async () => {
    await mainPage.clickLoginBtn();

    await mainPage.fillLoginPageUsername();
    await mainPage.fillLoginPagePassword('fffffffff');
    await mainPage.clickOnLogInBtn();
    await mainPage.handleLoginPopup();
  });

  //TODO : ADD COOKIS AND SESSION DELETION
  test.skip('Logout', async () => {
    // // Example placeholder
    // await mainPage.clickLogoutBtn();
    // await mainPage.clickLogoutUrl();
  });
});
