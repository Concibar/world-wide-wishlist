// import puppeteer from 'puppeteer';
// import page from 'puppeteer';
// import { assert } from 'chai';
// import { setTimeout } from "timers/promises";
// import Wish from '../../scripts/models/wish.mjs';
// import Wishlist from '../../scripts/models/wishlist.mjs';

// const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";
// const extensionID = "albijmjlliljdkdfnhbkjlifhhgcpmme";
// const myWishlistHtml = "html/mywishlist.html"

// const browser = await puppeteer.launch({
//   headless: false, // headless: new
//   defaultViewport: null,
//   args: [
//     `--disable-extensions-except=${extensionPath}`,
//     `--load-extension=${extensionPath}`,
//     `--start-maximized`
//   ]
// });
// await setTimeout(2000);

// const myWishlist = await browser.newPage();
// await myWishlist.goto(`chrome-extension://${extensionID}/${myWishlistHtml}`);

// const workerTarget = await browser.waitForTarget(
//   target => target.type() === 'service_worker'
// );
// const worker = await workerTarget.worker();
// const value = await worker.evaluate(async () => {
//   let thingy = await chrome.storage.local.get('wishlists');
//   return thingy;
// });
// console.log(value);
