import { Page, BrowserContext } from '@playwright/test';

// Base class that all pom pages will inherit from..
// That will inforce same behaviour to all pages models..
export class BasePage {
  constructor(protected page: Page, protected context?: BrowserContext) {}

  /** Navigate to a given URL */
  async open(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
