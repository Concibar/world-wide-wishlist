function scraperConnection() {
  console.log("scraper.js is connected");
};

function grabImages() {
  const images = document.querySelectorAll("img");
  function hasWeirdPictureExtension(element) {
    /\.(avif|gif|svg)$/.test(element.src);
  }
  function isProperPicture(element) {
    if (element.src == null) return false;
    if (element.height <= 50) return false;
    if (element.naturalHeight <= 50) return false;
    if (element.offsetHeight <= 50) return false;
    if (element.width <= 50) return false;
    if (element.naturalWidth <= 50) return false;
    if (element.offsetWidth <= 50) return false;
    if (window.getComputedStyle(element).visibility === "hidden") return false;
    if (window.getComputedStyle(element).display === "none") return false;
    if (hasWeirdPictureExtension(element)) return false;
    return true;
  };
  return Array.from(images).filter(isProperPicture).map(image=>image.src);
};

function logFrameInfo(framesInfo) {
  for (const frameInfo of framesInfo) {
    console.log(frameInfo);
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

class Scraper {
  title = "";
  url ="";
  imageArray = [];
  price = 0;
  currency = "TES"; //TODO: Scraper needs to scrape for currency otherwise default currency

  constructor() {};
  // TODO: Scrape for price and currency
  // TODO: Implement a scalable special scraper call for specific URLs (Amazon, Ali-Express, Etsy, Ebay)
  // TODO: Implement affiliate link conversion for websites that have that service (amazon, ebay)
  // TODO: Filter SRC for evil scripts

  async scrape() {
    let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
    let tab = tabs[0];

    let frames = await chrome.scripting.executeScript({
      target:{tabId: tab.id, frameIds: [0]},
      func:grabImages
    });

    let srcArray = this.#combineFrames(frames);

    this.title = tab.title;
    this.url = tab.url;
    this.imageArray = srcArray;
    this.price = "to-do: scrape price";
    this.currency = "to-do: scrape currency";
    };

  #combineFrames(frames) {
      if (!frames || !frames.length) {
        alert("Error: Couldn't find any images on the specified page");
        // To-Do: give the no-images-found image placeholder
        // let imageUrls = ["path/to/placeholder.png"]
        // return imageUrls
        return;
      };
      return frames.map(frame => frame.result).reduce((r1, r2) => r1.concat(r2));
    };

  };
