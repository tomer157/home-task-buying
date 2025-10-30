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

test.describe('Assert cart total tests', () => {
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

  test('assert cart laptops with price 1500 and count 5 ', async () => {
    const urls = await funcs.searchItemsByNameUnderPrice(
      page,
      'laptops',
      1500,
      5
    );
    await funcs.addItemsToCart(urls, page);
    await funcs.assertCartTotalNotExceeds(1500, urls.length);
  });

  test('delete all cart products', async () => {});

  test('negative test cart laptops with under price   ', async () => {
    const urls = await funcs.searchItemsByNameUnderPrice(
      page,
      'laptops',
      200,
      5
    );

    // ✅ Core negative assertion: nothing should match ≤ 200
    expect(urls.length).toBe(0);

    await funcs.addItemsToCart(urls, page);
    await funcs.assertCartTotalNotExceeds(200, urls.length);
  });
});
