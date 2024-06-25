import puppeteer from 'puppeteer';
import { assert } from 'chai';
import { setTimeout } from "timers/promises";
import Wish from '../../scripts/models/wish.mjs';
import Wishlist from '../../scripts/models/wishlist.mjs';

const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";
const extensionID = "albijmjlliljdkdfnhbkjlifhhgcpmme";
const popupPath = `chrome-extension://${extensionID}/html/popup.html`;
const myWishlistHtml = `chrome-extension://${extensionID}/html/mywishlist.html`;
const amazonHtml = "https://www.amazon.de/Soundcore-Lautsprecher-Stereo-Sound-Titan-Membran-individueller/dp/B09945ST5F/?_encoding=UTF8&ref_=pd_hp_d_atf_dealz_cs_t1";

// launch the testing browser
const browser = await puppeteer.launch({
  headless: false, // headless: new; because it defaults to old headless which isn't working for our chrome extension context
  defaultViewport: null,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
    `--start-maximized`
  ]
});
await setTimeout(2000);

// go to the amazon page
const amazonTestPage = await browser.newPage();
await amazonTestPage.goto(amazonHtml);

// access the background worker for everything chrome.api
const workerTarget = await browser.waitForTarget(
  target => target.type() === 'service_worker'
);
const worker = await workerTarget.worker();
await worker.evaluate("chrome.action.openPopup();");

const popupTarget = await browser.waitForTarget( (target) => {
  return target.type() === "page" && target.url() === popupPath;
});
const popup = await popupTarget.asPage();
const saveButton = await popup.waitForSelector("#save-wish");
await saveButton.click();

const successButton = await popup.waitForSelector("#success-go-to-wishlists-button", {visible: true});
await successButton.click();

await browser.close();
