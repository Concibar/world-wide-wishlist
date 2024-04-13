import Wish from '../models/wish.js'
import Wishlist from '../models/wishlist.js'
import View from '../views/popupView.js'
import checkDBschema from '../databaseHandling/dbManager.js'
import Scraper from '../scraper.js'

document.addEventListener('DOMContentLoaded', async function () { // this waits for the popup.html to fully load
  // Check if Database needs to be set or updated
  await checkDBschema();

  // Exit function
  const escapeButton = document.getElementById('escape-button');
  escapeButton.addEventListener('click', () => {
    window.close();
  }, false);

  // Go-To-Wishlists
  const WishlistsButton = document.getElementById('go-to-wishlists-button');
  WishlistsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
  }, false);
  // TODO: I'd like to make a way to open a specific wishlist on call, instead of the default
  const successRedirect = document.getElementById('success-go-to-wishlists-button');
  successRedirect.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/mywishlist.html') });
  });

  // Settings
  const settingsButton = document.getElementById('settings-button');
  settingsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
  }, false);

  // Scrapes active tab for title,url and images
  const scraper = new Scraper;
  await scraper.scrape();
  const view = new View(scraper);
  await displayDefault();

  async function displayDefault() {
    let wishlists = await Wishlist.readAll();
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    view.displayScraped(wishlists, defaultWishlist);
  }

  // make new Wishlist
  const wishlists = document.getElementById('wishlists');
  wishlists.addEventListener('change', async () => {
    if (wishlists.value === "WishlistNew") {
      view.openModal(document.getElementById('create-wishlist-modal'));
    }
  });
  const newWishlistSave = document.getElementById('create-wishlist-modal-save');
  newWishlistSave.addEventListener('click', async () => {
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
  });

  // Prev-Next Gallery
  const prev = document.getElementById('previous-image');
  prev.addEventListener('click', view.displayPrev, false);

  const next = document.getElementById('next-image');
  next.addEventListener('click', view.displayNext, false);

  // Save Button Submit Form
  const saveButton = document.getElementById('save-wish');
  saveButton.addEventListener('click', async () => {
    let formData = await view.getFormData();
    if (formData) {
      let wish = new Wish(formData);
      await wish.save();
      view.closeAllModals();
      view.confirmSave();
    }
  }, false);

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
