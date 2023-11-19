document.addEventListener('DOMContentLoaded', function() { // this waits for the popup.html to fully load

  // Opens the wishlist page link in a new Tab
  var checkPageButton = document.getElementById('wishlists-button');
  checkPageButton.addEventListener('click', function() {
    chrome.tabs.create({url: chrome.runtime.getURL('mywishlist.html')});
  }, false);

  wishConnectionCallback();

  // Scrapes active tab for title and image
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    // To-Do: check for tab validity here
    var tab = tabs[0];
    document.getElementById('wish-name').innerText = tab.title;
    document.getElementById('product-img').src = tab.querySelector('img').src;
  });

  // add Save Button
  var saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', function() {
    //To-Do: call the wish model to safe the wish
    chrome.storage.local.set({'test': document.getElementById('wish-name').innerText});
    console.log("I saved the thing");
  }, false);

  var readButton = document.getElementById('read-button');
  readButton.addEventListener('click', function() {
    var testResult = chrome.storage.local.get('test', function(result) {
      console.log(result.test);
    })
  }, false);

}, false);
