import uuid, {extractTimeFromUUIDv7 as uuidToName} from '../databaseHandling/uuid7.js'

export default class Wish {
  static LAST_DELETED_WISH;
  #date;
  #id;
  #image = "images/whoopsie.png";
  #name;
  #note;
  #price;
  #quantity = 1;
  #url;
  #wishlistId;

  constructor({wishlistId,name,url,image,price,quantity,note,date,id}) {
    this.#date = new Date(date);
    this.#id = id;
    this.#image = (image == undefined) ? "images/whoopsie.png" : image;
    this.#name = name;
    this.#note = note;
    this.#price = price;
    this.#quantity = quantity;
    this.#url = url;
    this.#wishlistId = wishlistId;
  }

  get id() {return this.#id}
  get name() {return this.#name}
  get wishlistId() {return this.#wishlistId}
  get url() {return this.#url}
  get image() {return this.#image}
  get price() {return this.#price}
  get quantity() {return this.#quantity}
  get note() {return this.#note}
  get date() {return this.#date}

  async save() {
    let wishesResult = await chrome.storage.local.get(['wishes']);
    let wishes = wishesResult.wishes;

    if (this.#id == null) {
      let idTrackerResult = await chrome.storage.local.get(['idTracker']);
      this.#id = idTrackerResult.idTracker;
      let newId = this.#id + 1;
      await chrome.storage.local.set({'idTracker': newId});
    }

    let wishData = {
      "date": this.#date.toISOString(),
      "id": this.#id,
      "image": this.#image,
      "name": this.#name,
      "note": this.#note,
      "price": this.#price,
      "quantity": this.#quantity,
      "url": this.#url,
      "wishlistId": this.#wishlistId
    };

    wishes.push(wishData);
    await chrome.storage.local.set({'wishes': wishes});
    return this;
  }

  async delete() {
    Wish.LAST_DELETED_WISH = this;
    let wishesResult = await chrome.storage.local.get(['wishes']);
    let wishes = wishesResult.wishes;
    let filteredwishes = wishes.filter(obj => obj.id !== this.#id);
    await chrome.storage.local.set({'wishes': filteredwishes});
  }

  async update({name,note,price,quantity,wishlistId}) {
    if (name) {this.#name = name}
    if (note) {this.#note = note}
    if (price) {this.#price = price}
    if (quantity) {this.#quantity = quantity}
    if (!(wishlistId ===  undefined)) {this.#wishlistId = wishlistId}
    await this.delete();
    await this.save();
    return this
  }

  static async readWishesOnWishlist(wishlistId) {
    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    let filteredWishes = wishes.filter(wish => wish.wishlistId == wishlistId);
    filteredWishes = filteredWishes.map((wish) => new Wish(wish));
    let wishesSortedByDate = filteredWishes.sort((a,b) => b.date.getTime()-a.date.getTime());
    return wishesSortedByDate;
  }

  static async read(wishId) {
    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    let wishData = wishes.find(wish => wish.id == wishId);
    return new Wish(wishData);
  }

  static async undoDelete() {
    let wish = Wish.LAST_DELETED_WISH;
    await wish.save();
    return wish;
  }
}
