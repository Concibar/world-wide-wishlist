function wishConnection() {
  console.log("wish.js is connected");
};

class Wish {
  #id;
  name;
  wishlistId;
  url;
  image = "images/whoopsie.png";
  price;
  currency;
  quantity = 1;
  note;
  date;

  constructor({wishlistId,name,url,image,price,currency,quantity,note,date}) {
    this.wishlistId = wishlistId;
    this.name = name;
    this.url = url;
    this.image = image;
    this.price = price;
    this.currency = currency;
    this.quantity = quantity;
    this.note = note;
    this.date = date;
  };

  async save() {
    let wishData = {
      "id": this.id, //time to implement an id tracker
      "wishlistId": this.wishlistId,
      "name": this.name,
      "url": this.url,
      "image": this.image,
      "price": this.price,
      "currency": this.currency,
      "quantity": this.quantity,
      "note": this.note,
      "date": this.date
    };
    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    wishes.push(wishData);
    chrome.storage.local.set({'wishes': wishes});
  };

  // Todo: Delete a wish method
  delete() {

  };
  // Todo: update a wish method
  update() {

  };

  // Todo: Read all wishes that fit X method
  static async readWishesOnWishlist(wishlistId) {
    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    filteredWishes = wishes.filter((wish) => {return wish.wishlistId == wishlistId});
    return filteredWishes.map((wish) => {new Wish(wish)});
  };
};
