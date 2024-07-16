import Wish from '../models/wish.mjs'
import Wishlist from '../models/wishlist.mjs'

export async function exportDatabase() {
  const jsonString = await generateJsonData();
  const filename = generateFilename();
  downloadJsonFile(jsonString, filename)
};

async function generateJsonData() {
  const data = await chrome.storage.local.get();
  const jsonString = JSON.stringify(data, null, 2);
  return jsonString;
};

function generateFilename() {
  const currentDate = new Date().toISOString().slice(0, 10);
  const filename = `world-wide-wishlist-export-${currentDate}.json`;
  return filename;
};

function downloadJsonFile(jsonString, filename) {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true // Prompts the user to save the file
  }, function (downloadId) {
    console.log('Download started with ID: ' + downloadId)
    URL.revokeObjectURL(url) // Releases the URL object to free up memory
  });
};

export async function importDatabase(file) {
  const fileContent = await readFile(file);
  const data = JSON.parse(fileContent);
  const newWishes = await filterDuplicates(data.wishes, 'wishes')
  const newWishlists = await filterDuplicates(data.wishlists, 'wishlists')
  switch (true) { // migration in case of importing old Exports
    case (data.versionNumber < "1.1.0"):
      console.log("migrating to 1.1.0 before import");
      for (let i = 0; i < newWishes.length; i++) {
        newWishes[i].note = newWishes[i].note + " old Price: " + newWishes[i].price;
        newWishes[i].price = 0;
        newWishes[i].currencyId = "EUR";
      };
    default:
      console.log("no migration necessary, continuing");
      break;
  }
  for (let i = 0; i < newWishes.length; i++) {
    let wish = new Wish(newWishes[i]);
    await wish.save();
  };
  for (let i = 0; i < newWishlists.length; i++) {
    let wishlist = new Wishlist(newWishlists[i]);
    await wishlist.save();
  };
};

async function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => console.error('Error reading file:', e);
    reader.readAsText(file);
  });
};

async function filterDuplicates(remoteData, key) {
  console.log(key);
  let result = await chrome.storage.local.get([key]);
  const localData = result[key];
  console.log(localData);
  let filteredImportData = [];
  for (let i = 0; i < remoteData.length; i++) {
    let remoteObject = remoteData[i];
    if (localData.find(localObject => localObject.id == remoteObject.id)) {
      console.log("Skipping duplicate of ", remoteObject);
    } else {
      filteredImportData.push(remoteObject);
    }
  }
  return filteredImportData
};
