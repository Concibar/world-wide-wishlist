import Wish from '../models/wish.mjs';
import Wishlist from '../models/wishlist.mjs';
import View from '../views/popupView.mjs';
import Scraper from '../scraper.mjs';
import Currency from '../models/currency.mjs'

document.addEventListener('DOMContentLoaded', async function () {
  // Exit the Popup
  const escapeButton = document.getElementById('escape-button');
  escapeButton.addEventListener('click', () => {
    window.close();
  }, false);

  // Compress-Shrink the Extension when the cursor is outside the window and extend it again on mouseenter
  var mouseIn = true;
  document.addEventListener('mouseleave', () => {
    mouseIn = false;
    setTimeout(function () {
      if (mouseIn == false) {
        document.getElementById('content').setAttribute('style', 'display: none !important;');
        document.body.style.height = "100px"
      }
    }, 500);
  })
  document.addEventListener('mouseenter', () => {
    mouseIn = true;
    setTimeout(function () {
      document.body.style.height = "370px"
      document.getElementById('content').setAttribute('style', 'display: initial;');
    }, 0);
  })

  // Go-To-Wishlists
  const WishlistsButton = document.getElementById('go-to-wishlists-button');
  WishlistsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
  }, false);
  const successRedirect = document.getElementById('success-go-to-wishlists-button');
  successRedirect.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('html/mywishlist.html')}, function() {
        window.close();
      });
    });
  });

  // Settings
  const settingsButton = document.getElementById('settings-button');
  settingsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
  }, false);

  // Scrapes active tab for title, url and images
  const scraper = new Scraper;
  await scraper.scrape();
  const view = new View(scraper);
  await displayDefault();

  async function displayDefault() {
    let wishlists = await Wishlist.readAll();
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    let currenciesbyType = await Currency.getCurrenciesByType();
    view.displayScraped(wishlists, defaultWishlist, currenciesbyType);
  }

  // open create Wishlist Modal
  const wishlists = document.getElementById('wishlists');
  wishlists.addEventListener('change', async () => {
    if (wishlists.value === "WishlistNew") {
      view.openModal(document.getElementById('create-wishlist-modal'));
    }
  });

  // Save new Wishlist
  async function saveWishlist() {
    let formData = view.getCreateWishlistFormData();
    if (formData) {
      view.closeModal(document.getElementById('create-wishlist-modal'))
      let wishlist = new Wishlist(formData);
      wishlist = await wishlist.save();
      if (formData.newDefault) {
        await wishlist.setAsDefaultWishlist();
      }
      let wishlists = await Wishlist.readAll();
      let defaultWishlist = await Wishlist.getDefaultWishlist();
      view.displayWishlists(wishlists, wishlist.id, defaultWishlist);
    }
  }
  const newWishlistSaveButton = document.getElementById('create-wishlist-modal-save');
  newWishlistSaveButton.addEventListener('click', saveWishlist);
  const createWishlistForm = document.getElementById('create-wishlist-name');
  createWishlistForm.addEventListener('keydown', async (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      await saveWishlist()
    }
  });

  // Prev-Next Gallery
  const prev = document.getElementById('previous-image');
  prev.addEventListener('click', view.displayPrev, false);

  const next = document.getElementById('next-image');
  next.addEventListener('click', view.displayNext, false);

  // Save Wish
  async function saveWish() {
    let formData = await view.getFormData();
    if (formData) {
      let wish = new Wish(formData);
      await wish.save();
      view.closeAllModals();
      view.confirmSave();
    }
  };
  const saveButton = document.getElementById('save-wish');
  saveButton.addEventListener('click', saveWish);
  const wishForm = document.getElementById('wish-form');
  wishForm.addEventListener('keydown', async (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      await saveWish();
    }
  });

  // General closing Modal listeners
  document.addEventListener('keydown', async (event) => {
    if(event.key === "Escape") {
      view.closeAllModals()
      let defaultWishlist = await Wishlist.getDefaultWishlist();
      wishlists.value = defaultWishlist.id;
    }
  });
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('modal-close')
    || event.target.classList.contains('modal-background')
    || event.target.classList.contains('modal-cancel')
    || event.target.classList.contains('delete')) {
    const $modalToClose = event.target.closest('.modal');
    view.closeModal($modalToClose);
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    wishlists.value = defaultWishlist.id;
  }})

}, false);
