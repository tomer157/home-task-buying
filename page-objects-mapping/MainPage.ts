import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import IUtils from "../utils/utils"



// Load environment variables from .env file
dotenv.config();

const reloadEnv = () => {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const key in envConfig) {
        process.env[key] = envConfig[key];
    }
}

// Reload .env variables
reloadEnv();

const URL: string = process.env.URL as string;
const EMAIL: string = process.env.USERNAME as string; // This should return the full email
const PASSWORD: string = process.env.PASSWORD as string;
const SPACE: string = String.fromCharCode(32); // ASCII code for space
const PASSWORDWITHSPACE: string = PASSWORD.concat(SPACE);

export class MainPage {
    private readonly emailBox: Locator;
    private readonly PasswordBox: Locator;
    private readonly submitBtn: Locator;
    private readonly forgotPassword: Locator;
    private readonly forgotEmailInput: Locator;
    private readonly forgotEmailSubmitBtn: Locator;
    static instance: MainPage | null  = null;


    // TODO: Add freeze for imjutability and destroy object when done in the after hook
    constructor(public readonly page: Page, private iUtils: IUtils) {
        // Singleton logic
        if (MainPage.instance) {
            return MainPage.instance;
        }

        MainPage.instance = this;
    

        this.emailBox = this.page.locator('[id="email"]');
        this.PasswordBox = this.page.locator('[id="password"]');
        this.submitBtn = this.page.locator('[id="btn-login"]');
        this.forgotPassword = this.page.locator('[id="forgotswitcher"]');
        this.forgotEmailInput = this.page.locator('[id="forgotemail"]'); 
        this.forgotEmailSubmitBtn = this.page.locator('[id="btn-forgot"]');
    }

    async goto() {
        await this.page.goto(URL);

    }

    async compareToSnapeshot() {
        expect(await this.page.screenshot()).toMatchSnapshot('../screenshots/screenshot.png');
    }

    async validateEmailFieldVisible() {
        await expect(this.emailBox).toBeVisible();
    }

    async validateEmailAttribute() {
        await expect(this.emailBox).toHaveAttribute('placeholder', "Enter your email");
    }    

    

    async validatePasswordFieldVisible() {
        await expect(this.PasswordBox).toBeVisible();
    }

    async validatePasswordPlaceholder(expectedPlaceholder: string) {
        await expect(this.PasswordBox).toHaveAttribute('placeholder', expectedPlaceholder);
    }

    async validateSubmitButtonVisible() {
        await expect(this.submitBtn).toBeVisible();
    }

    async fillEmail(email: string) {
        await this.emailBox.fill(email);
    }

    async fillForgotEmail(text: string){
        await this.forgotEmailInput.fill(text)
    }

    async fillPassword(password: string) {
        await this.PasswordBox.fill(password);
    }

    async clickForgotPassword(){
        await this.forgotPassword.click()
    }

    async clickForgotEmailSubmitBtn(){
        await this.forgotEmailSubmitBtn.click();
    }

    async submit() {
        await this.submitBtn.click();
    }

    async validateLoginError(errorMessage: string) {
        const errorLocator = this.page.locator('.error-message'); // Update the selector as needed
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toHaveText(errorMessage);
    }

    async clearCookies(browser, URL){
        await this.iUtils.clearCookies(browser, URL)
    }

    async updateEnv(){
        await this.iUtils.updateEnv();
    }

    destroyinstance () {
        MainPage.instance = null;
    }
}