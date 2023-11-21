document.addEventListener('DOMContentLoaded', async function() { // this waits for the popup.html to fully load

  // Check the js connections
  popupConnection();
  scraperConnection();
  wishConnection();
  wishlistConnection();

  // Scrapes active tab for title and image
  let scraped = await scrape();
  console.log(scraped)
  display(scraped)


  // Save Button
  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', () => {
    // To-Do: refactor to call the wish model to safe the wish
    chrome.storage.local.set({'test': document.getElementById('wish-name').innerText});
    console.log("I saved the thing");
  }, false);

  // Read Button
  const readButton = document.getElementById('read-button');
  readButton.addEventListener('click', () => {
    let testResult = chrome.storage.local.get('test', function(result) {
      console.log(result.test);
    })
  }, false);

  // Opens the wishlist page link in a new Tab
  const checkPageButton = document.getElementById('wishlists-button');
  checkPageButton.addEventListener('click', () => {
    chrome.tabs.create({url: chrome.runtime.getURL('mywishlist.html')});
  }, false);

}, false);
