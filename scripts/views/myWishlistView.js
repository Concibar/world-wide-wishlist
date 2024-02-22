function myWishlistViewConnection() {
  console.log("myWishlistView.js is connected");
};

class MyWishlistView{
  #currentWishlistId;

  constructor() {};

  get currentWishlistId() {
    return this.#currentWishlistId;
  };

  completeLoad(defaultWishlistId, wishes, wishlists) {
    // fill with the default wishlist at the top
    // give every wishlist element an id
    let listOfWishlists = document.getElementById('wishlists');
    listOfWishlists.innerHTML = '';
    let defaultWishlist = wishlists.find(list => list.id === defaultWishlistId);
    listOfWishlists.insertAdjacentHTML("afterbegin", `
      <li data-wishlist-id="${defaultWishlist.id}" class="py-2 px-4 is-clickable active-wishlist">
        <div style="pointer-events: none;">
          <div>
            <span class="is-unselectable">
              ${defaultWishlist.name}
            </span>
            <span class="icon is-unselectable">
              <i class="fa-solid fa-star"></i>
            </span>
          </div>
          <div>
            <p class="is-size-7 is-unselectable">Default Wishlist</p>
          </div>
        </div>
      </li>
    `);

    // fill with rest of wishlists in alphabetical order
    let remainingWishlists = wishlists.filter(list => list.id !== defaultWishlist.id);
    let sortedRemainingWishlists = remainingWishlists.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < sortedRemainingWishlists.length; i++) {
      listOfWishlists.insertAdjacentHTML("beforeend", `
        <li data-wishlist-id="${sortedRemainingWishlists[i].id}" class="py-2 px-4 is-clickable ">
          <span style="pointer-events: none;" class="is-unselectable">
            ${sortedRemainingWishlists[i].name}
          </span>
        </li>
      `);
    };

    // fill in the wishes of the default Wishlist
    this.displayWishes(wishes, defaultWishlist.id, wishlists);
  };

  displayWishes(wishes, wishlistId, wishlists) {
    var wishesContainer = document.getElementById('wishes');
    wishesContainer.innerHTML = '';
    this.#currentWishlistId = wishlistId;

    //change active-wishlist
    document.querySelector('.active-wishlist').classList.remove('active-wishlist');
    document.querySelector(`[data-wishlist-id="${wishlistId}"]`).classList.add('active-wishlist');

    // insert the new wishes with name, date, url, note and id
    for (let i = 0; i < wishes.length; i++) {
      let wish = wishes[i];
      wishesContainer.insertAdjacentHTML("beforeend", this.#makeHtmlElementFromWish(wish, wishlists));
    };
  };

  toggleDropdown(wish) {
    let dropdown = document.querySelector(`[data-wish-id="${wish.id}"].dropdown`);
    dropdown.classList.toggle('is-active');
  };

  moveWish(wish) {
    let wishHtmlElement = document.querySelector(`[data-wish-id="${wish.id}"].wish`);
    wishHtmlElement.outerHTML = ''
  };

  editWish(wish) {
    document.getElementById("edit-wish-name").value = wish.name;
    document.getElementById("edit-wish-price").value = wish.price;
    document.getElementById("edit-wish-quantity").value = wish.quantity;
    document.getElementById("edit-wish-note").value = wish.note;
    document.getElementById("edit-wish-image").src = this.#makeHtmlImgSrc(wish);
    let editWishModal = document.getElementById("edit-wish-modal");
    this.openModal(editWishModal);
  };

  getEditWishFormData() {
    let name = document.getElementById("edit-wish-name").value;
    if (name.length < 1) {
      window.alert("Name cannot be empty, please enter a name!");
      return false
    } else if (name.length > 50) {
      window.alert("Name longer than 50 letters, please enter a shorter name!");
      return false
    } else {
      let formData = {
        'name': name,
        'price': document.getElementById("edit-wish-price").value,
        'quantity': document.getElementById("edit-wish-quantity").value,
        'note': document.getElementById("edit-wish-note").value
      };
      return formData;
    };
  };

  getEditWishlistNewName() {
    let name = document.getElementById("edit-wishlist-name").value;
    if (name.length < 1) {
      window.alert("Name cannot be empty, please enter a name!");
      return false
    } else if (name.length > 30) {
      window.alert("Name longer than 30 letters, please enter a shorter name!");
      return false
    } else {
      return name;
    };
  };

  deleteWishlist(defaultWishlistId) {
    if (defaultWishlistId === this.#currentWishlistId) {
      window.alert("You cannot delete your default wishlist. Please make another wishlist your default wishlist before you delete this wishlist.");
    } else {
      return window.confirm("Are you sure you want to delete this wishlist and all wishes on it? This cannot be undone!")
    };
  };

  getAddIdeaFormData() {
    let name = document.getElementById("add-idea-name").value;
    if (name.length < 1) {
      window.alert("Name cannot be empty, please enter a name!");
      return false
    } else if (name.length > 50) {
      window.alert("Name longer than 50 letters, please enter a shorter name!");
      return false
    } else {
      let formData = {
        'name': name,
        'price': document.getElementById("add-idea-price").value,
        'quantity': document.getElementById("add-idea-quantity").value,
        'note': document.getElementById("add-idea-note").value,
        'wishlistId': this.#currentWishlistId,
        'date': new Date()
      };
      return formData;
    };
  };

  getCreateWishlistFormData() {
    let name = document.getElementById("create-wishlist-name").value;
    if (name.length < 1) {
      window.alert("Name cannot be empty, please enter a name!");
      return false
    } else if (name.length > 30) {
      window.alert("Name longer than 30 letters, please enter a shorter name!");
      return false
    } else {
      let formData = {
        'name': name,
        'newDefault': document.getElementById("create-wishlist-new-default-wishlist").checked
      };
      return formData;
    };
  }

  deleteWish(wish) {
    let undoElement = document.getElementById("undo-delete");
    if (undoElement !== null && undoElement !== undefined) {undoElement.remove()};
    let wishHtmlElement = document.querySelector(`[data-wish-id="${wish.id}"].wish`);
    wishHtmlElement.outerHTML = `
    <div id="undo-delete" data-wish-id="${wish.id}" class="box">
      <div class="is-flex">

        <p class="is-flex-grow-1">Wish deleted</p>

        <button data-wish-id="${wish.id}" class="button undo-delete">
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
  };

  undoDeleteWish(wish, wishlists) {
    var undoDeleteMessage = document.querySelector(`[data-wish-id="${wish.id}"]#undo-delete`);
    undoDeleteMessage.outerHTML = this.#makeHtmlElementFromWish(wish, wishlists);
  };

  updateWish(wish, wishlists) {
    var wishHtmlElement = document.querySelector(`[data-wish-id="${wish.id}"].wish`)
    wishHtmlElement.outerHTML = this.#makeHtmlElementFromWish(wish, wishlists);
  };

  editWishlist(wishlist) {
    document.getElementById("edit-wishlist-name").value = wishlist.name;
    document.getElementById("edit-wishlist-card-title").innerText = `Edit "${wishlist.name}"`
    let editWishlistModal = document.getElementById("edit-wishlist-modal");
    this.openModal(editWishlistModal);
  };

  openModal($modal) {
    $modal.classList.add('is-active');
  }

  closeModal($modal) {
    $modal.classList.remove('is-active');
  }

  closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      this.closeModal($modal);
    });
  }

  // Private Methods

  #makeHtmlElementFromWish(wish, wishlists) {
    if (wish.url == null) {
      return `
        <div data-wish-id="${wish.id}" class="wish box">
          <div class="is-flex">

            <div class="is-flex-grow-1">
              <h3>${wish.name}</h3>
              <div>
                <h4>Note:</h4>
                <p>${wish.note}</p>
              </div>
            </div>

            <div class="ml-3">
              <div>
                <p>Article added on ${wish.date.toDateString()}</p>
              </div>
              <div>
                <div data-wish-id="${wish.id}" class="dropdown move-wish-dropdown">
                    <div class="dropdown-trigger">
                      <button data-wish-id="${wish.id}" class="button move-wish" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span style="pointer-events: none;">Move to...</span>
                        <span style="pointer-events: none;" class="icon is-small">
                          <i class="fa-solid fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div id="wish-17-move-dropdown-menu" class="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        ${this.#makeHtmlMoveWishDropdown(wish, wishlists)}
                      </div>
                    </div>
                  </div>
                <button data-wish-id="${wish.id}" class="button edit-wish">
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-pen"></i>
                  </span>
                </button>
                <button data-wish-id="${wish.id}" class="button delete-wish">
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    } else {
      return `
        <div data-wish-id="${wish.id}" class="wish box">
          <div class="is-flex">

            <figure class="image is-128x128 mr-3">
              <img src="${this.#makeHtmlImgSrc(wish)}" alt="product image of ${wish.name}">
            </figure>

            <div class="is-flex-grow-1">
              <h3>${wish.name}</h3>
              <h4>from: ${wish.url}</h4>
              <div>
                <h4>Note:</h4>
                <p>${wish.note}</p>
              </div>
            </div>

            <div class="ml-3">
              <div>
                <p>Article added on ${wish.date.toDateString()}</p>
              </div>
              <div>
                <button data-wish-id="${wish.id}" class="button go-to-wish-website">
                  <span style="pointer-events: none;">Go to shop</span>
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-up-right-from-square"></i>
                  </span>
                </button>
              </div>
              <div>
                <div data-wish-id="${wish.id}" class="dropdown move-wish-dropdown">
                    <div class="dropdown-trigger">
                      <button data-wish-id="${wish.id}" class="button move-wish" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span style="pointer-events: none;">Move to...</span>
                        <span style="pointer-events: none;" class="icon is-small">
                          <i class="fa-solid fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div id="wish-17-move-dropdown-menu" class="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        ${this.#makeHtmlMoveWishDropdown(wish, wishlists)}
                      </div>
                    </div>
                  </div>
                <button data-wish-id="${wish.id}" class="button edit-wish">
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-pen"></i>
                  </span>
                </button>
                <button data-wish-id="${wish.id}" class="button delete-wish">
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    };
  };

  #makeHtmlImgSrc(wish) {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (base64regex.test(wish.image)) {
      return `data:image/png;base64, ${wish.image}`
    } else {
      return '/images/whoopsie.png'
    }
  };

  #makeHtmlMoveWishDropdown(wish, wishlists) {
    let htmlDropdownlist = ""
    wishlists.forEach((list) => {
      htmlDropdownlist = htmlDropdownlist + `
        <a data-wishlist-id="${list.id}" data-wish-id="${wish.id}" class="dropdown-item">
          ${list.name}
        </a>
      `;
    });
    return htmlDropdownlist
  };
};
