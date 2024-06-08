import puppeteer from 'puppeteer';
import page from 'puppeteer';
import { assert } from 'chai';

const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";
const extensionID = "albijmjlliljdkdfnhbkjlifhhgcpmme";
const myWishlistHtml = ""

async function loadBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });
  return browser;
};

const browser = await loadBrowser();
const myWishlist = await browser.newPage();
await myWishlist.goto(`chrome-extension://${extensionID}/${myWishlistHtml}`)
