function myWishlistViewConnection() {
  console.log("myWishlistView.js is connected");
};

class MyWishlistView{
  defaultWishlistId;

  constructor() {
    chrome.storage.local.get('defaultWishlistId', (result) => {
      this.defaultWishlistId = result.defaultWishlistId
    });
  };

  async fillDefault() {
    // fill with the default wishlist at the top
    // give every wishlist element an id
    let listOfWishlists = document.getElementById('wishlists');
    let wishlistElements = await Wishlist.readAll();
    let defaultWishlist = wishlistElements.find(list => list.id === this.defaultWishlistId);
    listOfWishlists.insertAdjacentHTML("afterbegin", `
      <li id="${'wishlist' + this.defaultWishlistId}" class="py-2 px-4 is-clickable active-wishlist">
        <div>
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
    wishlistElements = wishlistElements.filter(list => list.id !== this.defaultWishlistId);
    let sortedWishlists = wishlistElements.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < sortedWishlists.length; i++) {
      listOfWishlists.insertAdjacentHTML("beforeend", `
        <li id="${'wishlist' + sortedWishlists[i].id}" class="py-2 px-4 is-clickable ">
          <span>
            ${sortedWishlists[i].name}
          </span>
        </li>
      `);
    };
    
    this.displayWishlist(this.defaultWishlistId);
    return wishlistElements;
  };

  displayWishlist(wishlistId) {
    // remove active-wishlist css class from old add to wishlistId wishlist element
    // empty wishes
    // fill with wishes belonging to active wishlist in date order
    // ID the list of wishes
  };

  createWish() {

  };

  editWish() {

  };

  deleteWish() {

  };

  createWishlist() {

  };

  editWishlist() {

  };

  deleteWishlist() {

  };
};
