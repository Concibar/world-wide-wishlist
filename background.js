import { checkDBschema } from './scripts/databaseHandling/dbManager.js';
console.log("hello world");

chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason == "install"){
    checkDBschema();
    chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
  }else if(details.reason == "update"){
    checkDBschema();
  }
});

chrome.contextMenus.create({
  title: "Open Wishlists",
  contexts: ["action"],
  id: "asfasdfasdf"
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
});
