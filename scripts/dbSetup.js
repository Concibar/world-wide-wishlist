function dbSetupConnection() {
  console.log("dbSetup.js is connected");
};

const manifest = chrome.runtime.getManifest();
const versionNumber = manifest.version;
// verify DB via settings if false check every part and set accordingly
// TODO: make sure the default first time starter setup of the DB serves as a tutorial
// TODO: the update functionality should export the DB before updating
function setupDatabase() {
  chrome.storage.local.get('versionNumber', (result) => {
    if (result.versionNumber == undefined) {
      console.log("VersionNumber not found; setup of local storage started")
      chrome.storage.local.set({'versionNumber': versionNumber});
      console.log("versionNumber set to " + versionNumber);

      // check and set activeCurrencies to default
      chrome.storage.local.get('activeCurrencies', (result) => {
        if (result.activeCurrencies == undefined) {
          chrome.storage.local.set({'activeCurrencies': [0,1,2]});
          console.log("activeCurrencies set to default");
        };
      });

      // check and set defaultWishlistId to default
      chrome.storage.local.get('defaultWishlistId', (result) => {
        if (result.defaultWishlistId == undefined) {
          chrome.storage.local.set({'defaultWishlistId': 0});
          console.log("defaultWishlistId set to default");
        };
      });

      // check and set idTracker to default
      chrome.storage.local.get('idTracker', (result) => {
        if (result.idTracker == undefined) {
          chrome.storage.local.set({'idTracker': 0});
          console.log("idTracker set to default");
        };
      });

      // check and set currencies to default
      chrome.storage.local.get('currencies', (result) => {
        if (result.currencies == undefined) {
          chrome.storage.local.set({'currencies': [
            {
              "id": 0,
              "name": "Euro",
              "sign": "€",
              "iso_4217": "EUR",
              "active": 1
            }
          ]});
          console.log("currencies set to default");
        };
      });

      // check and set wishlists to default
      chrome.storage.local.get('wishlists', (result) => {
        if (result.wishlists == undefined) {
          chrome.storage.local.set({'wishlists': [
            {
              "id": 0,
              "name": "your first wishlist"
            }
          ]});
          console.log("wishlists set to default");
        };
      });

      // check and set wishes to default
      // TODO: change default wish to sth. nice
      chrome.storage.local.get('wishes', (result) => {
        if (result.wishes == undefined) {
          chrome.storage.local.set({'wishes': [
            {
              "id": 0,
              "wishlistId": 0,
              "name": "foowish",
              "url": "http://www.website.foo",
              "image": "ASCII base64 encoded string",
              "price": 13.54,
              "currency": "EUR",
              "quantity": 1,
              "note": "this might be a good gift for my grandma :)",
              "date": "2020.12.17"
            }
          ]});
          console.log("wishes set to default");
        };
      });

    };
  })
};
