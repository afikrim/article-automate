import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { SessionPlugin } from "puppeteer-extra-plugin-session";
import { Gpt } from "./gpt.mjs";
import { Session } from "./session.mjs";
import path from "path";
import { FIRST_PROMPT } from "./const.mjs";
import { sleep } from "./util.mjs";

puppeteer.use(stealthPlugin()).use(new SessionPlugin());

let browser = await puppeteer.launch({
  headless: process.env.HEADLESS == "true",
});
let page = await browser.newPage();

await page.setViewport({ width: 1920, height: 1080 });

let gptSession = new Session(
  path.join(process.cwd(), process.env.SESSION_DIR_PATH, "gpt.json"),
);
gptSession.loadSession();

let gpt = new Gpt(page, gptSession);

await gpt.open();
if (!(await gpt.isLogin())) {
  await gpt.login();
  gptSession.dumpSession(page);
  gptSession.saveSession();
}

// await gpt.uploadFile(
//   "/Users/mekari/Library/Mobile Documents/com~apple~CloudDocs/vaults/2nd-brain/4. Sharing/4.3. Programming/Backend - Go - For Loops.md",
// );
// await gpt.typeMessage(FIRST_PROMPT);
await gpt.typeMessage("what is indonesia?");
await gpt.sendMessage();

await gpt.waitResponse();
const response = await gpt.getResponse();
console.log(response);

// sleep 10 seconds
await new Promise((resolve) => setTimeout(resolve, 10000));

await browser.close();
