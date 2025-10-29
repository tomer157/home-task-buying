import { Page, Locator } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import UtilsClass from '../utils/utils';

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
  constructor(private mainPage: MainPage, private utils: UtilsClass) {}

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

    // Get the locator from the strategy (via MainPage)
    const categoryButton = await strategy.getLocator();
    if (!categoryButton) {
      console.error('Failed to resolve category locator');
      return [];
    }

    // Click the locator to load that category
    await categoryButton.click();
    await page.waitForSelector('#tbodyid > div.col-lg-4', { timeout: 5000 });

    // Query product cards
    const productCards = page.locator('#tbodyid > div.col-lg-4');
    const count = await productCards.count();
    console.log('product cards count ', count);
    console.log('limit ', limit);

    const foundItems: ProductItem[] = [];

    for (let i = 0; i < count && foundItems.length < limit; i++) {
      const card = productCards.nth(i);
      const name =
        (await card.locator('.card-title a').textContent())?.trim() || '';
      const priceText =
        (await card.locator('.card-block h5').textContent())?.trim() || '';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const href = await card.locator('.card-title a').getAttribute('href');
      const fullUrl = href ? new URL(href, page.url()).href : '';

      if (price <= maxPrice) foundItems.push({ name, price, url: fullUrl });
    }

    console.log(`✅ Collected ${foundItems.length} items on page 1`);

    // if needed fetch the rest from the next pages...
    if (foundItems.length < limit) {
      const nextButton = page.locator(
        '//button[contains(text(),"Next") or @id="next2"]'
      );
      const hasNext =
        (await nextButton.count()) > 0 && (await nextButton.isEnabled());

      if (hasNext) {
        console.log('➡️ Clicking Next to fetch more items...');
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#tbodyid > div.col-lg-4', {
          timeout: 5000,
        });

        const nextCards = page.locator('#tbodyid > div.col-lg-4');
        const nextCount = await nextCards.count();
        console.log(`📄 Page 2 has ${nextCount} items`);

        for (let i = 0; i < nextCount && foundItems.length < limit; i++) {
          const card = nextCards.nth(i);
          const name =
            (await card.locator('.card-title a').textContent())?.trim() || '';
          const priceText =
            (await card.locator('.card-block h5').textContent())?.trim() || '';
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          const href = await card.locator('.card-title a').getAttribute('href');
          const fullUrl = href ? new URL(href, page.url()).href : '';

          if (price <= maxPrice) foundItems.push({ name, price, url: fullUrl });
        }
      }
    }

    return foundItems.map((i) => i.url).slice(0, limit);
  }
}
