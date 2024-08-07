import uuid from '../databaseHandling/uuid7.mjs'
import Wish from './wish.mjs'

export default class Wishlist {

  static SORT_BY_OPTIONS = Object.freeze({
    ALPHA_NUM_A_TO_Z: "alphaNumAscending",
    ALPHA_NUM_Z_TO_A: "alphaNumDescending",
    DATES_OLD_TO_NEW: "dateAscending",
    DATES_NEW_TO_OLD: "dateDescending",
    PRICE_LOW_TO_HIGH: "priceAscending",
    PRICE_HIGH_TO_LOW: "priceDescending",
    CUSTOM: "custom"
  })

  #customOrder = 0;
  #id;
  #name;
  #sortBy = Wishlist.SORT_BY_OPTIONS.DATES_NEW_TO_OLD;

  constructor({customOrder, id, name, sortBy}) {
    if (customOrder != undefined) this.#customOrder = customOrder;
    this.#id = id;
    this.#name = name;
    if (sortBy != undefined) this.#sortBy = sortBy;
  }

  get customOrder() {return this.#customOrder;};
  get id() {return this.#id;};
  get name() {return this.#name;};
  get sortBy() {return this.#sortBy;};

  async save() {
    if (this.#id == null) {
      this.#id = uuid();
    };
    if ((this.#name == null)) {
      console.log("error: tried to save a wishlist without name")
      return
    }

    let wishlistsResult = await chrome.storage.local.get(['wishlists']);
    let wishlists = wishlistsResult.wishlists;

    let wishlistData = {
      "customOrder": this.#customOrder,
      "id": this.#id,
      "name": this.#name,
      "sortBy": this.#sortBy
    };

    wishlists.push(wishlistData);
    await chrome.storage.local.set({'wishlists': wishlists});
    return this;
  }

  async update({customOrder,name,sortBy}) {
    if (customOrder != null) {this.#customOrder = customOrder};
    if (name != null) {this.#name = name};
    if (sortBy != null) {this.#sortBy = sortBy};
    await this.#deleteWithoutIdCheck();
    await this.save();
    return this;
  }

  async delete() {
    let result = await chrome.storage.local.get(['defaultWishlistId']);
    let defaultWishlistId = result.defaultWishlistId;
    if (defaultWishlistId == this.#id) {
      console.log("error: cannot delete default wishlist");
      return false
    } else {
      let wishes = await Wish.readWishesOnWishlist(this);
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
    if (this.#id == null) {
      console.log('error: cannot set an unsaved wishlist as default wishlist')
      return
    };
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
