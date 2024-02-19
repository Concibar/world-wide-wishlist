function myWishlistViewConnection() {
  console.log("myWishlistView.js is connected");
};

class MyWishlistView{
  #defaultWishlistId;
  #currentWishlistId;
  #imageNotFound = "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";
  lastDeletedWish;

  constructor() {
    chrome.storage.local.get('defaultWishlistId', (result) => {
      this.#defaultWishlistId = result.defaultWishlistId
    });
  };

  async firstLoad() {
    // fill with the default wishlist at the top
    // give every wishlist element an id
    let listOfWishlists = document.getElementById('wishlists');
    let wishlistElements = await Wishlist.readAll();
    let defaultWishlist = wishlistElements.find(list => list.id === this.#defaultWishlistId);
    listOfWishlists.insertAdjacentHTML("afterbegin", `
      <li id="${'wishlist-' + this.#defaultWishlistId}" class="py-2 px-4 is-clickable active-wishlist">
        <div style="pointer-events: none;">
          <div>
            <span>
              ${defaultWishlist.name}
            </span>
            <span class="icon">
              <i class="fa-solid fa-star"></i>
            </span>
          </div>
          <div>
            <p class="is-size-7">Default Wishlist</p>
          </div>
        </div>
      </li>
    `);

    // fill with rest of wishlists in alphabetical order
    wishlistElements = wishlistElements.filter(list => list.id !== this.#defaultWishlistId);
    let sortedWishlists = wishlistElements.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < sortedWishlists.length; i++) {
      listOfWishlists.insertAdjacentHTML("beforeend", `
        <li id="${'wishlist-' + sortedWishlists[i].id}" class="py-2 px-4 is-clickable ">
          <span style="pointer-events: none;">
            ${sortedWishlists[i].name}
          </span>
        </li>
      `);
    };

    // fill in the wishes of the default Wishlist
    Wish.readWishesOnWishlist(this.#defaultWishlistId)
    .then(wishes => {this.displayWishes(wishes, this.#defaultWishlistId)});
  };

  displayWishes(wishes, wishlistId) {
    var wishesContainer = document.getElementById('wishes');
    wishesContainer.innerHTML = '';
    this.#currentWishlistId = wishlistId;

    //change active-wishlist
    document.querySelector('.active-wishlist').classList.remove('active-wishlist');
    wishlistId = "wishlist-" + wishlistId;
    document.getElementById(wishlistId).classList.add('active-wishlist');

    // insert the new wishes with name, date, url, note and id
    for (let i = 0; i < wishes.length; i++) {
      let wish = wishes[i];
      wishesContainer.insertAdjacentHTML("beforeend", this.makeHtmlElementFromWish(wish));
    };
  };

  createWish() {

  };

  moveWish() {

  };

  editWish() {
  };

  async deleteWish(wishId) {
    let undoElement = document.querySelector(".undo-div");
    if (undoElement !== null) {undoElement.remove()};
    let wishHtmlElement = document.getElementById(`wish-${wishId}`);
    wishHtmlElement.outerHTML = `
    <div id="wish-${wishId}" class="box undo-div">
      <div class="is-flex">

        <p class="is-flex-grow-1">Wish deleted</p>

        <button id="undo-delete-wish-${wishId}" class="button undo-delete">
          <span style="pointer-events: none;" class="icon">
            <i class="fa-solid fa-rotate-left"></i>
          </span>
          <span style="pointer-events: none;">
            Undo
          </span>
        </button>

      </div>
    </div>
    `;
    this.lastDeletedWish = await Wish.read(wishId);
  };

  undoDeleteWish() {
    var undoDeleteMessage = document.getElementById(`wish-${this.lastDeletedWish.id}`);
    var wish = this.lastDeletedWish;
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    undoDeleteMessage.outerHTML = this.makeHtmlElementFromWish(wish);
    this.lastDeletedWish = null;
  };

  createWishlist() {

  };

  editWishlist() {

  };

  deleteWishlist() {

  };

  makeHtmlElementFromWish(wish) {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return `
      <div id="${"wish-" + wish.id}" class="box">
        <div class="is-flex">

          <figure class="image is-128x128 mr-3">
            <img src="data:image/png;base64, ${base64regex.test(wish.image) ? wish.image : this.#imageNotFound} alt="product image of ${wish.name}">
          </figure>

          <div class="is-flex-grow-1">
            <h3>${wish.name}</h3>
            <h4>from: ${wish.url}</h4>
            <div>
              <h4>Notes:</h4>
              <p>${wish.note}</p>
            </div>
          </div>

          <div class="ml-3">
            <div>
              <p>Article added on ${wish.date}</p>
            </div>
            <div>
              <button id="${"go-to-wish-" + wish.id}" class="button go-to-wish-website">Go to shop</button>
            </div>
            <div>
              <button id="${"move-wish-" + wish.id}" class="button move-wish">Move to...</button>
              <button id="${"edit-wish-" + wish.id}" class="button edit-wish">Edit</button>
              <button id="${"delete-wish-" + wish.id}" class="button delete-wish">Delete</button>
            </div>
          </div>

        </div>
      </div>
    `;
  }
};
