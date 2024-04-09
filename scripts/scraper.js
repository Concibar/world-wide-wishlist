import {
  nameMinLength,
  maxWishNameLength,
  maxWishDisplayLength,
  maxWishlistNameLength,
  maxNoteLength,
  maxPriceLength,
  maxQuantity
} from './databaseHandling/dbConfig.js'

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
  }
  let imageSrcs = Array.from(images).filter(isProperPicture).map(image=>image.src);
  return imageSrcs;
}

export default class Scraper {
  title = "";
  url = "";
  imageArray = [];

  constructor() {}

  async scrape() {
    let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
    let tab = tabs[0];

    let frames = await chrome.scripting.executeScript({
      target:{tabId: tab.id, frameIds: [0]},
      func:grabImages
    });

    let srcArray = this.#combineFrames(frames);

    this.title = this.#cutTitle(tab.title);
    this.url = tab.url;
    this.imageArray = srcArray;
  }

  #cutTitle(title) {
    // TODO: extract homeDomain stuff from Titles
    if (title.length > maxWishNameLength) {
      title = title.substring(0,  (maxWishNameLength-3)) + "...";
    }

    return title
  }

  #combineFrames(frames) {
    if (!frames || !frames.length) {
      console.log("Error: Couldn't find any images on the specified page");
      // To-Do: give the no-images-found image placeholder
      // let imageUrls = ["path/to/placeholder.png"]
      // return imageUrls
      return;
    }
    return frames.map(frame => frame.result).reduce((r1, r2) => r1.concat(r2));
  }

}
