const puppeteer = require('puppeteer');

const extensionPath = "/home/jan/code/Concibar/world-wide-wishlist/";

const browser = puppeteer.launch({
  headless: false,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`
  ]
});
