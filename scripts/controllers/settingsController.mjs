import View from "../views/settingsView.mjs";
import {exportDatabase, importDatabase} from '../databaseHandling/dbExportImport.mjs';

document.addEventListener('DOMContentLoaded', async function () {
  const view = new View();
  var file;

  // Donate to the Developer Button
  const donateButton = document.getElementById('donate');
  donateButton.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });

  // Open MyWishlists in current Tab
  function openWishlists() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('html/mywishlist.html')});
    });
  };
  const wishlistsButton = document.getElementById('go-to-wishlists-button');
  const settingsLogo = document.getElementById('logo-and-title');
  wishlistsButton.addEventListener('click', () => {
    openWishlists();
  }, false);
  settingsLogo.addEventListener('click', () => {
    openWishlists();
  }, false);

  // Export and download the database
  const exportButton = document.getElementById('export-button');
  exportButton.addEventListener("click", async () => {
    await exportDatabase();
  });

  // User uploads file
  const databaseInput = document.getElementById('database-input');
  databaseInput.addEventListener('change', (event) => {
    file = event.target.files[0];
    if (file && file.name.endsWith('.json')) {
      view.unlockImportButton(file.name);
    } else {
      view.lockImportButton();
      file = "";
    }
  });

  // Import Database
  const importButton = document.getElementById('import-button');
  importButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (file && file.name.endsWith('.json')) {
      view.lockImportButton();
      view.importProgress();
      await importDatabase(file);
      file = "";
      view.importSuccess();
    }
  });

  // Open GitHub Issues in new Tab
  const FeedbackButton = document.getElementById('feedback-button');
  FeedbackButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/Concibar/world-wide-wishlist/issues' });
  }, false);
});
