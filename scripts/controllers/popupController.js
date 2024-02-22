document.addEventListener('DOMContentLoaded', async function () { // this waits for the popup.html to fully load

  // Check the js connections
  popupViewConnection();
  scraperConnection();
  wishConnection();
  wishlistConnection();
  storageTestingConnection();
  dbSetupConnection();

  // Check if Database needs to be set or updated
  // TODO: make DB-setup update functionality
  setupDatabase();

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

  // Settings
  const settingsButton = document.getElementById('settings-button');
  settingsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
  }, false);

  // Scrapes active tab for title,url and images
  const scraper = new Scraper;
  await scraper.scrape();
  const wishlists = await Wishlist.readAll();
  const view = new PopupView(scraper);
  view.displayScraped(wishlists);

  // Prev-Next Gallery
  const prev = document.getElementById('previous-image');
  prev.addEventListener('click', view.displayPrev, false);

  const next = document.getElementById('next-image');
  next.addEventListener('click', view.displayNext, false);

  // Save Button Submit Form
  const saveButton = document.getElementById('save-wish');
  saveButton.addEventListener('click', async () => {
    let formData = await view.getFormData();
    let wish = new Wish(formData);
    console.log(wish); // debug
    wish.save();
  }, false);

}, false);
