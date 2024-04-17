import Wish from '../models/wish.js'
import Wishlist from '../models/wishlist.js'
import { manifestVersion } from '../databaseHandling/dbManager.js'

export async function exportDatabase() {
  const jsonString = await generateJsonData();
  downloadJsonFile(jsonString, 'world-wide-wishlist-export.json');
}

async function generateJsonData() {

  let resultVersion = await chrome.storage.local.get(['versionNumber']);
  const versionNumber = resultVersion.versionNumber;

  let resultWishlists = await chrome.storage.local.get(['wishlists']);
  const wishlists = resultWishlists.wishlists;

  let resultWishes = await chrome.storage.local.get(['wishes']);
  const wishes = resultWishes.wishes;

  const data = {
    'versionNumber': versionNumber,
    'wishlists': wishlists,
    'wishes': wishes
  };

  // Convert the data to a JSON string
  const jsonString = JSON.stringify(data, null, 2); // Pretty-printed JSON
  return jsonString;
}

function downloadJsonFile(jsonString, filename) {
  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Use the chrome.downloads API to download the file
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true // Prompts the user to save the file
  }, function (downloadId) {
    console.log('Download started with ID: ' + downloadId);
    // Release the URL object to free up memory
    URL.revokeObjectURL(url);
  });
}

export async function importDatabase(file) {

  let resultVersion = await chrome.storage.local.get(['versionNumber']);
  const versionNumber = resultVersion.versionNumber;

  let resultWishlists = await chrome.storage.local.get(['wishlists']);
  const wishlists = resultWishlists.wishlists;

  let resultWishes = await chrome.storage.local.get(['wishes']);
  const wishes = resultWishes.wishes;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);

    if (manifestVersion != data.versionNumber) {
      console.log("DEBUG: the versions are different, panic!!!");
    } else if (manifestVersion == data.versionNumber) {

      data.wishlists.forEach(function(wishlistToBeImported) {
        if (wishlists.find(wishlist => wishlist.id == wishlistToBeImported.id)) {
          console.log("DEBUG: skipping wishlist import of " + wishlistToBeImported);
        } else {
          let wishlist = new Wishlist(wishlistToBeImported);
          wishlist.save();
        }
      })

      data.wishes.forEach(function(wishToBeImported) {
        if (wishes.find(wish => wish.id == wishToBeImported.id)) {
          console.log("DEBUG: skipping wish import of " + wishToBeImported);
        } else {
          let wish = new Wish(wishToBeImported);
          wish.save();
        }
      })

    }
  };
  reader.onerror = function(e) {
    console.error('Error reading file:', e);
  };
  reader.readAsText(file);
}
