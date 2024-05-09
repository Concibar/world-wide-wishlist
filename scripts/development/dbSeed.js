import Wish from '../models/wish.js'
import Wishlist from '../models/wishlist.js'

export async function clearDatabase() {
  await chrome.storage.local.clear(() => {
    console.log("storage cleared");
  });
}

export async function seedDatabase() {
  // create default Wishlist
  var habenWollen = new Wishlist({'name': "Haben Wollen"});
  await habenWollen.save();
  await habenWollen.setAsDefaultWishlist();

  // create 2 more wishlists
  var weihnachten = new Wishlist({name: "Weihnachten 2017"});
  await weihnachten.save();
  var geburtstag = new Wishlist({name: "Geburtstag 2017"});
  await geburtstag.save();

  for (let i = 0; i < 20; i++) {
    let formData = {
      'image'       : "https://cdn.lederkram.de/photos/00000004/thumb/alchemistenmagazinguertelnah02.jpg",
      'name'        : `foowish ${i}`,
      'note'        : "this is a wish with an src url",
      'price'       : "69.69 USD",
      'quantity'    : 1,
      'url'         : "https://www.example.de",
      'wishlistId'  : habenWollen.id
    };
    let wish = new Wish(formData);
    await wish.save();
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  // fill wishlist weihnachten with wishes
  for (let i = 0; i < 20; i++) {
    let formData = {
      'image'       : "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",
      'name'        : `Weihnachtswunsch ${i}`,
      'note'        : "This is a wish with base64",
      'price'       : "4.20 EUR",
      'quantity'    : 1,
      'url'         : "https://www.amazon.com",
      'wishlistId'  : weihnachten.id
    };
    let wish = new Wish(formData);
    await wish.save();
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  // fill wishlist geburtstag with ideas/notes
  for (let i = 0; i < 20; i++) {
    let formData = {
      'name'        : `geburtstagswunsch ${i}`,
      'note'        : "This should be a note card",
      'price'       : "1.5 GBP",
      'quantity'    : 1,
      'wishlistId'  : geburtstag.id
    };
    let wish = new Wish(formData);
    await wish.save();
    await new Promise(resolve => setTimeout(resolve, 1));
  }
}
