function storageTestingConnection() {
  console.log("storageTesting.js connected");
};

async function setTestDatabase() {

  await chrome.storage.local.clear(() => {
    console.log("DEBUG: storage cleared");
  });
  await setupDatabase();

  let habenWollen = new Wishlist({'name': "Haben Wollen"});
  habenWollen.setAsDefaultWishlist();
  await habenWollen.save();

  let weihnachten = new Wishlist({name: "Weihnachten 2017"});
  await weihnachten.save();

  let geburtstag = new Wishlist({name: "Geburtstag 2017"});
  await geburtstag.save();

  for (let i = 0; i < 20; i++) {
    let formData = {
      'currency'    : "EUR",
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
  };

  for (let i = 0; i < 20; i++) {
    let formData = {
      'currency'    : "EUR",
      'date'        : new Date(),
      'name'        : `Weihnachtswunsch ${i}`,
      'note'        : "when will this finally be done?",
      'price'       : 69.69,
      'quantity'    : 1,
      'url'         : "https://www.example.de",
      'wishlistId'  : weihnachten.id
    };
    let wish = new Wish(formData);
    await wish.save();
  };

  for (let i = 0; i < 20; i++) {
    let formData = {
      'currency'    : "EUR",
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
  };
};
