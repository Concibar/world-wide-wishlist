function storageTestingConnection() {
  console.log("storageTesting.js connected");
};

async function setNewWishlist(name, alteration) {
  let wishlist = new Wishlist({name});
  await wishlist.save();
  console.log("DEBUG: Wishlist " + name + " saved. new Wishlists are");
  let wishlists = Wishlist.readAll();
  console.log(wishlists);

  await wishlist.setAsDefaultWishlist();

  await wishlist.update(alteration);
  console.log("DEBUG: Wishlist updated:");
  let update = Wishlist.readAll();
  console.log(update);

  await wishlist.delete();
  let deletedList = Wishlist.readAll();
  console.log(deletedList);
};

async function setNewWish(name, alteration) {

  var formData = {
    'currency'    : "EUR",
    'date'        : new Date(),
    'name'        : name,
    'note'        : "might get one for Grandma as well",
    'price'       : 69.69,
    'quantity'    : 1,
    'url'         : "www.example.de",
    'wishlistId'  : 0
  };

  let wish = new Wish(formData);
  console.log(wish);
  console.log(typeof wish);

  await wish.save();
  console.log("DEBUG: Wish " + name + " saved. new Wishes are");
  let wishes = await Wish.readWishesOnWishlist(0);
  console.log(wishes);
  console.log(typeof wishes[0]);

  await wish.update({'name' : alteration});
  let update = await Wish.readWishesOnWishlist(0);
  console.log(update);

  await wish.delete();
  let deletedList = await Wish.readWishesOnWishlist(0);
  console.log(deletedList);

};
