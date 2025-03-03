import { Page } from "puppeteer";
import { parsePrompt, sleep } from "./util.mjs";
import { Session } from "./session.mjs";
import { input, password } from "@inquirer/prompts";
import { TimeoutError } from "puppeteer";
import Showdown from "showdown";

export class Gpt {
  /**
   * @param {Page} page
   * @param {Session} session
   */
  constructor(page, session) {
    this.page = page;
    this.session = session;
  }

  async open() {
    await this.page.setBypassCSP(true);
    await this.session.restoreCookie(this.page);
    await this.page.goto("https://chatgpt.com");
    await this.page.addScriptTag({
      path: "./assets/js/showdown.min.js",
    });
    await this.page.waitForFunction(() => window.showdown !== undefined);
    await this.session.restoreStorage(this.page);
  }

  async isLogin() {
    const loginButton = await this.page.$("button[data-testid='login-button']");
    return loginButton === null || !(await loginButton?.isVisible());
  }

  async login() {
    const waitOpts = { timeout: process.env.DRIVER_TIMEOUT * 1000 };

    const loginButton = await this.page.$("button[data-testid='login-button']");
    await loginButton.click();

    const [_, emailInput, continueBtn] = await Promise.all([
      this.page.waitForNavigation(waitOpts),
      this.page.waitForSelector("input#email-input", waitOpts),
      this.page.waitForSelector(
        "input[type='submit'][name='continue']",
        waitOpts,
      ),
    ]);

    let email = process.env.USER_MAIL;
    if (!email) {
      email = await input({ message: "Enter your email" });
    }

    await emailInput.focus();
    await this.page.keyboard.type(email);

    await continueBtn.click();

    const [__, passwordInput, submitBtn] = await Promise.all([
      this.page.waitForNavigation(waitOpts),
      this.page.waitForSelector("input#password", waitOpts),
      this.page.waitForSelector(
        "button[type='submit'][name='action']",
        waitOpts,
      ),
    ]);

    let pass = process.env.USER_PASS;
    if (!pass) {
      pass = await password({ message: "Enter your password" });
    }

    await passwordInput.focus();
    await this.page.keyboard.type(pass);

    // Wait for 500ms to avoid missing click
    await sleep(500);
    await submitBtn.click();

    await this.page.waitForNavigation(waitOpts);
    try {
      const codeInput = await this.page.waitForSelector(
        "input[type='number'][autocomplete='one-time-code']",
        waitOpts,
      );
      const codeSubmitBtn = await this.page.waitForSelector(
        "button[type='submit']",
        waitOpts,
      );

      const code = await input({
        message: "Enter the code sent to your email",
      });

      await codeInput.focus();
      await this.page.keyboard.type(code);
      await codeSubmitBtn.click();
    } catch (err) {
      if (err.name !== new TimeoutError().name) {
        console.error(err);
      }
    }

    await this.page.waitForSelector(
      "button[data-testid='profile-button']",
      waitOpts,
    );
  }

  /**
   * @param {string} message
   */
  async typeMessage(message) {
    await this.page.waitForSelector("#prompt-textarea");

    this.page.$eval(
      "#prompt-textarea",
      function updateMessage(e, rawHtml) {
        e.innerHTML = rawHtml;
      },
      parsePrompt(message),
    );
  }

  /**
   * @param {string} path
   */
  async uploadFile(path) {
    await this.page.waitForSelector(
      "button[aria-label='Upload files and more']",
    );
    const fileInput = await this.page.waitForSelector("input[type='file']");
    await fileInput.uploadFile(path);
  }

  async sendMessage() {
    const sendButton = await this.page.waitForSelector(
      "button[data-testid='send-button']:not([disabled])",
    );
    await sendButton.click();
    await this.page.waitForRequest(function waitRequest(request) {
      return request.url().includes("conversation");
    });
  }

  async getResponse() {
    let body = "";
    await this.page.waitForResponse(
      async (response) => {
        if (response.url().includes("conversation")) {
          body = await response.text();
          return body.includes("[DONE]");
        }
        return false;
      },
      {
        timeout: 0,
      },
    );
    this.response = body;
  }

  parseResponse() {
    const responseLines = this.response.split("\n");
  }
}
