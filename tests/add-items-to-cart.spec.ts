import { test, chromium, Browser, expect, Page } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import UtilsClass from '../utils/utils';
import Functions from '../special-functions/functions';
import { CartPage } from '../pages/CartPage';

let browser: Browser;
let context;
let page: Page;
let utils: UtilsClass;
let mainPage: MainPage;
let cartPage: CartPage;
let funcs: Functions;

test.describe('Add items to cart Tests', () => {
  test.beforeAll(async () => {
    utils = new UtilsClass();
    browser = await chromium.launch({ headless: false });

    context = await browser.newContext();
    page = await context.newPage();
    cartPage = new CartPage(page, utils);
    mainPage = new MainPage(page, utils);
    funcs = new Functions(mainPage, cartPage, utils);

    await mainPage.updateEnvFiles();
    await mainPage.clearCookiesWithUtils(browser);
    await mainPage.gotoPage();
  });

  test.afterAll(async () => {
    await browser.close();
    mainPage.destroyinstance();
  });

  test('add', async () => {
    const screenshotDir = 'screenshots';
    const pattern = /^cart_item_\d+\.png$/;

    const before = await utils.countMatchingFiles(screenshotDir, pattern);

    const urls = [
      'https://www.demoblaze.com/prod.html?idp_=10',
      'https://www.demoblaze.com/prod.html?idp_=8',
      'https://www.demoblaze.com/prod.html?idp_=14',
      // ... more product URLs
    ];

    await funcs.addItemsToCart(urls, page);

    const after = await utils.countMatchingFiles(screenshotDir, pattern);

    expect(after - before).toBeGreaterThan(1);
  });
});
