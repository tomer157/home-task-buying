import { test, chromium, Browser, expect, Page } from '@playwright/test';

import { MainPage } from '../pages/MainPage';
import UtilsClass from '../utils/utils';
import path from 'path';
import fs from 'fs';

let browser: Browser;
let context;
let page: Page;
let utils: UtilsClass;
let mainPage: MainPage;

const fixturePath = path.resolve(__dirname, '..', 'data', 'searchData.json');
// 2) read and parse
const fixtureRaw = fs.readFileSync(fixturePath, 'utf-8');
const fixture = JSON.parse(fixtureRaw);

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
    await mainPage.logout();
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
    await expect(welcomeMsg!).toHaveText(fixture.welcomePageHeader); // todo add to fixtures!
  });

  test('Logout Between Positive And Negative log Tests', async () => {
    await mainPage.logout();
  });

  test('Negative test authentication functionality ', async () => {
    await mainPage.clickLoginBtn();
    await mainPage.fillLoginPageUsername();
    await mainPage.fillLoginPagePassword(fixture.badData.login); // todo add to fixtures
    await mainPage.clickOnLogInBtn();
    await page.waitForTimeout(333);
    await mainPage.handleLoginPopup();
  });
});
