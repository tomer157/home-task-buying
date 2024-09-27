import { test, expect, chromium } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import { MainPage } from '../page-objects-mapping/MainPage';
import UtilsClass from '../utils/utils'; // Adjust the path as necessary

let browser;
let context;
let page;
let utils: UtilsClass;

const URL: string = process.env.URL as string;
const EMAIL: string = process.env.USERNAME as string; 
const PASSWORD: string = process.env.PASSWORD as string;
const SPACE: string = String.fromCharCode(32); 
const PASSWORDWITHSPACE: string = PASSWORD.concat(SPACE);

test.describe("Login Tests", () => {
    let mainPage: MainPage;

    // Setup the browser and context before all tests
    test.beforeAll(async () => {
        utils = new UtilsClass(); // Create an instance of UtilsClass
        utils.updateEnv(); // Load environment variables

        browser = await chromium.launch(); // Launch the browser
        context = await browser.newContext(); // Create a new browser context
        page = await context.newPage(); // Open a new page
        
        // Instantiate MainPage after page creation
        mainPage = new MainPage(page, utils); 
        await page.waitForTimeout(3333); // Adjust as necessary
    });

    // Close the browser after all tests
    test.afterAll(async () => {
        await browser.close(); // Close the browser
        mainPage.destroyinstance(); // Clean up instance
    });

    // Test to verify the login page title
    test("Open page and verify login", async () => {
        mainPage.updateEnvFiles();
        await mainPage.goto();
        await mainPage.clearCookies(browser, URL);
        await expect(page).toHaveTitle('Sign In with Auth0');
    });

    // Test to verify the email field
    test("Verify page login form Email", async () => {
        await mainPage.goto();
        await mainPage.validateEmailFieldVisible();
        await mainPage.validateEmailAttribute();
    });

    // Test to compare main page to snapshot
    test("Compare main page to snapshot picture", async () => {
        await mainPage.goto();
        await page.waitForTimeout(2500);
        await mainPage.compareToSnapeshot();
    });

    // Test to verify the password field
    test("Verify page login form Password", async () => {
        await mainPage.goto();
        await mainPage.validatePasswordFieldVisible();
        await mainPage.validatePasswordPlaceholder("Enter your password");
    });

    // Test password recovery process
    test("Password Recovery", async () => {
        await mainPage.goto();
        await mainPage.clickForgotPassword();
        await mainPage.fillForgotEmail(EMAIL);
        await mainPage.clickForgotEmailSubmitBtn();
    });

    // Test to enter user credentials
    test("Enter user credentials", async () => {
        await mainPage.goto();
        await mainPage.fillEmail(EMAIL);
        await mainPage.fillPassword(PASSWORDWITHSPACE);
        await mainPage.submit();

        // Verify entering main page
        const policyPage = await page.locator('[data-testid="policies-page"]');
        await expect(policyPage).toBeVisible();
    });

    // Test to logout
    test("Logout", async () => {
        await mainPage.goto();
        await mainPage.clickLogoutBtn();
        await mainPage.clickLogoutUrl();
        await expect(page).toHaveURL(new RegExp('^https://cropcycle-demo.us.auth0.com/login?'));
    });
});
