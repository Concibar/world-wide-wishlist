function popupConnection() {
  console.log("Viewer reports for duty!");
};

function display(scraped) {
  document.getElementById('wish-name').innerText = scraped.name;
  document.getElementById('wish-url').innerText = scraped.url;

  let wishImages = document.getElementById('wish-img');
  for (i = 0; i<scraped.imageArray.length; i++){
    wishImages.insertAdjacentHTML("beforeend", `<img id="${i}" src="${scraped.imageArray[i]}"></img>`);
  }

  // To-Do: put images as images into gallery
}
