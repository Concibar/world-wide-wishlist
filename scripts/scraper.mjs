import {
  maxWishNameLength
} from './databaseHandling/dbConfig.mjs'

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
    let ratio = element.height / element.width;
    if (ratio >= 3 || ratio <= 1/3) return false;
    if (window.getComputedStyle(element).visibility === "hidden") return false;
    if (window.getComputedStyle(element).display === "none") return false;
    if (hasWeirdPictureExtension(element)) return false;
    return true;
  }
  let imageSrcs = Array.from(images).filter(isProperPicture).map(image=>image.currentSrc);
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
    await this.#ensureTabHasLoaded(tab);

    let frames = await chrome.scripting.executeScript({
      target:{tabId: tab.id, frameIds: [0]},
      func:grabImages
    });

    let srcArray = this.#combineFrames(frames);

    this.title = this.#cutTitle(tab.title);
    this.url = tab.url;
    this.imageArray = srcArray;
  }

  async #ensureTabHasLoaded(tab) {
    return new Promise((resolve) => {
        if (tab.status === 'complete') {
            resolve(true);
        } else {
            chrome.tabs.onUpdated.addListener((id, info, tab) => {
                if (info.status === 'complete' && id === tab.id) {
                  resolve(true);
                }
            });
        }
    });
}

  #cutTitle(title) {
    if (title.length > maxWishNameLength) {
      title = title.substring(0,  (maxWishNameLength-3)) + "...";
    }

    return title
  }

  #combineFrames(frames) {
    if (!frames || !frames.length) {
      console.log("Error: Couldn't find any images on the specified page");
      return;
    }
    return frames.map(frame => frame.result).reduce((r1, r2) => r1.concat(r2));
  }

}
