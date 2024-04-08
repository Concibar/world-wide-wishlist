function dbManagerConnection() {
  console.log("dbManager.js is connected");
}

const manifest = chrome.runtime.getManifest();
const manifestVersionNumber = manifest.version;

class DBManager {
  manifestVersion = "";

  constructor() {
    let manifest = chrome.runtime.getManifest();
    this.manifestVersion = manifest.version;
  }

  async checkDatabase() {
    let versionResult = await chrome.storage.local.get('versionNumber');
    let databaseVersion = versionResult.versionNumber;
    if (databaseVersion == undefined) {
      this.#setupDatabase();
    } else if (databaseVersion < this.manifestVersion) {
      this.#migrateDatabase(databaseVersion, this.manifestVersion);
    } else if (databaseVersion == this.manifestVersion) {
      console.log("database is up to date, no update required");
    }
  }

  async seedDatabase() {
    //TO-DO: this needs adherence to the new DB Schema
    await chrome.storage.local.clear(() => {
      console.log("DEBUG: storage cleared");
    });

    // create default Wishlist
    let habenWollen = new Wishlist({'name': "Haben Wollen"});
    habenWollen.setAsDefaultWishlist();
    await habenWollen.save();

    // create 2 more wishlists
    let weihnachten = new Wishlist({name: "Weihnachten 2017"});
    await weihnachten.save();
    let geburtstag = new Wishlist({name: "Geburtstag 2017"});
    await geburtstag.save();

    for (let i = 0; i < 20; i++) {
      let formData = {
        'date'        : new Date(),
        'name'        : `foowish ${i}`,
        'note'        : "when will this finally be done?",
        'price'       : 69.69,
        'quantity'    : 1,
        'url'         : "https://www.example.de",
        'wishlistId'  : habenWollen.id
      };
      let wish = new Wish(formData);
      await wish.save();
    }

    for (let i = 0; i < 20; i++) {
      let formData = {
        'date'        : new Date(),
        'name'        : `Weihnachtswunsch ${i}`,
        'note'        : "when will this finally be done?",
        'price'       : 69.69,
        'quantity'    : 1,
        'url'         : "https://www.amazon.com",
        'wishlistId'  : weihnachten.id
      };
      let wish = new Wish(formData);
      await wish.save();
    }

    for (let i = 0; i < 20; i++) {
      let formData = {
        'date'        : new Date(),
        'name'        : `geburtstagswunsch ${i}`,
        'note'        : "when will this finally be done?",
        'price'       : 69.69,
        'quantity'    : 1,
        'url'         : "https://www.example.de",
        'wishlistId'  : geburtstag.id
      };
      let wish = new Wish(formData);
      await wish.save();
    }
  }

  // TODO: make sure the default first time starter setup of the DB serves as a tutorial
  async #setupDatabase() {
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

  async #migrateDatabase(oldVersion, newVersion) {
    console.log("Update detected, migration started from version " + oldVersion + " to version " + newVersion);
    // If a future updates requires changes to the Database "schema" this is the place to do them
    await chrome.storage.local.set({'versionNumber': newVersion});
  }

};
