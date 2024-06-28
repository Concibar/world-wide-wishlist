import puppeteer from 'puppeteer';
import { setTimeout } from "timers/promises";

const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";
const extensionID = "albijmjlliljdkdfnhbkjlifhhgcpmme";
const popupPath = `chrome-extension://${extensionID}/html/popup.html`;
const myWishlistHtml = `chrome-extension://${extensionID}/html/mywishlist.html`;
const testHtml = "https://www.amazon.de/Soundcore-Lautsprecher-Stereo-Sound-Titan-Membran-individueller/dp/B09945ST5F/?_encoding=UTF8&ref_=pd_hp_d_atf_dealz_cs_t1";

async function openBrowser() {
  const browser = await puppeteer.launch({
    headless: false, // headless: new; because it defaults to old headless which isn't working for chrome extension
    defaultViewport: null,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      `--start-maximized`
    ]
  });
  await setTimeout(2000);
  console.log("headless browser started");
  return browser;
}

async function openPopup(browser) {
  const workerTarget = await browser.waitForTarget(
    target => target.type() === 'service_worker'
  );
  const worker = await workerTarget.worker();

  await worker.evaluate("chrome.action.openPopup();");

  const popupTarget = await browser.waitForTarget( (target) => {
    return target.type() === "page" && target.url() === popupPath;
  });
  const popup = await popupTarget.asPage();
  return popup;
}

export {
  openPopup,
  openBrowser,
  extensionPath,
  extensionID,
  popupPath,
  myWishlistHtml,
  testHtml
}
