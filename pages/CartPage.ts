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
  private readonly navbarCartBtnSelector?: string;
  private readonly navbarCartBtnXpath?: string;
  private readonly totalPriceSelector?: string;
  private readonly totalPriceXpath?: string;
  private readonly cartBodySelector?: string;
  private readonly cartBodyXpath?: string;

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
    this.navbarCartBtnSelector = "a[id='cartur']";
    this.navbarCartBtnXpath = "//a[@id='cartur']";
    this.totalPriceSelector = "h3[id='totalp']";
    this.totalPriceXpath = "//h3[@id='totalp']";
    this.cartBodySelector = "tbody[id='tbodyid']";
    this.cartBodyXpath = "//tbody[@id='tbodyid']";
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

  @Step('return  navbar cart button element')
  async cartBtnElement(): Promise<Locator | undefined> {
    const selectors = [
      this.navbarCartBtnSelector,
      this.navbarCartBtnXpath,
    ].filter(Boolean) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'Cart button'
    );

    await element?.isVisible();
    return element;
  }

  @Step('return cart total ')
  async cartTotalHeader(): Promise<Locator | undefined> {
    const selectors = [this.totalPriceSelector, this.totalPriceXpath].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'Cart total'
    );

    await element?.isVisible();
    return element;
  }

  @Step('return cart table body element')
  async cartBodyElement(): Promise<Locator | undefined> {
    const selectors = [this.cartBodyXpath, this.cartBodySelector].filter(
      Boolean
    ) as unknown as string[];
    const element = await this.locatorFinder.waitForElement<Locator>(
      selectors,
      'Cart table body'
    );

    await element?.isVisible();
    return element;
  }
}
