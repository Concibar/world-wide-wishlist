// import puppeteer from 'puppeteer';
// import page from 'puppeteer';
// import { assert } from 'chai';
// import { setTimeout } from "timers/promises";
// import Wish from '../../scripts/models/wish.mjs';
// import Wishlist from '../../scripts/models/wishlist.mjs';

// const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";
// const extensionID = "albijmjlliljdkdfnhbkjlifhhgcpmme";
// const myWishlistHtml = `chrome-extension://${extensionID}/html/mywishlist.html`;

// // launch the testing browser
// const browser = await puppeteer.launch({
//   headless: false, // headless: new; because it defaults to old headless which isn't working for our chrome extension context
//   defaultViewport: null,
//   args: [
//     `--disable-extensions-except=${extensionPath}`,
//     `--load-extension=${extensionPath}`,
//     `--start-maximized`
//   ]
// });
// await setTimeout(2000); // necessary regretibly

// // go to the myWishlist.html page
// const myWishlist = await browser.newPage();
// await myWishlist.goto(myWishlistHtml);

// // access the background worker for everything chrome.api
// const workerTarget = await browser.waitForTarget(
//   target => target.type() === 'service_worker'
// );
// const worker = await workerTarget.worker();
// const wishlists = await worker.evaluate(async () => {
//   let wishlistsResult = await chrome.storage.local.get('wishlists');
//   return wishlistsResult;
// });
// console.log(wishlists);

// await worker.evalutate(async () => {

// })
