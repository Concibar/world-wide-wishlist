function popupConnection() {
  console.log("Viewer reports for duty!");
};

function display(scraped) {
  document.getElementById('wish-name').innerText = scraped.title;
  document.getElementById('wish-url').innerText = scraped.url;
  // To-Do: put images as images into gallery
  document.getElementById('paste-src').innerText = scraped.images.join("\n");
}
