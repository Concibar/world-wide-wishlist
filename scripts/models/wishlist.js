function wishlistConnection() {
  console.log("wishlist.js connected");
};

// TODO: make sure the frontend displays the message returned from save/update/delete correctly!
class Wishlist {
  #id;
  #name = "unnamed wishlist";

  constructor({id, name}) {
    this.#id = id;
    this.#name = name;
  };

  get id() {
    return this.#id;
  };

  get name() {
    return this.#name;
  };

  async save() {
    let wishlistsResult = await chrome.storage.local.get(['wishlists']);
    let wishlists = wishlistsResult.wishlists;

    if (this.#id == null) {
      let idTrackerResult = await chrome.storage.local.get(['idTracker']);
      this.#id = idTrackerResult.idTracker;
      let newId = this.#id + 1;
      await chrome.storage.local.set({'idTracker': newId});
    };

    let wishlistData = {
      "id": this.#id,
      "name": this.#name
    };

    wishlists.push(wishlistData);
    await chrome.storage.local.set({'wishlists': wishlists});
    return "Wishlist successfully saved!"
  };

  async update(name) {
    this.#name = name;
    await this._deleteWithoutIdCheck();
    await this.save();
    return "Wishlist successfully updated!"
  };

  async delete() {
    let result = await chrome.storage.local.get(['defaultWishlistId']);
    let defaultWishlistId = result.defaultWishlistId;
    if (defaultWishlistId == this.#id) {
      console.log("error: you cannot delete your default wishlist. Set another one first!");
      return "You cannot delete your default wishlist. Set another wishlist as default first!";
    }
    await this._deleteWithoutIdCheck();
    return "Wishlist successfully deleted!"
  };

  async _deleteWithoutIdCheck() {
    let wishlistsResult = await chrome.storage.local.get(['wishlists']);
    let wishlists = wishlistsResult.wishlists;
    let filteredWishlists = wishlists.filter(obj => obj.id !== this.#id);
    await chrome.storage.local.set({'wishlists': filteredWishlists});
  };

  async setAsDefaultWishlist() {
    let results = await chrome.storage.local.set({'defaultWishlistId': this.#id});
  };

  static async readAll() {
    // returns an Array of all Wishlist objects
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
