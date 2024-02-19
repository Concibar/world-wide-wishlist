function popupViewConnection() {
  console.log("popupView.js connected");
};

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
  };

  displayScraped(wishlists) {
    document.getElementById('wish-name').value = this.wishName;
    //display the images in the gallery
    let gallery = document.getElementById('image-gallery');
    for (var i = 0; i<this.imageArray.length; i++){
      gallery.insertAdjacentHTML("beforeend", `<img style="display: none;" id="${i}" class="img-fit is-align-content-center" src="${this.imageArray[i]}"></img>`);
    };
    document.getElementById('0').setAttribute('style', 'display: initial;');

    //display the wishlists
    let wishlistsSelector = document.getElementById('wishlists');
    for (let i = 0; i < wishlists.length; i++) {
      wishlistsSelector.insertAdjacentHTML("afterbegin", `<option value="${wishlists[i].id}">${wishlists[i].name}</option>`);
    };
    //TODO: make sure the default is up and selected
    //TODO: display the price
  };

  displayNext() {
    let gallery = document.getElementById('image-gallery');
    let length = gallery.children.length;
    let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
    let nextId = (activeId + 1) % length;
    document.getElementById(activeId).setAttribute('style', 'display: none;');
    document.getElementById(nextId).setAttribute('style', 'display: initial;');
  };

  displayPrev() {
    let gallery = document.getElementById('image-gallery');
    let length = gallery.children.length;
    let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
    let prevId = (((activeId - 1) % length) < 0) ? (length-1) : ((activeId - 1) % length);
    document.getElementById(activeId).setAttribute('style', 'display: none;');
    document.getElementById(prevId).setAttribute('style', 'display: initial;');
  };

  async getFormData() {
    let gallery = document.getElementById('image-gallery');
    let activeSrc = gallery.querySelector('[style="display: initial;"]').getAttribute('src');
    var formData = {};
        formData.image       = await this.#convertImage(activeSrc);
        formData.date        = new Date();
        formData.url         = this.url;
        formData.wishlistId  = "test wishlist id";
        formData.name        = document.getElementById('wish-name').value;
        formData.price       = document.getElementById('wish-price').value;
        formData.quantity    = document.getElementById('wish-quantity').value;
        formData.note        = document.getElementById('wish-note').value;
    return formData;
  };

  #convertImage(imageSrc) {
    return new Promise((resolve) => {
      //create an image object from the path
      const originalImage = new Image();
      originalImage.src = imageSrc;
      originalImage.crossOrigin = "anonymous";

      //get a reference to the canvas
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      //wait for the image to load
      originalImage.addEventListener('load', () => {

          //get the original image size and aspect ratio
          const originalWidth = originalImage.naturalWidth;
          const originalHeight = originalImage.naturalHeight;
          const aspectRatio = originalWidth/originalHeight;
          var newWidth = 200;
          var newHeight = 200;

          //resize image while keeping the Ratio
          if (originalWidth > originalHeight) {
            newHeight = newWidth * aspectRatio;
          } else {
            newWidth = newHeight/aspectRatio;
          }

          //set the canvas size
          canvas.width = 200;
          canvas.height = 200;

          //render the image
          ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
          const base64 = canvas.toDataURL("image/jpeg").split(';base64,')[1];
          resolve(base64);
      });
    });
  };
};
