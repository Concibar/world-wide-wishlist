import {
  nameMinLength,
  maxWishNameLength,
  maxWishDisplayLength,
  maxWishlistNameLength,
  maxNoteLength,
  maxPriceLength,
  maxQuantity
} from '../databaseHandling/dbConfig.js'

export default class PopupView {
  wishUrl = "";
  imageArray = [];
  price = 0;
  wishName = "";

  constructor (scraper) {
    this.wishName = scraper.title;
    this.wishUrl = scraper.url;
    this.imageArray = scraper.imageArray;
    this.price = scraper.price;
  }

  displayScraped(wishlists, defaultWishlistId) {
    document.getElementById('wish-name').value = this.wishName;
    // display the images in the gallery
    let gallery = document.getElementById('image-gallery');
    if (this.imageArray.length > 0) {
      for (var i = 0; i<this.imageArray.length; i++){
        gallery.insertAdjacentHTML("beforeend", `<img style="display: none;" id="${i}" class="img-fit is-align-content-center" src="${this.imageArray[i]}"></img>`);
      }
      document.getElementById('0').setAttribute('style', 'display: initial;');
    }
    this.displayWishlists(wishlists, defaultWishlistId, defaultWishlistId);
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
    let wishName = document.getElementById('wish-name').value;
    let wishNote = document.getElementById('wish-note').value;
    let wishPrice = document.getElementById('wish-price').value;
    let wishQuantity = document.getElementById('wish-quantity').value;
    if (wishName.length < nameMinLength) {
      window.alert("Name cannot be empty, please enter a name!");
      return false;
    } else if (wishName.length > maxWishNameLength) {
      window.alert("Name longer than " + maxWishNameLength + " letters, please enter a shorter name!");
      return false;
    } else if (wishNote.length > maxNoteLength) {
      window.alert("Note longer than " + maxNoteLength + " letters, please enter a shorter note!");
      return false;
    } else if (wishPrice.length > maxPriceLength) {
      window.alert("Price longer than " + maxPriceLength + " characters, please enter a shorter price!");
      return false;
    } else if (wishQuantity > maxQuantity) {
      window.alert("Quantity bigger than " + maxQuantity + ", please enter a lower quantity!");
      return false;
    }
    let gallery = document.getElementById('image-gallery');
    let activeSrc = gallery.querySelector('[style="display: initial;"]').getAttribute('src');
    var formData = {};
        formData.image       = await this.#convertImage(activeSrc);
        formData.url         = this.wishUrl;
        formData.wishlistId  = document.getElementById('wishlists').value;
        formData.name        = wishName;
        formData.price       = wishPrice;
        formData.quantity    = wishQuantity;
        formData.note        = wishNote;
    return formData;
  }

  displayWishlists(wishlists, selectedWishlistId, defaultWishlistId) {
    let wishlistsSelector = document.getElementById('wishlists');
    let defaultWishlist = wishlists.find(wishlist => wishlist.id === defaultWishlistId);
    let remainingWishlists = wishlists.filter(wishlist => wishlist.id !== defaultWishlist.id);

    for (let i = 0; i < remainingWishlists.length; i++) {
      wishlistsSelector.insertAdjacentHTML("beforeend", `<option value="${remainingWishlists[i].id}" class="wishlist-option">${remainingWishlists[i].name}</option>`);
    }

    // insert default wishlist at the top
    wishlistsSelector.insertAdjacentHTML("afterbegin", `
      <option value="${defaultWishlist.id}" class="wishlist-option has-background-grey-lighter">
        ${defaultWishlist.name} (default)
      </option>
    `);

    wishlistsSelector.value = selectedWishlistId;
  }

  getCreateWishlistFormData() {
    let name = document.getElementById("create-wishlist-name").value;
    if (name.length < nameMinLength) {
      window.alert("Name cannot be empty, please enter a name!");
      return false
    } else if (name.length > maxWishlistNameLength) {
      window.alert("Name longer than " + maxWishlistNameLength + " letters, please enter a shorter name!");
      return false
    } else {
      let formData = {
        'name': name,
        'newDefault': document.getElementById("create-wishlist-new-default-wishlist").checked
      };
      return formData;
    }
  }

  confirmSave() {
    document.getElementById('content').setAttribute('style', 'display: none !important;');
    document.getElementById('success-message').setAttribute('style', 'display: ;');
  }

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
          console.log(base64); // DEBUG
          resolve(base64);
        });
      } catch (error) {
        console.error("Image couldn't be loaded properly:", error);
        resolve(imageSrc);
      }
    });
  }
}
