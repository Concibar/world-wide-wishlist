import puppeteer from 'puppeteer';
import page from 'puppeteer';
import { assert } from 'chai';
import { seed } from '../development/dbSeed.mjs';

const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";
const extensionID = "albijmjlliljdkdfnhbkjlifhhgcpmme";
const myWishlistHtml = "html/mywishlist.html"

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
    `--start-maximized`
  ]
});
const myWishlist = await browser.newPage();
await myWishlist.goto(`chrome-extension://${extensionID}/${myWishlistHtml}`);
await seed();
