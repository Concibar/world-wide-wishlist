function popupViewConnection() {
  console.log("popupView.js connected");
}

class PopupView {
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

  displayScraped(wishlists, selectedWishlistId) {
    document.getElementById('wish-name').value = this.wishName;
    //display the images in the gallery
    let gallery = document.getElementById('image-gallery');
    if (this.imageArray.length > 0) {
      for (var i = 0; i<this.imageArray.length; i++){
        gallery.insertAdjacentHTML("beforeend", `<img style="display: none;" id="${i}" class="img-fit is-align-content-center" src="${this.imageArray[i]}"></img>`);
      }
      document.getElementById('0').setAttribute('style', 'display: initial;');
    }

    this.displayWishlists(wishlists, selectedWishlistId);
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
    let nameMaxLength = 50;
    let nameMinLength = 1;
    if (wishName.length < nameMinLength) {
      window.alert("Name cannot be empty, please enter a name!");
      return false
    } else if (wishName.length > nameMaxLength) {
      window.alert("Name longer than " + nameMaxLength + " letters, please enter a shorter name!");
      return false
    } else {
      let gallery = document.getElementById('image-gallery');
      let activeSrc = gallery.querySelector('[style="display: initial;"]').getAttribute('src');
      var formData = {};
          formData.image       = await this.#convertImage(activeSrc);
          formData.date        = new Date();
          formData.url         = this.wishUrl;
          formData.wishlistId  = document.getElementById('wishlists').value;
          formData.name        = wishName;
          formData.price       = document.getElementById('wish-price').value;
          formData.quantity    = document.getElementById('wish-quantity').value;
          formData.note        = document.getElementById('wish-note').value;
      return formData;
    }
  }

  displayWishlists(wishlists, selectedWishlistId) {
    let wishlistsSelector = document.getElementById('wishlists');
    for (let i = 0; i < wishlists.length; i++) {
      wishlistsSelector.insertAdjacentHTML("afterbegin", `<option value="${wishlists[i].id}" class="wishlist-option">${wishlists[i].name}</option>`);
    }
    wishlistsSelector.value = selectedWishlistId;
  }

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
    }
  }

  confirmSave() {
    document.getElementById('content').innerHTML = `
    <div class="">

      <p>Your wish has been saved successfully!</p>

      <button id="donate" class="button is-link">
        <span class="icon">
          <i class="fa-solid fa-gift"></i>
        </span>
        <span>Go to Wishlists</span>
      </button>
    </div>
    `
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
      // Create an image object from the path
      const originalImage = new Image();
      originalImage.src = imageSrc;
      originalImage.crossOrigin = "anonymous";

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
          console.log(base64);
          resolve(base64);
      });
    });
  }
}
