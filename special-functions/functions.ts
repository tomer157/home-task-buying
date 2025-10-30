import { Page, Locator, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { CartPage } from '../pages/CartPage';
import UtilsClass from '../utils/utils';
import fs from 'fs';
import path from 'path';

interface ProductItem {
  name: string;
  price: number;
  url: string;
}

interface CategoryStrategy {
  name: string;
  getLocator: () => Promise<Locator | undefined>;
}

export default class Functions {
  constructor(
    private mainPage: MainPage,
    private cartPage: CartPage,
    private utils: UtilsClass
  ) {}

  // This Strategy Pattern  map points to MainPage methods that return locators
  // So we can change behaviour and different products in runtime!
  private CategoryStrategies: Record<string, CategoryStrategy> = {
    phones: {
      name: 'phones',
      getLocator: async () => await this.mainPage.openPhonesCategory(),
    },
    laptops: {
      name: 'laptops',
      getLocator: async () => await this.mainPage.openLaptopsCategory(),
    },
    monitors: {
      name: 'monitors',
      getLocator: async () => await this.mainPage.openMonitorsCategory(),
    },
  };

  private getStrategyByQuery(query: string): CategoryStrategy | null {
    const key = Object.keys(this.CategoryStrategies).find((k) =>
      query.toLowerCase().includes(k.toLowerCase())
    );
    return key ? this.CategoryStrategies[key] : null;
  }
  /*
   task 4.1 fetch items under price and quantity conditions..
  */
  async searchItemsByNameUnderPrice(
    page: Page,
    query: string,
    maxPrice: number,
    limit = 5
  ): Promise<string[]> {
    const strategy = this.getStrategyByQuery(query);
    if (!strategy) {
      console.warn(`No category found for query: ${query}`);
      return [];
    }

    const categoryButton = await strategy.getLocator();
    if (!categoryButton) {
      console.error('Failed to resolve category locator');
      return [];
    }

    // Open category and wait for cards
    await categoryButton.click();
    await page.waitForSelector('#tbodyid > div.col-lg-4', { timeout: 5000 });

    const foundItems: ProductItem[] = [];

    // -------- Page 1 scan (guarded) --------
    {
      const productCards = page.locator('#tbodyid > div.col-lg-4');
      const count = await productCards.count();
      console.log('product cards count (p1):', count, 'limit:', limit);

      for (let i = 0; i < count && foundItems.length < limit; i++) {
        const card = productCards.nth(i);
        const nameLoc = card.locator('.card-title a');
        const priceLoc = card.locator('.card-block h5');

        try {
          await Promise.all([
            nameLoc.waitFor({ state: 'attached', timeout: 1500 }),
            priceLoc.waitFor({ state: 'attached', timeout: 1500 }),
          ]);

          const name = (await nameLoc.textContent())?.trim() || '';
          const priceText = (await priceLoc.textContent())?.trim() || '';
          const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ''));
          const href = await nameLoc.getAttribute('href');
          const fullUrl = href ? new URL(href, page.url()).href : '';

          if (!Number.isFinite(price)) {
            console.warn(`Skipping card #${i} (p1): bad price "${priceText}"`);
            continue;
          }
          if (price <= maxPrice) foundItems.push({ name, price, url: fullUrl });
        } catch (e) {
          console.warn(`Skipping card #${i} (p1): ${String(e)}`);
          continue;
        }
      }
      console.log(`✅ Collected ${foundItems.length} items on page 1`);
    }

    // --------  Page 2 scan (only if still short) --------
    if (foundItems.length < limit) {
      const nextButton = page.locator(
        '//button[contains(text(),"Next") or @id="next2"]'
      );
      const hasNext =
        (await nextButton.count()) > 0 &&
        (await nextButton.isEnabled().catch(() => true));

      if (hasNext) {
        console.log('➡️ Clicking Next to fetch more items...');
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#tbodyid > div.col-lg-4', {
          timeout: 10000,
        });

        const nextCards = page.locator('#tbodyid > div.col-lg-4');
        const nextCount = await nextCards.count();
        console.log(`📄 Page 2 has ${nextCount} items`);

        for (let i = 0; i < nextCount && foundItems.length < limit; i++) {
          const card = nextCards.nth(i);
          const nameLoc = card.locator('.card-title a');
          const priceLoc = card.locator('.card-block h5');

          try {
            await Promise.all([
              nameLoc.waitFor({ state: 'attached', timeout: 1500 }),
              priceLoc.waitFor({ state: 'attached', timeout: 1500 }),
            ]);

            const name = (await nameLoc.textContent())?.trim() || '';
            const priceText = (await priceLoc.textContent())?.trim() || '';
            const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const href = await nameLoc.getAttribute('href');
            const fullUrl = href ? new URL(href, page.url()).href : '';

            if (!Number.isFinite(price)) {
              console.warn(
                `Skipping card #${i} (p2): bad price "${priceText}"`
              );
              continue;
            }
            if (price <= maxPrice)
              foundItems.push({ name, price, url: fullUrl });
          } catch (e) {
            console.warn(`Skipping card #${i} (p2): ${String(e)}`);
            continue;
          }
        }
        console.log(`✅ Total collected after page 2: ${foundItems.length}`);
      }
    }

    // -------- No-results guard --------
    if (foundItems.length === 0) {
      console.warn(`⚠️ No products ≤ ${maxPrice} found for "${query}".`);
      return [];
    }

    return foundItems.map((i) => i.url).slice(0, limit);
  }

  /*
    Taks 4.2 add items to cart and log each one
   */
  async addItemsToCart(urls: string[], page: Page): Promise<void> {
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    if (!urls || urls.length === 0) {
      console.warn('⚠️ No URLs provided to addItemsToCart.');
      return;
    }

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const addToCartBtn = await this.cartPage.addItemToCart();
      await addToCartBtn?.waitFor({ state: 'visible', timeout: 5000 });
      await addToCartBtn?.click();

      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });

      // Wait a short moment to ensure alert handled
      await page.waitForTimeout(1500);

      // ✅ Revisit product page again to take screenshot
      await page.goto(url, { waitUntil: 'networkidle' });

      // Take a screenshot for logs
      const screenshotPath = `screenshots/item_${i + 1}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  }

  /* 4.3 — assert cart total ≤ budgetPerItem * itemsCount */
  async assertCartTotalNotExceeds(
    budgetPerItem: number,
    itemsCount: number
  ): Promise<void> {
    const page = this.cartPage.page;

    // ensure artifacts folder
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }

    // guard
    if (!itemsCount) return;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join('screenshots', `cart-${ts}.png`);

    // 1) Open the cart
    const cartLink = await this.cartPage.cartBtnElement();
    if (await cartLink?.count()) {
      await cartLink?.first().click();
    } else {
      await page.goto('/cart.html', { waitUntil: 'domcontentloaded' });
    }

    await page.waitForLoadState('networkidle');

    // 2) Try to read the total if it exists (empty cart = no #totalp)
    const totalLocator = await this.cartPage.cartTotalHeader();

    let totalText = '0';
    let totalNumber = 0;

    // Wait until it’s visible and has text
    await totalLocator?.waitFor({ state: 'visible', timeout: 15000 });

    totalText = (await totalLocator?.textContent())?.trim() ?? '0';
    totalNumber = Number.parseFloat(
      totalText.replace(/[^0-9.,]/g, '').replace(/,/g, '')
    );

    if (Number.isNaN(totalNumber)) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      throw new Error(
        `Could not parse cart total from "${totalText}". Screenshot: ${screenshotPath}`
      );
    }

    // 3) Compute threshold
    const threshold = budgetPerItem * itemsCount;

    // 4) Capture evidence
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`🧮 Cart total: ${totalNumber} | Threshold: ${threshold}`);
    console.log(`📸 Screenshot: ${screenshotPath}`);

    // 5) Assert
    expect(
      totalNumber,
      `Cart total "${totalText}" parsed as ${totalNumber} must be ≤ ${threshold} (budget ${budgetPerItem} × items ${itemsCount}). Screenshot: ${screenshotPath}`
    ).toBeLessThanOrEqual(threshold);
  }

  // empty cart func
  async clearCart(page: Page): Promise<void> {
    // open cart
    const addToCartBtn = await this.cartPage.cartBtnElement();
    await addToCartBtn?.waitFor({ state: 'visible', timeout: 5000 });
    await addToCartBtn?.click();

    // tbody (the cart table body)
    const tbody = await this.cartPage.cartBodyElement(); // should be locator('[id="tbodyid"]')
    if (!tbody) return; // nothing to clear (defensive)
    await tbody.waitFor({ state: 'visible', timeout: 5000 });

    // 3) rows locator (not optional)
    const rows = tbody.locator('tr');

    // ✅ EARLY EXIT: if cart is empty, stop right away
    const initialCount = await rows.count();
    if (initialCount === 0) {
      console.log('🧺 Cart already empty — nothing to delete.');
      // optional: return to main page
      // await this.mainPage.gotoPage();
      return;
    }

    // keep deleting the first row until none left
    while ((await rows.count()) > 0) {
      await rows.first().getByText('Delete', { exact: true }).click();
      // tiny settle so DOM updates before next iteration
      await page.waitForTimeout(300);
    }

    // go back to main page
    //  await this.mainPage.gotoPage();
  }
}
