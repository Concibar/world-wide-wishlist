function dbManagerConnection() {
  console.log("dbManager.js is connected");
}

const manifest = chrome.runtime.getManifest();
const manifestVersionNumber = manifest.version;

class dbManager {

}

// verify DB via settings if false check every part and set accordingly
// TODO: make sure the default first time starter setup of the DB serves as a tutorial
// TODO: the update functionality should export the DB before updating
async function setupDatabase() {
  let versionResult = await chrome.storage.local.get('versionNumber');
  if (versionResult.versionNumber == undefined) {
    console.log("VersionNumber not found; setup of local storage started");
    await chrome.storage.local.set({'versionNumber': versionNumber});
    console.log("versionNumber set to " + versionNumber);

    // check and set defaultWishlistId to default
    let defWishlistResult = chrome.storage.local.get('defaultWishlistId');
    if (defWishlistResult.defaultWishlistId == undefined) {
      await chrome.storage.local.set({'defaultWishlistId': 0});
      console.log("defaultWishlistId set to default");
    }

    // check and set idTracker to default
    let idTrackerResult = await chrome.storage.local.get('idTracker');
    if (idTrackerResult.idTracker == undefined) {
      await chrome.storage.local.set({'idTracker': 0});
      console.log("idTracker set to default");
    }

    // check and set wishlists to default
    let wishlistsResult = await chrome.storage.local.get('wishlists');
    if (wishlistsResult.wishlists == undefined) {
      await chrome.storage.local.set({'wishlists': []});
      console.log("wishlists set to default");
    }

    // check and set wishes to default
    let wishesResult = await chrome.storage.local.get('wishes');
    if (wishesResult.wishes == undefined) {
      await chrome.storage.local.set({'wishes': []});
      console.log("wishes set to default");
    }
  }
}

async function updateDatabase() {

}

async function exportDatabase() {
  // TODO:
  // 1) read wishlists and wishes
  // 2) parse both into text-data
}

async function importDatabase() {
  // TODO:
  // 1) parse giant text input as json
  // 2) for-each through wishlists; check ID doubling and save non-doubles
  // 3) for-each through wishes; check ID doubling and save non-doubles
}
