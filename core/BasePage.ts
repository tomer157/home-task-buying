import { Page, BrowserContext } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page, protected context?: BrowserContext) {}

  /** Navigate to a given URL */
  async open(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
