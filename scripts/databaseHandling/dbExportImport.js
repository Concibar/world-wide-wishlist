import Wish from '../models/wish.js'
import Wishlist from '../models/wishlist.js'
import { manifestVersion } from '../databaseHandling/dbManager.js'

export async function exportDatabase() {
  const jsonString = await generateJsonData();
  const currentDate = new Date().toISOString().slice(0, 10);
  const filename = `world-wide-wishlist-export-${currentDate}.json`;
  downloadJsonFile(jsonString, filename);
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
  const fileContent = await readFile(file);
  const data = JSON.parse(fileContent);
  if (manifestVersion != data.versionNumber) {
    console.log("The versions are different, migration needs to happen here");
  }
  const filteredData = await filterDuplicates(data);
  // saving the new Wishlists
  const newWishlists = filteredData.wishlists;
  for (let i = 0; i < newWishlists.length; i++) {
    let wishlist = new Wishlist(newWishlists[i])
    await wishlist.save();
  }
  // saving the new Wishes
  const newWishes = filteredData.wishes;
  for (let i = 0; i < newWishes.length; i++) {
    let wish = new Wish(newWishes[i])
    await wish.save();
  }
}

async function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => console.error('Error reading file:', e);
    reader.readAsText(file);
  });
}

async function filterDuplicates(data) {
  // filtering the Wishlists for duplicates
  let resultWishlists = await chrome.storage.local.get(['wishlists']);
  const wishlists = resultWishlists.wishlists;
  let unfilteredWishlists = data.wishlists;
  let filteredWishlists = [];
  for (let i = 0; i < unfilteredWishlists.length; i++) {
    let wishlist = unfilteredWishlists[i];
    if (wishlists.find(existingWishlist => existingWishlist.id == wishlist.id)) {
      console.log("Skipping wishlist duplicate of ", wishlist);
    } else {
      filteredWishlists.push(wishlist);
    }
  }

  // filtering the Wishes for duplicates
  let resultWishes = await chrome.storage.local.get(['wishes']);
  const wishes = resultWishes.wishes;
  let unfilteredWishes = data.wishes;
  let filteredWishes = [];
  for (let i = 0; i < unfilteredWishes.length; i++) {
    let wish = unfilteredWishes[i];
    if (wishes.find(existingWish => existingWish.id == wish.id)) {
      console.log("Skipping wish duplicate of ", wish);
    } else {
      filteredWishes.push(wish);
    }
  }

  let filteredData = {
    wishlists: filteredWishlists,
    wishes: filteredWishes
  }

  return filteredData;
}
