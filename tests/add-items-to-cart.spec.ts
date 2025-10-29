import { test, chromium, Browser, expect, Page } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import UtilsClass from '../utils/utils';
import Functions from '../special-functions/functions';
import { CartPage } from '../pages/CartPage';
import fs from 'fs';
import path from 'path';

const fixturePath = path.resolve(__dirname, '..', 'data', 'searchData.json');
// 2) read and parse
const fixtureRaw = fs.readFileSync(fixturePath, 'utf-8');
const fixture = JSON.parse(fixtureRaw);
console.log('fixture apple:: ', fixture.productsToCart[0]);

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

    // 🔹 Remove only .png files (not folder)
    const screenshotDir = path.join(process.cwd(), 'screenshots');

    if (fs.existsSync(screenshotDir)) {
      const files = fs.readdirSync(screenshotDir);
      for (const file of files) {
        if (file.endsWith('.png')) {
          fs.unlinkSync(path.join(screenshotDir, file));
        }
      }
      console.log('🧹 Cleaned up screenshots folder (only PNGs removed).');
    }
  });

  test('add', async () => {
    const screenshotDir = 'screenshots';
    const pattern = /^item_\d+\.png$/;

    const before = await utils.countMatchingFiles(screenshotDir, pattern);

    const urls = [
      fixture.productsToCart[0].url,
      fixture.productsToCart[1].url,
      fixture.productsToCart[2].url,
    ];

    await funcs.addItemsToCart(urls, page);

    const after = await utils.countMatchingFiles(screenshotDir, pattern);

    expect(after - before).toBeGreaterThan(1);
  });

  test('test with empty params', async () => {
    const screenshotDir = 'screenshots';
    const pattern = /^item_\d+\.png$/;

    const before = await utils.countMatchingFiles(screenshotDir, pattern);

    await funcs.addItemsToCart([], page);

    const after = await utils.countMatchingFiles(screenshotDir, pattern);

    expect(after).toBe(before);
  });
});
