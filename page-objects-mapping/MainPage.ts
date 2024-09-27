import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import IUtils from "../utils/utils"



// Load environment variables from .env file
dotenv.config();


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
    private readonly logoutBtn: Locator;
    private readonly logoutUrl: Locator;
    static instance: MainPage | null  = null;


   
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
        this.logoutBtn = this.page.locator('[data-id="button-user-menu"]');
        this.logoutUrl = this.page.locator('[href="/api/auth/logout"]');
    }

    async goto() {
        await this.page.goto(URL);
    }

    updateEnvFiles(){
        this.iUtils.updateEnv()
    }

    async clickLogoutBtn() {
        await this.logoutBtn.click();
    }

    async clickLogoutUrl () {
        await this.logoutUrl.click();
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
        const errorLocator = this.page.locator('.error-message');
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