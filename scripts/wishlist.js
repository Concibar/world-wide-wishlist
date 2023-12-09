function wishlistConnection() {
  console.log("wishlist.js connected");
};

class Wishlist {
  #id = 0;
  name = "";

  constructor({id, name}) {
    this.#id = id;
    this.name = name;
  };

  get id() {
    return this.#id;
  };

  get name() {
    return this.name;
  };

  static async readAll() {
    let result = await chrome.storage.local.get(['wishlists']);
    let wishlistsData = result.wishlists;
    let wishlists = [];
    for (let i = 0; i < wishlistsData.length; i++) {
      let wishlist = new Wishlist(wishlistsData[i]);
      wishlists.push(wishlist);
    };
    return wishlists;
  };
};
