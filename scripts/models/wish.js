function wishConnection() {
  console.log("wish.js is connected");
};

class Wish {
  #currency;
  #date;
  #id;
  #image = "images/whoopsie.png";
  #name;
  #note;
  #price;
  #quantity = 1;
  #url;
  #wishlistId;

  constructor({wishlistId,name,url,image,price,currency,quantity,note,date,id}) {
    this.#currency = currency;
    this.#date = date; // TODO: make this an actual date?
    this.#id = id;
    this.#image = (image == undefined) ? "images/whoopsie.png" : image;
    this.#name = name;
    this.#note = note;
    this.#price = price;
    this.#quantity = quantity;
    this.#url = url;
    this.#wishlistId = wishlistId;
  };

  get id() {return this.#id};
  get name() {return this.#name};
  get wishlistId() {return this.#wishlistId};
  get url() {return this.#url};
  get image() {return this.#image};
  get price() {return this.#price};
  get currency() {return this.#currency};
  get quantity() {return this.#quantity};
  get note() {return this.#note};
  get date() {return this.#date};

  async save() {
    let wishesResult = await chrome.storage.local.get(['wishes']);
    let wishes = wishesResult.wishes;

    if (this.#id == null) {
      let idTrackerResult = await chrome.storage.local.get(['idTracker']);
      this.#id = idTrackerResult.idTracker;
      let newId = this.#id + 1;
      await chrome.storage.local.set({'idTracker': newId});
    };

    let wishData = {
      "id": this.#id,
      "wishlistId": this.#wishlistId,
      "name": this.#name,
      "url": this.#url,
      "image": this.#image,
      "price": this.#price,
      "currency": this.#currency,
      "quantity": this.#quantity,
      "note": this.#note,
      "date": this.#date
    };

    wishes.push(wishData);
    await chrome.storage.local.set({'wishes': wishes});
    return "Wish successfully saved!"
  };

  async delete() {
    let wishesResult = await chrome.storage.local.get(['wishes']);
    let wishes = wishesResult.wishes;
    let filteredwishes = wishes.filter(obj => obj.id !== this.#id);
    await chrome.storage.local.set({'wishes': filteredwishes});
  };

  async update({currency,name,note,price,quantity,url,wishlistId}) {
    if (currency) {this.#currency = currency};
    if (name) {this.#name = name};
    if (note) {this.#note = note};
    if (price) {this.#price = price};
    if (quantity) {this.#quantity = quantity};
    if (url) {this.#url = url};
    if (wishlistId) {this.#wishlistId = wishlistId};
    await this.delete();
    await this.save();
    return "Wish successfully updated!"
  };

  static async readWishesOnWishlist(wishlistId) {
    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    let filteredWishes = wishes.filter(wish => wish.wishlistId == wishlistId);
    filteredWishes = filteredWishes.map((wish) => new Wish(wish));
    let wishesNotYetSortedByDate = filteredWishes; //TODO: sort the wishes by date
    return wishesNotYetSortedByDate; //TODO: sort the wishes by date
  };

  static async read(wishId) {
    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    let wishData = wishes.find(wish => wish.id == wishId);
    return new Wish(wishData);
  };
};
