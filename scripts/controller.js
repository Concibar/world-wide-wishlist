document.addEventListener('DOMContentLoaded', async function() { // this waits for the popup.html to fully load

  // Check the js connections
  popupConnection();
  scraperConnection();
  wishConnection();
  wishlistConnection();
  imageHandlerConnection();

  // Scrapes active tab for title,url and images, tries price and currency
  let scraped = await scrape();
  console.log(scraped);
  display(scraped);
  handleImage(11);

  //Button Listeners

  // Prev-Next Gallery
  const prev = document.getElementById('previous-image');
  prev.addEventListener('click', displayPrev, false);
  const next = document.getElementById('next-image');
  next.addEventListener('click', displayNext, false);

  // Save Button Submit Form
  const saveButton = document.getElementById('save-wish');
  saveButton.addEventListener('click', function() {
    chrome.storage.local.set({'test': document.getElementById('wish-name').value});
    console.log("I saved the thing");
    console.log(document.getElementById('wish-name').value);
  });

  // Read Button (for testing only) Will become Exit later
  const readButton = document.getElementById('escape-button');
  readButton.addEventListener('click', () => {
    chrome.storage.local.get('test', function(result) {
      console.log(result.test);
    })
  }, false);

  // Go-To-Wishlists
  const WishlistsButton = document.getElementById('go-to-wishlists-button');
  WishlistsButton.addEventListener('click', () => {
    chrome.tabs.create({url: chrome.runtime.getURL('mywishlist.html')});
  }, false);

  // Settings
  const settingsButton = document.getElementById('settings-button');
  settingsButton.addEventListener('click', () => {
    chrome.tabs.create({url: chrome.runtime.getURL('settings.html')});
  }, false);

}, false);
