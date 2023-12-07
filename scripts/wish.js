function wishConnection() {
  console.log("wish Model reports for duty!");
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
    // console.log("save function connected")
    let wishData = {
      "id": this.id,
      "wishlistId": this.wishlistId,
      "name": this.name,
      "url": this.url,
      "image": this.image,
      "priceInCents": this.priceInCents,
      "currency": this.currency,
      "quantity": this.quantity,
      "note": this.note,
      "date": this.date
    };
    // console.log("Type of wishData: " + typeof wishData.wishes);
    // console.log(wishData);

    let result = await chrome.storage.local.get(['wishes']);
    let wishes = result.wishes;
    // console.log("Result of reading aka result:" + result);
    // console.log("Type of result: " + typeof result);
    // console.log("Type of wishes: " + typeof wishes);

    wishes.push(wishData);
    // console.log("wishes after pushing");
    // console.log(wishes);
    // console.log(wishes[3]);

    chrome.storage.local.set({'wishes': wishes});
  };

  class

  // Todo: Read a wish method
  read() {

  }

  // Todo: Destroy a wish method

  // Todo: update a wish method
};
