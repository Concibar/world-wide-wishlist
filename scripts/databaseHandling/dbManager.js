import Wishlist from '../models/wishlist.js'
import { clearDatabase, seedDatabase } from '../development/dbSeed.js' // DEVELOPMENT

const manifest = chrome.runtime.getManifest();
export const manifestVersion = manifest.version;

export async function checkDBschema() {
  let result = await chrome.storage.local.get('versionNumber');
  let databaseVersion = result.versionNumber;
  if (databaseVersion == undefined) {
    await setupDatabase();
    await tutorialData();
  } else if (databaseVersion < manifestVersion) {
    await migrateDatabase(databaseVersion, manifestVersion);
  } else if (databaseVersion == manifestVersion) {
    console.log("database is up to date, no update required");
  }
}

async function setupDatabase() {
  // check and set VersionNumber
  console.log("VersionNumber not found; setup of local storage started");
  await chrome.storage.local.set({'versionNumber': manifestVersion});
  console.log("versionNumber set to " + manifestVersion);

  // check and set defaultWishlistId
  let defWishlistResult = await chrome.storage.local.get('defaultWishlistId');
  if (defWishlistResult.defaultWishlistId == undefined) {
    await chrome.storage.local.set({'defaultWishlistId': ''});
    console.log("defaultWishlistId set to default");
  }

  // check and set wishlists
  let wishlistsResult = await chrome.storage.local.get('wishlists');
  if (wishlistsResult.wishlists == undefined) {
    await chrome.storage.local.set({'wishlists': []});
    console.log("wishlists set to default");
  }

  // check and set wishes
  let wishesResult = await chrome.storage.local.get('wishes');
  if (wishesResult.wishes == undefined) {
    await chrome.storage.local.set({'wishes': []});
    console.log("wishes set to default");
  }
}

async function tutorialData() {
    // create default Wishlist
    var tutorialDefaultWishlist = new Wishlist({'name': "World Wide Wishlist"});
    await tutorialDefaultWishlist.save();
    await tutorialDefaultWishlist.setAsDefaultWishlist();

    // create 2 more wishlists
    var tutorialWishlist2 = new Wishlist({name: "Hobby needs"});
    await tutorialWishlist2.save();
    var tutorialWishlist3 = new Wishlist({name: "Ideas for Friends"});
    await tutorialWishlist3.save();
}

async function migrateDatabase(oldVersion, newVersion) {
  console.log("Update detected, migration started from version " + oldVersion + " to version " + newVersion);
  // If a future updates requires changes to the Database "schema" this is the place to do them
  await chrome.storage.local.set({'versionNumber': newVersion});
}
