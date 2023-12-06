document.addEventListener('DOMContentLoaded', async function () { // this waits for the popup.html to fully load

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
  saveButton.addEventListener('click', () => {
    saveTesting(200);

    // let asdf = getFormData();
    // let wish = new Wish(asdf);
    // console.log(wish);
    // wish.save();

    // chrome.storage.local.set({'test': document.getElementById('wish-name').value});
    // console.log("I saved the thing");
    // console.log(document.getElementById('wish-name').value);
  }, false);

  // Read Button (for testing only) Will become Exit later
  const readButton = document.getElementById('escape-button');
  readButton.addEventListener('click', () => {
    console.log("reading wishes from storage:")
    chrome.storage.local.get('wishes', (result) => {
      console.log(result.wishes);
    });

    // chrome.storage.local.get('0', function (result) {
    //   console.log(result);
    // })
  }, false);

  // Go-To-Wishlists
  const WishlistsButton = document.getElementById('go-to-wishlists-button');
  WishlistsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('mywishlist.html') });
  }, false);

  // Settings
  const settingsButton = document.getElementById('settings-button');
  settingsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  }, false);

}, false);
