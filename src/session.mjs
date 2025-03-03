import { writeSync, existsSync, readSync, openSync, readFileSync } from "fs";
import { Page } from "puppeteer";
import { StorageProviderName } from "puppeteer-extra-plugin-session";

export class Session {
  /**
   * @param {string} path
   */
  constructor(path) {
    this.path = path;
    this.data = {};
  }

  /**
   * @param {Page} page
   */
  async dumpSession(page) {
    this.data = await page.session.dump();
  }

  /**
   * @param {Page} page
   * @param {Array<StorageProviderName>} providers
   */
  async restoreSession(page, providers) {
    return page.session.restore(this.data, { storageProviders: providers });
  }

  /**
   * @param {Page} page
   */
  async restoreCookie(page) {
    return this.restoreSession(page, [StorageProviderName.Cookie]);
  }

  /**
   * @param {Page} page
   */
  async restoreStorage(page) {
    return this.restoreSession(page, [
      StorageProviderName.LocalStorage,
      StorageProviderName.SessionStorage,
      StorageProviderName.IndexedDB,
    ]);
  }

  saveSession() {
    const fd = openSync(this.path, "w+");
    writeSync(fd, JSON.stringify(this.data));
  }

  loadSession() {
    if (!existsSync(this.path)) {
      return;
    }

    const sessionString = readFileSync(this.path);
    this.data = JSON.parse(sessionString);
  }
}
