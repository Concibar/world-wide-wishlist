import View from "../views/settingsView.js";
import {exportDatabase, importDatabase} from '../databaseHandling/dbExportImport.js'
import checkDBschema from '../databaseHandling/dbManager.js'

document.addEventListener('DOMContentLoaded', async function () { // this waits for the popup.html to fully load
  // Check if Database needs to be set or updated
  await checkDBschema();

  const view = new View();
  var file;

  // Donate to the Developer Button
  const donateButton = document.getElementById('donate');
  donateButton.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });

  // Open MyWishlists in new Tab
  const WishlistsButton = document.getElementById('go-to-wishlists-button');
  WishlistsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
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
    }
  });

  const importButton = document.getElementById('import-button');
  importButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (file && file.name.endsWith('.json')) {
      await importDatabase(file);
    }
  });
});
