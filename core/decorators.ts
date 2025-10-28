// utils/decorators.ts
import fs from 'fs';
import path from 'path';
import { Page } from '@playwright/test';
import 'reflect-metadata';

export function Step(message: string) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // ✅ Guard for invalid usage
    if (!descriptor || typeof descriptor.value !== 'function') {
      return;
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const logDir = path.resolve('logs');
      const logFile = path.join(logDir, 'run.log');
      fs.mkdirSync(logDir, { recursive: true });

      const timestamp = new Date().toISOString();
      const log = (text: string) => {
        const line = `[${timestamp}] ${text}\n`;
        console.log(text);
        fs.appendFileSync(logFile, line);
      };

      log(`➡️ Step: ${message}`);
      try {
        const result = await originalMethod.apply(this, args);
        log(`✅ Done: ${message}`);
        return result;
      } catch (error) {
        log(`❌ Failed: ${message}`);
        // optional screenshot support if this.page exists
        const page: Page | undefined = (this as any).page;
        if (page && typeof page.screenshot === 'function') {
          const shotDir = path.resolve('test-results/screenshots');
          fs.mkdirSync(shotDir, { recursive: true });
          const shotPath = path.join(
            shotDir,
            `${message.replace(/\s+/g, '_')}-${Date.now()}.png`
          );
          await page.screenshot({ path: shotPath, fullPage: true });
          log(`📸 Screenshot saved at: ${shotPath}`);
        }
        log(`Error details: ${(error as Error).message}`);
        throw error;
      }
    };
  };
}
