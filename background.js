import { checkDBschema } from './scripts/databaseHandling/dbManager.js';

chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason == "install"){
    checkDBschema();
    chrome.tabs.create({ url: chrome.runtime.getURL('html/tutorial.html') });
  }else if(details.reason == "update"){
    checkDBschema();
  }
});

chrome.contextMenus.create({
  title: "Open Wishlists",
  contexts: ["action"],
  id: "Wishlists"
});

chrome.contextMenus.create({
  title: "Provide Feedback",
  contexts: ["action"],
  id: "GitHubIssues"
});

chrome.contextMenus.create({
  title: "Settings",
  contexts: ["action"],
  id: "Settings"
});

chrome.contextMenus.create({
  title: "Import/Export Wishlists",
  contexts: ["action"],
  id: "Export"
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "Wishlists") {
    // Open the Wishlists page
    chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
 } else if (info.menuItemId === "GitHubIssues") {
    // Open the GitHub Issues page
    chrome.tabs.create({ url: 'https://github.com/Concibar/world-wide-wishlist/issues' });
 } else if (info.menuItemId === "Settings" || info.menuItemId === "Export") {
  // Open the Settings
  chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
}
});
