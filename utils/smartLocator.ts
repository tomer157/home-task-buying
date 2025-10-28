// utils/LocatorFinder.ts
import { Page, Locator } from '@playwright/test';
import { Step } from '../core/decorators';
import fs from 'fs';
import path from 'path';

export class LocatorFinder {
  constructor(private readonly page: Page) {}

  /**
   * Attempts to locate an element using multiple selectors (fallback mechanism).
   * Retries automatically based on number of selectors provided.
   * Logs all attempts clearly for debugging.
   */
  @Step('Find element using multiple locators with fallback and retries')
  async waitForElement<T extends Locator>(
    selectors: string[],
    elementName: string,
    timeout?: number
  ): Promise<T | undefined> {
    const totalLocators = selectors.length;
    let attempts = 0;

    // Log setup
    const logDir = path.resolve('logs');
    fs.mkdirSync(logDir, { recursive: true });
    const logPath = path.join(logDir, 'locator-fallback.log');
    const log = (text: string) => {
      const line = `[${new Date().toISOString()}] ${text}\n`;
      console.log(text);
      fs.appendFileSync(logPath, line);
    };

    log(`🔍 Searching for [${elementName}] using ${totalLocators} locator(s)`);

    for (const selector of selectors) {
      attempts++;
      const currentLocator = this.page.locator(selector);
      log(
        `Attempt ${attempts}/${totalLocators} → Trying selector: ${selector}`
      );

      try {
        await currentLocator.first().waitFor({ state: 'visible', timeout });
        log(`✅ [${elementName}] FOUND using selector: ${selector}`);
        return currentLocator.first() as T;
      } catch (error) {
        log(`⚠️ [${elementName}] failed using selector: ${selector}`);
      }
    }

    log(`❌ [${elementName}] NOT FOUND after ${attempts} attempts`);
    return undefined;
  }
}
