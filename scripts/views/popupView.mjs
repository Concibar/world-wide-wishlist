import {
  nameMinLength,
  maxWishNameLength,
  maxWishlistNameLength,
  maxNoteLength,
  maxPrice,
  maxQuantity
} from '../databaseHandling/dbConfig.mjs'

export default class PopupView {
  wishName = "";
  wishUrl = "";
  imageArray = [];

  constructor (scraper) {
    this.wishName = scraper.title;
    this.wishUrl = scraper.url;
    this.imageArray = scraper.imageArray;
  }

  displayScraped(wishlists, defaultWishlist, currenciesbyType) {
    document.getElementById('wish-name').value = this.wishName;
    document.querySelector('#wish-quantity').max = maxQuantity;
    document.querySelector('#wish-price').max = maxPrice;
    // display the images in the gallery
    let gallery = document.getElementById('image-gallery');
    if (this.imageArray.length > 0) {
      for (var i = 0; i<this.imageArray.length; i++){
        gallery.insertAdjacentHTML("beforeend", `<img style="display: none;" id="${i}" class="img-fit is-align-content-center" src="${this.imageArray[i]}"></img>`);
      }
      document.getElementById('0').setAttribute('style', 'display: initial;');
    }
    this.displayWishlists(wishlists, defaultWishlist.id, defaultWishlist);
    this.displayCurrencies(currenciesbyType);
    document.querySelector('#wish-quantity').max = maxQuantity;
  }

  displayNext() {
    let gallery = document.getElementById('image-gallery');
    let length = gallery.children.length;
    let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
    let nextId = (activeId + 1) % length;
    document.getElementById(activeId).setAttribute('style', 'display: none;');
    document.getElementById(nextId).setAttribute('style', 'display: initial;');
  }

  displayPrev() {
    let gallery = document.getElementById('image-gallery');
    let length = gallery.children.length;
    let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
    let prevId = (((activeId - 1) % length) < 0) ? (length-1) : ((activeId - 1) % length);
    document.getElementById(activeId).setAttribute('style', 'display: none;');
    document.getElementById(prevId).setAttribute('style', 'display: initial;');
  }

  async getFormData() {
    (document.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
    let formInputFaulty = false;
    let wishCurrencyId = document.getElementById('wish-currency-id').value;
    let wishName = document.getElementById('wish-name').value;
    let wishNote = document.getElementById('wish-note').value;
    let wishPrice = parseFloat(document.getElementById('wish-price').value);
    let wishQuantity = parseInt(document.getElementById('wish-quantity').value, 10);
    if (wishName.length < nameMinLength) {
      document.getElementById('wish-name-warning').innerText = "* Name cannot be empty, please enter a name!";
      formInputFaulty = true;
    } else if (wishName.length > maxWishNameLength) {
      document.getElementById('wish-name-warning').innerText = "* Name longer than " + maxWishNameLength + " letters, please enter a shorter name!";
      formInputFaulty = true;
    }
    if (wishNote.length > maxNoteLength) {
      document.getElementById('wish-note-warning').innerText = "* Note longer than " + maxNoteLength + " letters, please enter a shorter note!";
      formInputFaulty = true;
    }
    if (isNaN(wishPrice) || (wishPrice > maxPrice) || (wishPrice < 0)) {
      document.getElementById('wish-price-warning').innerText = "* Price invalid, please enter a quantity between 0 and " + maxPrice + "!";
      formInputFaulty = true;
    }
    if (isNaN(wishQuantity) || (wishQuantity > maxQuantity) || (wishQuantity < 0)) {
      document.getElementById('wish-quantity-warning').innerText = "* Quantity invalid, please enter a quantity between 0 and " + maxQuantity + "!";
      formInputFaulty = true;
    }
    if (formInputFaulty) return false;
    let gallery = document.getElementById('image-gallery');
    let element = gallery.querySelector('[style="display: initial;"]');
    let activeSrc = element ? element.getAttribute('src') : "no img found";
    var formData = {};
        formData.currencyId  = wishCurrencyId;
        formData.image       = await this.#convertImage(activeSrc);
        formData.name        = wishName;
        formData.note        = wishNote;
        formData.price       = wishPrice;
        formData.quantity    = wishQuantity;
        formData.url         = this.wishUrl;
        formData.wishlistId  = document.getElementById('wishlists').value;
    return formData;
  }

  displayWishlists(wishlists, selectedWishlistId, defaultWishlist) {
    // clear selector of old wishes, but not add new
    let previousOptions = document.querySelectorAll(".regular-wishlist-option");
    previousOptions.forEach((element) => {element.remove()});

    let wishlistsSelector = document.getElementById('wishlists');
    let remainingWishlists = wishlists.filter(wishlist => wishlist.id !== defaultWishlist.id);

    // insert all wishlists except default after add new
    for (let i = 0; i < remainingWishlists.length; i++) {
      wishlistsSelector.insertAdjacentHTML("beforeend", `<option value="${remainingWishlists[i].id}" class="wishlist-option regular-wishlist-option">${remainingWishlists[i].name}</option>`);
    }

    // insert default wishlist at the top, before add new
    wishlistsSelector.insertAdjacentHTML("afterbegin", `
      <option value="${defaultWishlist.id}" class="wishlist-option has-background-grey-lighter regular-wishlist-option">
        ${defaultWishlist.name} ★
      </option>
    `);

    wishlistsSelector.value = selectedWishlistId;
  }

  displayCurrencies(currenciesbyType) {
    let defaultCurrency = currenciesbyType.default;
    let favoredCurrencies = currenciesbyType.favored;
    let favoredCurrenciesSelector = document.getElementById('favored-currencies');
    let nonFavoredCurrencies = currenciesbyType.nonFavored;
    let nonFavoredCurrenciesSelector = document.getElementById('non-favored-currencies');
    // insert the default currency
    favoredCurrenciesSelector.insertAdjacentHTML("afterbegin", `
      <option selected value="${defaultCurrency.id}" class="currency-option">
        ${defaultCurrency.code}${defaultCurrency.sign ? " " + defaultCurrency.sign : ""} ★
      </option>
    `);
    // insert the rest of the favored currencies
    for (let i = 0; i < favoredCurrencies.length; i++) {
      if (favoredCurrencies[i].code != defaultCurrency.code) {
        favoredCurrenciesSelector.insertAdjacentHTML("beforeend", `
          <option value="${favoredCurrencies[i].id}" class="currency-option">
            ${favoredCurrencies[i].code}${favoredCurrencies[i].sign ? " " + favoredCurrencies[i].sign : ""}
          </option>`);
      }
    };
    //insert the non-favored currencies
    for (let i = 0; i < nonFavoredCurrencies.length; i++) {
      nonFavoredCurrenciesSelector.insertAdjacentHTML("beforeend", `<option value="${nonFavoredCurrencies[i].id}" class="currency-option">${nonFavoredCurrencies[i].code}${nonFavoredCurrencies[i].sign ? " " + nonFavoredCurrencies[i].sign : ""}</option>`);
    };
  }

  getCreateWishlistFormData() {
    document.getElementById('create-wishlist-name-warning').innerText = "";
    let name = document.getElementById("create-wishlist-name").value;
    if (name.length < nameMinLength) {
      document.getElementById('create-wishlist-name-warning').innerText = "* Name cannot be empty, please enter a name!";
      return false;
    } else if (name.length > maxWishlistNameLength) {
      document.getElementById('create-wishlist-name-warning').innerText = "* Name longer than " + maxWishlistNameLength + " letters, please enter a shorter name!";
      return false;
    }
    let formData = {
      'name': name,
      'newDefault': document.getElementById("create-wishlist-new-default-wishlist").checked
    };
    return formData;
  }

  confirmSave() {
    document.getElementById('content').setAttribute('style', 'display: none !important;');
    document.getElementById('success-message').setAttribute('style', 'display: ;');
  }

  openModal($modal) {
    if ($modal == document.getElementById('create-wishlist-modal')) {
      document.getElementById('create-wishlist-name').value = '';
      document.getElementById('create-wishlist-new-default-wishlist').checked = false;
    }
    $modal.classList.add('is-active');
  }

  closeModal($modal) {
    $modal.classList.remove('is-active');
    ($modal.querySelectorAll('.form-input-warning') || []).forEach((warning) => {
      warning.innerText = "";
    });
  }

  closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      this.closeModal($modal);
    });
  }

  #convertImage(imageSrc) {
    return new Promise((resolve) => {
      try {
        // Create an image object from the path
        const originalImage = new Image();
        originalImage.src = imageSrc;
        originalImage.crossOrigin = "anonymous";

        // Handle CORS or loading error
        originalImage.addEventListener('error', () => {
          console.error("Failed to load image:", imageSrc);
          resolve(imageSrc);
        });

        // Get a reference to the canvas
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Wait for the image to load
        originalImage.addEventListener('load', () => {
          // Get the original image size and aspect ratio
          const originalWidth = originalImage.naturalWidth;
          const originalHeight = originalImage.naturalHeight;
          const aspectRatio = originalWidth/originalHeight;
          var newWidth = 200;
          var newHeight = 200;

          // Resize image while keeping the Ratio
          if (originalWidth > originalHeight) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }

          // Set the canvas size
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Render the image
          ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
          const base64 = canvas.toDataURL("image/jpeg").split(';base64,')[1];
          resolve(base64);
        });
      } catch (error) {
        console.error("Image couldn't be loaded properly:", error);
        resolve(imageSrc);
      }
    });
  }
}
