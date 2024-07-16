import View from "../views/updateView.mjs";
import Wishlist from "../models/wishlist.mjs";

document.addEventListener('DOMContentLoaded', async function () {
  const view = new View();

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
  const logo = document.getElementById('logo-and-title');
  wishlistsButton.addEventListener('click', () => {
    openWishlists();
  }, false);
  logo.addEventListener('click', () => {
    openWishlists();
  }, false);
});
