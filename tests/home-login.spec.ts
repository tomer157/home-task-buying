import { test, chromium, Browser } from '@playwright/test';
import dotenv from 'dotenv';
import { MainPage } from '../pages/MainPage';
import UtilsClass from '../utils/utils';

// ✅ Load environment first
dotenv.config();

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

    // optional: clean cookies and navigate to login page
    await mainPage.clearCookiesWithUtils(browser);
    await mainPage.gotoPage();
  });

  test.afterAll(async () => {
    await browser.close();
    mainPage.destroyinstance();
  });

  //TODO : ADD COOKIS AND SESSION DELETION
  test('Logout', async () => {
    // // Example placeholder
    // await mainPage.clickLogoutBtn();
    // await mainPage.clickLogoutUrl();
  });
});
