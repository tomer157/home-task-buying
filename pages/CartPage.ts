import { Page, Locator } from '@playwright/test';
import { Step } from '../core/decorators';
import { BasePage } from '../core/BasePage';
import { LocatorFinder } from '../utils/smartLocator';
import IUtils from '../utils/utils';

export class CartPage extends BasePage {
  // private readonly;
  static instance: CartPage | null = null;
  private readonly locatorFinder!: LocatorFinder;
  private readonly addToCartXpath?: string;
  private readonly secondaryAddToCartXpath?: string;

  constructor(public readonly page: Page, private iUtils: IUtils) {
    super(page);
    // Singleton logic
    if (CartPage.instance) {
      return CartPage.instance;
    }

    CartPage.instance = this;
    this.locatorFinder = new LocatorFinder(page);
    this.addToCartXpath = "//a[text()='Add to cart']";
    this.secondaryAddToCartXpath = "//div//a[text()='Add to cart']";
  }

  @Step('add item to cart functionality')
  async addItemToCart(): Promise<Locator | undefined> {
    const selectors = [
      this.addToCartXpath,
      this.secondaryAddToCartXpath,
    ].filter(Boolean) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'Add to cart Button'
    );

    await element?.isVisible();
    return element;
  }
}
