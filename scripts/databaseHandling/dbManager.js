import Wish from '../models/wish.js'
import Wishlist from '../models/wishlist.js'
import { clearDatabase, seedDatabase } from '../development/dbSeed.js' // DEVELOPMENT

const manifest = chrome.runtime.getManifest();
export const manifestVersion = manifest.version;

export default async function checkDBschema() {
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
    var tutorialWishlist3 = new Wishlist({name: "Gift ideas for Friends"});
    await tutorialWishlist3.save();

    // create tutorial wishes for default Wishlist
    let formData1_4 = {
      'image'       : "oopsie",
      'name'        : "Default wishlist",
      'note'        : "This is your default wishlist, meaning that it is selected by default when saving new wishes and when coming here. Your other wishlists are displayed to the left. Click on 'Hobby Needs'.",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialDefaultWishlist.id
    };
    await tutorialSaveWish(formData1_4);

    let formData1_3 = {
      'image'       : "oopsie",
      'name'        : "ANY Website",
      'note'        : "You can save any website, be it big like Amazon or a small local shop. Even if the shop shuts down, World-Wide-Wishlist keeps the data it has, so you have a chance of finding the product somwhere else.",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialDefaultWishlist.id
    };
    await tutorialSaveWish(formData1_3);

    let formData1_2 = {
      'image'       : "oopsie",
      'name'        : "Clicking on a Wish...",
      'note'        : "Clicking on a wish will get you to the website you saved it from! try it out!",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialDefaultWishlist.id
    };
    await tutorialSaveWish(formData1_2);

    let formData1_1 = {
      'image'       : "oopsie",
      'name'        : "This is a Wish",
      'note'        : "You can save any product from any page by clicking the World-Wide-Wishlist extension icon.",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialDefaultWishlist.id
    };
    await tutorialSaveWish(formData1_1);

    // Wishlist 2 tutorial

    let formData2_4 = {
      'image'       : "oopsie",
      'name'        : "Additional features",
      'note'        : "Let's look at the last few cool features. Delete all the tutorial wishes here and click on 'gift ideas for friends'",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialWishlist2.id
    };
    await tutorialSaveWish(formData2_4);

    let formData2_3 = {
      'image'       : "oopsie",
      'name'        : "Accidental Deleting",
      'note'        : "if you accidentally delete a wish, no worry, you can undo the deletion of the last deleted wish. This is not possible for deleting a wishlist. Also note that you cannot delete your default wishlist. You have to make another wishlist your new default in order to do that.",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialWishlist2.id
    };
    await tutorialSaveWish(formData2_3);

    let formData2_2 = {
      'image'       : "oopsie",
      'name'        : "Deleting",
      'note'        : "I made this wishlist, so you have less incentive to immediately buy sth. because you worry you might forget or because you can't keep track of 20 different shop wishlists. Feel free to delete the wishes you feel you don't need (like all these tutorial messages).",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialWishlist2.id
    };
    await tutorialSaveWish(formData2_2);

    let formData2_1 = {
      'image'       : "oopsie",
      'name'        : "Edit your wishlists",
      'note'        : "You can edit your wishlist via the button to the top right; consider changing the title of this to your favourite hobby! This is also where you delete a wishlist",
      'price'       : "12.34 USD",
      'quantity'    : 1,
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialWishlist2.id
    };
    await tutorialSaveWish(formData2_1);

    // Wishlist 3 Tutorial (gift ideas)

    let formData3_4 = {
      'image'       : "oopsie",
      'name'        : "Your Support means a lot",
      'note'        : "I know it sounds like just a phrase but it really does! Consider leaving a positive review, or if you are really happy with my work a donation to my Ko-Fi :)",
      'price'       : "",
      'quantity'    : "",
      'url'         : "https://ko-fi.com/H2H2H8OO",
      'wishlistId'  : tutorialWishlist3.id
    };
    await tutorialSaveWish(formData3_4);

    let formData3_3 = {
      'image'       : "oopsie",
      'name'        : "Feedback is always welcome",
      'note'        : "This is my first programming project, so I expect there to be webpages where my project will fail you :( please let me know if that happens! (click this to get to the github project).",
      'price'       : "",
      'quantity'    : "",
      'url'         : "https://github.com/Concibar/world-wide-wishlist/issues",
      'wishlistId'  : tutorialWishlist3.id
    };
    await tutorialSaveWish(formData3_3);

    let formData3_2 = {
      'name'        : "Exporting and Importing",
      'note'        : "You can also export and import your wishlists and wishes via the settings if you want to carry over your data to a different chromium Browser - like Brave - or if you simply want to backup your data.",
      'price'       : "",
      'quantity'    : "",
      'wishlistId'  : tutorialWishlist3.id
    };
    await tutorialSaveWish(formData3_2);

    let formData3_1 = {
      'name'        : "This is an idea",
      'note'        : "Ideas are here so that you can make a note of a product that you haven't found online yet. Maybe your grandma said she wants new gardening boots, so you make a note. Think of your best friend and add an idea (Button to the top) for what you might get them.",
      'price'       : "probably 50 bucks",
      'quantity'    : 1,
      'wishlistId'  : tutorialWishlist3.id
    };
    await tutorialSaveWish(formData3_1);
}

async function tutorialSaveWish(formData) {
  let wish = new Wish(formData);
  await wish.save();
  await new Promise(resolve => setTimeout(resolve, 1));
}

async function migrateDatabase(oldVersion, newVersion) {
  console.log("Update detected, migration started from version " + oldVersion + " to version " + newVersion);
  // If a future updates requires changes to the Database "schema" this is the place to do them
  await chrome.storage.local.set({'versionNumber': newVersion});
}
