import View from "../views/tutorialView.mjs";

document.addEventListener('DOMContentLoaded', async function () {
  const view = new View();

  // Open MyWishlists in current Tab
  function openWishlists() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('html/mywishlist.html')});
    });
  };
  const logo = document.getElementById('logo-and-title');
  logo.addEventListener('click', () => {
    openWishlists();
  }, false);
});
