import View from "../views/settingsView.mjs";
import {exportDatabase, importDatabase} from '../databaseHandling/dbExportImport.mjs';
import Currency from "../models/currency.mjs";

document.addEventListener('DOMContentLoaded', async function () {
  const view = new View();
  await view.loadCurrencies();
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

  // clicks outside dropdown close all dropdowns
  document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
      const allDropdowns = document.querySelectorAll('.dropdown');
      allDropdowns.forEach((node) => {node.classList.remove('is-active')});
    }
  })

  // favored currencies add, remove
  const favoredCurrencyDropdown = document.getElementById('favored-currency-dropdown');
  favoredCurrencyDropdown.addEventListener('click', (event) => {
    if (event.target.classList.contains('is-delete')) {
      Currency.getCurrency(event.target.dataset.currencyCode).then((currency) => {
        currency.update({favored: false}).then(() => {
          view.loadCurrencies();
        })
      })
    } else if (event.target.classList.contains('dropdown-item')) {
      Currency.getCurrency(event.target.dataset.currencyCode).then((currency) => {
        currency.update({favored: true}).then(() => {
          view.loadCurrencies();
        })
      })
    }
    conversionCurrencyDropdown.classList.remove('is-active');
    defaultCurrencyDropdown.classList.remove('is-active');
  });
  // favored currencies dropdown trigger
  const favoredCurrenciesDropdownTrigger = document.getElementById('favored-currencies-dropdown-trigger')
  favoredCurrenciesDropdownTrigger.addEventListener('click', (event) => {
    favoredCurrencyDropdown.classList.toggle('is-active');
  })

  // update default currency + dropdown trigger
  const defaultCurrencyDropdown = document.getElementById('default-currency-dropdown');
  defaultCurrencyDropdown.addEventListener('click', (event) => {
    if (event.target.classList.contains('dropdown-item')) {
      Currency.getCurrency(event.target.dataset.currencyCode).then((currency) => {
        currency.setAsDefaultCurrency().then(() => {
          view.loadCurrencies();
        })
      })
    }
    defaultCurrencyDropdown.classList.toggle('is-active');
    conversionCurrencyDropdown.classList.remove('is-active');
    favoredCurrencyDropdown.classList.remove('is-active');
  });

  // update conversion currency + dropdown
  const conversionCurrencyDropdown = document.getElementById('conversion-currency-dropdown');
  conversionCurrencyDropdown.addEventListener('click', (event) => {
    if (event.target.classList.contains('dropdown-item')) {
      Currency.getCurrency(event.target.dataset.currencyCode).then((currency) => {
        currency.setAsConversionCurrency().then(() => {
          view.loadCurrencies();
        })
      })
    }
    conversionCurrencyDropdown.classList.toggle('is-active');
    defaultCurrencyDropdown.classList.remove('is-active');
    favoredCurrencyDropdown.classList.remove('is-active');
  });

  // Open GitHub Issues (Feedback Page) in new Tab
  const FeedbackButton = document.getElementById('feedback-button');
  FeedbackButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/Concibar/world-wide-wishlist/issues' });
  }, false);
});
