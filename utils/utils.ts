import { Browser } from 'playwright'; // Make sure to import the correct type
import dotenv from 'dotenv';
import fs from  'fs'


interface IUtils {
    updateEnv(): void;
    clearCookies(browser:Browser, url: string): void;
}

class UtilsClass implements IUtils {
    updateEnv(): void {
        dotenv.config();
        const envConfig = dotenv.parse(fs.readFileSync('.env'))
        for (const key in envConfig) {
             process.env[key] = envConfig[key]
            } 
    }

    async clearCookies(browser: Browser, url: string): Promise<void> {
        try {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(url);
            await context.clearCookies();
            await context.close();
        } catch (error) {
            console.error('Error clearing cookies:', error);
            throw error
        }
    }
}




export default UtilsClass;
