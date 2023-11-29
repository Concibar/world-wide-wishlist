function popupConnection() {
  console.log("Viewer reports for duty!");
};

function display(scraped) {
  document.getElementById('wish-name').value = scraped.name;

  let gallery = document.getElementById('image-gallery');
  for (i = 0; i<scraped.imageArray.length; i++){
    gallery.insertAdjacentHTML("beforeend", `<img style="display: none;" id="${i}" class="img-fit is-align-content-center" src="${scraped.imageArray[i]}"></img>`);
  }
  document.getElementById('0').setAttribute('style', 'display: initial;')
}

function displayNext() {
  let gallery = document.getElementById('image-gallery');
  let length = gallery.children.length;
  let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
  let nextId = (activeId + 1) % length;
  document.getElementById(activeId).setAttribute('style', 'display: none;');
  document.getElementById(nextId).setAttribute('style', 'display: initial;');
}

function displayPrev() {
  let gallery = document.getElementById('image-gallery');
  let length = gallery.children.length;
  let activeId = Number(gallery.querySelector('[style="display: initial;"]').id);
  let prevId = (((activeId - 1) % length) < 0) ? (length-1) : ((activeId - 1) % length);
  document.getElementById(activeId).setAttribute('style', 'display: none;');
  document.getElementById(prevId).setAttribute('style', 'display: initial;');
}
