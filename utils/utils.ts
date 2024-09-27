import { Browser } from 'playwright'; // Make sure to import the correct type
import dotenv from 'dotenv';
import fs from  'fs'


interface IUtils {
    updateEnv(): void;
    clearCookies(browser:Browser, url: string): void;
}

class UtilsClass implements IUtils {
    updateEnv(): void {
        // Load environment variables from .env file
        dotenv.config();
        const envConfig = dotenv.parse(fs.readFileSync('.env'))
        for (const key in envConfig) {
             process.env[key] = envConfig[key]
            } 
    }

    async clearCookies(browser: Browser, url: string): Promise<void> {
        try {
            const context = await browser.newContext();
            
            // Navigate to the specified URL
            const page = await context.newPage();
            await page.goto(url);
    
            // Clear all cookies
            await context.clearCookies();
    
            // Optionally, perform actions like logging in or interacting with the site
            // ...
    
            // Close the context
            await context.close();
        } catch (error) {
            console.error('Error clearing cookies:', error);
            throw error
        }
    }
}



const clearCookies = async (browser: Browser, url: string) => {
    try {
        const context = await browser.newContext();
        
        // Navigate to the specified URL
        const page = await context.newPage();
        await page.goto(url);

        // Clear all cookies
        await context.clearCookies();

        // Optionally, perform actions like logging in or interacting with the site
        // ...

        // Close the context
        await context.close();
    } catch (error) {
        console.error('Error clearing cookies:', error);
    }
};


export default UtilsClass;
