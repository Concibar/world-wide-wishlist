function popupConnection() {
  console.log("popupView.js connected");
};

function display(scraper) {
  document.getElementById('wish-name').value = scraper.title;
  let imageArray = scraper.imageArray;
  let gallery = document.getElementById('image-gallery');

  for (i = 0; i<imageArray.length; i++){
    gallery.insertAdjacentHTML("beforeend", `<img style="display: none;" id="${i}" class="img-fit is-align-content-center" src="${imageArray[i]}"></img>`);
  };
  document.getElementById('0').setAttribute('style', 'display: initial;');
};

function displayNext() {
  let gallery = document.getElementById('image-gallery');
  let length = gallery.children.length;
  let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
  let nextId = (activeId + 1) % length;
  document.getElementById(activeId).setAttribute('style', 'display: none;');
  document.getElementById(nextId).setAttribute('style', 'display: initial;');
};

function displayPrev() {
  let gallery = document.getElementById('image-gallery');
  let length = gallery.children.length;
  let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
  let prevId = (((activeId - 1) % length) < 0) ? (length-1) : ((activeId - 1) % length);
  document.getElementById(activeId).setAttribute('style', 'display: none;');
  document.getElementById(prevId).setAttribute('style', 'display: initial;');
};

function getFormData() {
  let formData = {};
      formData.wishlistId = "test wishlist id";
      formData.name = document.getElementById('wish-name').value;
      formData.url = "test url";
      formData.image = "asdf";
      formData.price = document.getElementById('wish-price').value;
      formData.currency = "test EUR";
      formData.quantity = document.getElementById('wish-quantity').value;
      formData.note = document.getElementById('wish-notes').value;
      formData.date = new Date();

  return formData;
};
