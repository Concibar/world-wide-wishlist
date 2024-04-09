import uuid from '../databaseHandling/uuid7.js'
import Wish from '../models/wish.js'

export default class Wishlist {
  #id;
  #name;

  constructor({id, name}) {
    this.#id = id;
    this.#name = name;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  async save() {
    let wishlistsResult = await chrome.storage.local.get(['wishlists']);
    let wishlists = wishlistsResult.wishlists;

    if (this.#id == null) {
      this.#id = uuid();
    }

    let wishlistData = {
      "id": this.#id,
      "name": this.#name
    };

    wishlists.push(wishlistData);
    await chrome.storage.local.set({'wishlists': wishlists});
    return this;
  }

  async update(name) {
    this.#name = name;
    await this.#deleteWithoutIdCheck();
    await this.save();
    return this;
  }

  async delete() {
    let result = await chrome.storage.local.get(['defaultWishlistId']);
    let defaultWishlistId = result.defaultWishlistId;
    if (defaultWishlistId == this.#id) {
      console.log("error: you cannot delete your default wishlist. Set another one first!");
      return false
    } else {
      let wishes = await Wish.readWishesOnWishlist(this.#id);
      for (let i = 0; i < wishes.length; i++) {
        let wish = wishes[i];
        await wish.delete();
      }
      await this.#deleteWithoutIdCheck();
    }
  }

  async #deleteWithoutIdCheck() {
    let wishlistsResult = await chrome.storage.local.get(['wishlists']);
    let wishlists = wishlistsResult.wishlists;
    let filteredWishlists = wishlists.filter(obj => obj.id !== this.#id);
    await chrome.storage.local.set({'wishlists': filteredWishlists});
  }

  async setAsDefaultWishlist() {
    await this.save();
    await chrome.storage.local.set({'defaultWishlistId': this.#id});
  }

  static async read(wishlistId) {
    let result = await chrome.storage.local.get(['wishlists']);
    let wishlistsData = result.wishlists;
    let wishlistData = wishlistsData.find((wishlist) => {
      return wishlist.id === wishlistId;
    });
    let wishlist = new Wishlist(wishlistData);
    return wishlist;
  }

  static async readAll() {
    let result = await chrome.storage.local.get(['wishlists']);
    let wishlistsData = result.wishlists;
    let wishlists = [];
    for (let i = 0; i < wishlistsData.length; i++) {
      let wishlist = new Wishlist(wishlistsData[i]);
      wishlists.push(wishlist);
    }
    let wishlistsSortedAlphabetically = wishlists.sort((a, b) => a.name.localeCompare(b.name))
    return wishlistsSortedAlphabetically;
  }

  static async getDefaultWishlist() {
    let result = await chrome.storage.local.get('defaultWishlistId');
    let defaultWishlistId = result.defaultWishlistId;
    let defaultWishlist = await Wishlist.read(defaultWishlistId);
    return defaultWishlist;
  }
}
