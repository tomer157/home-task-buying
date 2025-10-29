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

test.describe('Query items by price and quantity Tests', () => {
  test.beforeAll(async () => {
    utils = new UtilsClass();
    browser = await chromium.launch({ headless: false });

    context = await browser.newContext();
    page = await context.newPage();
    cartPage = new CartPage(page, utils);
    mainPage = new MainPage(page, utils);
    funcs = new Functions(mainPage, cartPage, utils); // ✅ connect Functions with MainPage

    await mainPage.updateEnvFiles();
    await mainPage.clearCookiesWithUtils(browser);
    await mainPage.gotoPage();
  });

  test.afterAll(async () => {
    await browser.close();
    mainPage.destroyinstance();
  });

  test('Fetch phones under 800 USD (max 5 items)', async () => {
    const urls = await funcs.searchItemsByNameUnderPrice(
      page,
      'phones',
      800,
      5
    );

    console.log('✅ Found URLs:', urls);

    // Expect non-empty array and all links to include 'prod.html'
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).toContain('prod.html');
    }
  });

  test('Fetch laptops under 900 USD (max 5 items)', async () => {
    const urls = await funcs.searchItemsByNameUnderPrice(
      page,
      'laptops',
      900,
      5
    );

    console.log('✅ Found URLs:', urls);

    // Basic validations
    expect(urls.length).toBeGreaterThan(0);
    urls.forEach((url) => expect(url).toContain('prod.html'));
  });

  test('Fetch monitors under 1200 USD (max 3 items)', async () => {
    const urls = await funcs.searchItemsByNameUnderPrice(
      page,
      'monitors',
      1200,
      3
    );

    console.log('✅ Found URLs:', urls);

    expect(urls.length).toBeGreaterThan(0);
  });

  test('Negative-test try to fetch a non existance product', async () => {
    const urls = await funcs.searchItemsByNameUnderPrice(page, 'shoes', 700, 6);
    console.log('✅ Found URLs:', urls);

    expect(urls.length).toBe(0);
  });

  test('Fetch monitors under 1200 USD (max 13 items) -- (so we will have to use next button )', async () => {
    test.setTimeout(60000);

    // Always start fresh before calling the function
    await mainPage.gotoPage();
    await page.waitForLoadState('networkidle');

    const urls = await funcs.searchItemsByNameUnderPrice(
      page,
      'monitors',
      1200,
      13
    );

    console.log('✅ Found URLs:', urls);

    expect(urls.length).toBeGreaterThan(0);
  });
});
