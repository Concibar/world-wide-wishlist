import {
  nameMinLength,
  maxWishNameLength,
  maxWishDisplayLength,
  maxWishlistNameLength,
  maxNoteLength,
  maxPriceLength,
  maxQuantity
} from '../databaseHandling/dbConfig.mjs'

export default class MyWishlistView{
  #currentWishlistId;

  constructor() {}

  get currentWishlistId() {
    return this.#currentWishlistId;
  }

  async completeLoad(defaultWishlistId, wishes, wishlists) {
    // fill with the default wishlist at the top
    // give every wishlist element an id
    let listOfWishlists = document.getElementById('wishlists');
    listOfWishlists.innerHTML = '';
    let defaultWishlist = wishlists.find(wishlist => wishlist.id === defaultWishlistId);
    listOfWishlists.insertAdjacentHTML("afterbegin", `
      <li data-wishlist-id="${defaultWishlist.id}" class="py-2 px-4 is-clickable active-wishlist">
        <div style="pointer-events: none;">
          <div class="level mb-0">
            <span class="level-item is-unselectable">
              ${defaultWishlist.name}
            </span>
            <span class="level-item icon is-unselectable">
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
    for (let i = 0; i < remainingWishlists.length; i++) {
      listOfWishlists.insertAdjacentHTML("beforeend", `
        <li data-wishlist-id="${remainingWishlists[i].id}" class="py-2 px-4 is-clickable ">
          <span style="pointer-events: none;" class="is-unselectable">
            ${remainingWishlists[i].name}
          </span>
        </li>
      `);
    }

    // fill in the wishes of the default Wishlist
    await this.displayWishes(wishes, defaultWishlist.id, wishlists);

    // set the max quantity for the add-idea and edit-wish modal
    document.querySelector('#edit-wish-quantity').max = maxQuantity;
    document.querySelector('#add-idea-quantity').max = maxQuantity;
  }

  async displayWishes(wishes, wishlistId, wishlists) {
    var wishesContainer = document.getElementById('wishes');
    wishesContainer.innerHTML = '';
    this.#currentWishlistId = wishlistId;

    //change active-wishlist
    let test = document.querySelector("body");
    document.querySelector('.active-wishlist').classList.remove('active-wishlist');
    document.querySelector(`[data-wishlist-id="${wishlistId}"]`).classList.add('active-wishlist');

    // insert the new wishes with name, date, url, note and id
    for (let i = 0; i < wishes.length; i++) {
      let wish = wishes[i];
      wishesContainer.insertAdjacentHTML("beforeend", await this.#makeHtmlElementFromWish(wish, wishlists));
    }
    wishesContainer.insertAdjacentHTML("beforeend", `<div id="bottom-placeholder"></div>`);
  }

  toggleDropdown(wish) {
    let dropdown = document.querySelector(`[data-wish-id="${wish.id}"].dropdown`);
    dropdown.classList.toggle('is-active');
  }

  moveWish(wish) {
    let wishHtmlElement = document.querySelector(`[data-wish-id="${wish.id}"].wish`);
    wishHtmlElement.outerHTML = ''
  }

  editWish(wish) {
    document.getElementById("edit-wish-name").value = wish.name;
    document.getElementById("edit-wish-price").value = wish.price;
    document.getElementById("edit-wish-quantity").value = wish.quantity;
    document.getElementById("edit-wish-note").value = wish.note;
    let selectHtmlWish = document.querySelector(`[data-wish-id="${wish.id}"].actual-wishcard`);
    if (selectHtmlWish) {
      document.getElementById("edit-wish-image").src = selectHtmlWish.querySelector('img.wish-image').src;
      document.getElementById("edit-wish-image").alt = `image of ${wish.name}`;
    } else {
      document.getElementById("edit-wish-image").src = "/images/whoopsie.png";
      document.getElementById("edit-wish-image").alt = "image not found"
    }
    let editWishModal = document.getElementById("edit-wish-modal");
    this.openModal(editWishModal);
  }

  getEditWishFormData() {
    (document.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
    let formInputFaulty = false;
    let name = document.getElementById("edit-wish-name").value;
    let price = document.getElementById("edit-wish-price").value;
    let quantity = parseInt(document.getElementById("edit-wish-quantity").value, 10);
    let note = document.getElementById("edit-wish-note").value;
    if (name.length < nameMinLength) {
      document.querySelector('#edit-wish-name-warning').innerText = "* Name cannot be empty, please enter a name!";
      formInputFaulty = true;
    } else if (name.length > maxWishNameLength) {
      document.querySelector('#edit-wish-name-warning').innerText = "* Name longer than " + maxWishNameLength + " letters, please enter a shorter name!";
      formInputFaulty = true;
    }
    if (note.length > maxNoteLength) {
      document.querySelector('#edit-wish-note-warning').innerText = "* Note longer than " + maxNoteLength + " letters, please enter a shorter note!";
      formInputFaulty = true;
    }
    if (price.length > maxPriceLength) {
      document.querySelector('#edit-wish-price-warning').innerText = "* Price longer than " + maxPriceLength + " characters, please enter a shorter price!";
      formInputFaulty = true;
    }
    if (isNaN(quantity) || (quantity > maxQuantity)) {
      document.querySelector('#add-idea-quantity-warning').innerText = "* Quantity invalid, please enter a quantity between 0 and " + maxQuantity + "!";
      formInputFaulty = true;
    }
    if (formInputFaulty) return false;
    let formData = {
      'name': name,
      'price': price,
      'quantity': quantity,
      'note': note
    };
    return formData;
  }

  getEditWishlistFormData() {
    (document.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
    let name = document.getElementById("edit-wishlist-name").value;
    if (name.length < nameMinLength) {
      document.querySelector('#edit-wishlist-name-warning').innerText = "* Name cannot be empty, please enter a name!";
      return false
    } else if (name.length > maxWishlistNameLength) {
      document.querySelector('#edit-wishlist-name-warning').innerText = "* Name longer than " + maxWishlistNameLength + " letters, please enter a shorter name!";
      return false
    } else {
      let formData = {
        'name': name,
        'newDefault': document.getElementById("edit-wishlist-new-default-wishlist").checked
      };
      return formData;
    }
  }

  deleteWishlist(defaultWishlistId) {
    if (defaultWishlistId === this.#currentWishlistId) {
      window.alert("You cannot delete your default wishlist. Please make another wishlist your default wishlist before you delete this wishlist.");
    } else {
      return window.confirm("Are you sure you want to delete this wishlist and all wishes on it? This cannot be undone!")
    }
  }

  getAddIdeaFormData() {
    (document.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
    let formInputFaulty = false;
    let name = document.getElementById("add-idea-name").value;
    let note = document.getElementById("add-idea-note").value;
    let price = document.getElementById("add-idea-price").value;
    let quantity = parseInt(document.getElementById("add-idea-quantity").value, 10);
    if (name.length < nameMinLength) {
      document.querySelector('#add-idea-name-warning').innerText = "* Name cannot be empty, please enter a name!";
      formInputFaulty = true;
    } else if (name.length > maxWishNameLength) {
      document.querySelector('#add-idea-name-warning').innerText = "* Name longer than " + maxWishNameLength + " letters, please enter a shorter name!";
      formInputFaulty = true;
    }
    if (note.length > maxNoteLength) {
      document.querySelector('#add-idea-note-warning').innerText = "* Note longer than " + maxNoteLength + " letters, please enter a shorter note!";
      formInputFaulty = true;
    }
    if (price.length > maxPriceLength) {
      document.querySelector('#add-idea-price-warning').innerText = "* Price longer than " + maxPriceLength + " characters, please enter a shorter price!";
      formInputFaulty = true;
    }
    if (isNaN(quantity) || (quantity > maxQuantity)) {
      document.querySelector('#add-idea-quantity-warning').innerText = "* Quantity invalid, please enter a quantity between 0 and " + maxQuantity + "!";
      formInputFaulty = true;
    }
    if (formInputFaulty) return false;
    let formData = {
      'name': name,
      'price': price,
      'quantity': quantity,
      'note': note,
      'wishlistId': this.#currentWishlistId
    };
    return formData;
  }

  getCreateWishlistFormData() {
    (document.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
    let name = document.getElementById("create-wishlist-name").value;
    if (name.length < nameMinLength) {
      document.querySelector('#create-wishlist-name-warning').innerText = "* Name cannot be empty, please enter a name!";
      return false
    } else if (name.length > maxWishlistNameLength) {
      document.querySelector('#create-wishlist-name-warning').innerText = "* Name longer than " + maxWishlistNameLength + " letters, please enter a shorter name!";
      return false
    } else {
      let formData = {
        'name': name,
        'newDefault': document.getElementById("create-wishlist-new-default-wishlist").checked
      };
      return formData;
    }
  }

  deleteWish(wish) {
    let undoElement = document.getElementById("undo-delete");
    if (undoElement !== null && undoElement !== undefined) {undoElement.remove()}
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
  }

  async undoDeleteWish(wish, wishlists) {
    var undoDeleteMessage = document.querySelector(`[data-wish-id="${wish.id}"]#undo-delete`);
    undoDeleteMessage.outerHTML = await this.#makeHtmlElementFromWish(wish, wishlists);
  }

  async updateWish(wish, wishlists) {
    var wishHtmlElement = document.querySelector(`[data-wish-id="${wish.id}"].wish`)
    wishHtmlElement.outerHTML = await this.#makeHtmlElementFromWish(wish, wishlists);
  }

  editWishlist(wishlist) {
    document.getElementById("edit-wishlist-name").value = wishlist.name;
    document.getElementById("edit-wishlist-card-title").innerText = `Edit "${wishlist.name}"`
    document.getElementById("edit-wishlist-new-default-wishlist").checked = false;
    let editWishlistModal = document.getElementById("edit-wishlist-modal");
    this.openModal(editWishlistModal);
  }

  openModal($modal) {
    if ($modal == document.getElementById('create-wishlist-modal')) {
      document.getElementById('create-wishlist-new-default-wishlist').checked = false;
    }
    if ($modal == document.getElementById('add-idea-modal')) {
      document.getElementById('add-idea-quantity').value = 1;
    }
    $modal.classList.add('is-active');
  }

  closeModal($modal) {
    $modal.classList.remove('is-active');
    ($modal.querySelectorAll('input') || []).forEach((inputField) => {
      inputField.value = "";
    });
    ($modal.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
  }

  closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      this.closeModal($modal);
    });
  }

  // Private Methods

  async #makeHtmlElementFromWish(wish, wishlists) {
    if (wish.url == null) {
      // this creates a note card instead of a regular wish card
      return `
        <div data-wish-id="${wish.id}" class="wish box is-clickable">
          <div class="is-flex">

            <div class="is-flex-grow-1">
              ${this.#makeWishName(wish.name)}
              ${this.#makeWishPrice(wish.price)}
              <h4 class="is-size-6"><strong>Quantity:</strong> ${wish.quantity}</h4>
              ${this.#makeNoteForWish(wish.note)}
            </div>

            <div class="ml-3">
            <div class="container button-container">
              <div data-wish-id="${wish.id}" class="dropdown move-wish-dropdown">
                  <div class="dropdown-trigger">
                    <button data-wish-id="${wish.id}" class="button move-wish is-link" aria-haspopup="true" aria-controls="dropdown-menu">
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
              <button data-wish-id="${wish.id}" class="button edit-wish is-link">
                <span style="pointer-events: none;" class="icon">
                  <i class="fa-solid fa-pen"></i>
                </span>
              </button>
              <button data-wish-id="${wish.id}" class="button delete-wish is-danger">
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
      // this creates a regular wish card
      return `
        <div data-wish-id="${wish.id}" class="wish box actual-wishcard is-clickable">
          <div class="is-flex">
            <figure class="wish-image-container mr-3">
              <img class="wish-image is-128x128" ${await this.#makeHtmlImgSrc(wish)}>
            </figure>

            <div class="is-flex-grow-1">
              ${this.#makeWishName(wish.name)}
              <h4 class="is-size-6"><strong>From:</strong> ${this.#makeHomeUrl(wish.url)}</h4>
              ${this.#makeWishPrice(wish.price)}
              <h4 class="is-size-6"><strong>Quantity:</strong> ${wish.quantity}</h4>
              ${this.#makeNoteForWish(wish.note)}
            </div>

            <div class="ml-3">
              <div class="container button-container">
                <div data-wish-id="${wish.id}" class="dropdown move-wish-dropdown">
                    <div class="dropdown-trigger">
                      <button data-wish-id="${wish.id}" class="button move-wish is-link" aria-haspopup="true" aria-controls="dropdown-menu">
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
                <button data-wish-id="${wish.id}" class="button edit-wish is-link">
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-pen"></i>
                  </span>
                </button>
                <button data-wish-id="${wish.id}" class="button delete-wish is-danger">
                  <span style="pointer-events: none;" class="icon">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    }
  }

  #makeWishName(name) {
    var nameElement;
    if (name.length <= maxWishDisplayLength) {
      nameElement = `<h3 class="subtitle is-5">${name}</h3>`
    } else {
      let shortName = name.substring(0,  (maxWishDisplayLength-3)) + "...";
      nameElement = `<h3 class="subtitle is-5">${shortName}<span class="tooltiptext p-1 is-underlined is-italic is-light is-family-sans-serif is-size-7">${name}</span></h3>`
    }
    return nameElement;
  }

  #makeNoteForWish(note) {
    let html = `
    <hr class="has-background-white-ter mt-2 mb-2">
    <div class="note">
      <h4 class="is-size-6"><strong>Note:</strong></h4>
      <p>${note}</p>
    </div>
    `;
    return note ? html : '';
  }

  #makeWishPrice(price) {
    if (price == "") {
      return ""
    } else {
      return `<h4 class="is-size-6"><strong>Price:</strong> ${price}</h4>`
    }
  }

  #makeHomeUrl(url) {
      const domainRegex = /(?:https?:\/\/)?(?:www\.)?([^/]+)/i;
      const match = url.match(domainRegex);
      return match ? match[1] : "error";
  }

  async #makeHtmlImgSrc(wish) {
    return new Promise((resolve) => {
      var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

      function isValidHttpUrl(string) {
        let url;

        try {
          url = new URL(string);
        } catch (_) {
          return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
      }

      var imageFallback = 'src="/images/whoopsie.png" alt="image not found"';
      var imageTester = new Image();

      imageTester.onload = function() {
        resolve(`src="${imageTester.src}" alt="product image of ${wish.name}"`);
      };

      imageTester.onerror = function() {
        resolve(imageFallback);
      };

      if (base64regex.test(wish.image)) {
        imageTester.src = `data:image/png;base64, ${wish.image}`;
      } else if (isValidHttpUrl(wish.image)) {
        imageTester.src = wish.image;
      } else {
        resolve(imageFallback);
        return;
      }
    });
  }

  #makeHtmlMoveWishDropdown(wish, wishlists) {
    let htmlDropdownlist = "";
    let filteredWishlists = wishlists.filter((list) => list.id != wish.wishlistId);
    filteredWishlists.forEach((list) => {
      htmlDropdownlist = htmlDropdownlist + `
        <a data-wishlist-id="${list.id}" data-wish-id="${wish.id}" class="dropdown-item">
          ${list.name}
        </a>
      `;
    });
    return htmlDropdownlist
  }
}
