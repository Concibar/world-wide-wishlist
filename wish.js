function wishConnectionCallback() {
  console.log("wish Model reports for duty!");
};

class Wish {
  constructor({
    id = "new",
    name,
    url,
    image,
    price_in_cents,
    currency = "default_currency",
    quantity = 1,
    note,
    date}) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.image = image;
    this.price_in_cents = price_in_cents;
    this.currency = currency;
    this.quantity = quantity;
    this.note = note;
    this.Date = date;
    console.log(`Wish Object created with name: ${this.wishName}`);
  };

  // Todo: Create item method (based on data handed over from popup.js)
  wishCreate(name) {
    chrome.storage.local.set({
      'name': name
    }), () => {
      console.log("wish was saved boys and girls!")
    };
  };

  // Todo: Read a wish method
  wishRead(key) {
    chrome.storage.local.get(key, )
  }

  // Todo: Destroy a wish method

  // Todo: update a wish method

  // safe, find, destroy, update,
};
