function scraperConnection() {
  console.log("scraper.js is connected");
};

function grabImages() {
  const images = document.querySelectorAll("img");
  return Array.from(images).map(image=>image.src);
};

class Scraper {
  title = "";
  url ="";
  imageArray = [];
  price = 0;
  currency = "TES"; //To-Do: Scraper needs to scrape for currency otherwise default currency

  constructor() {};
  // To-Do: Scrape for price and currency
  // To-Do: Implement a scalable special scraper call for specific URLs (Amazon, Ali-Express, Etsy, Ebay)
  // To-Do: Implement affiliate link conversion for websites that have that service
  // To-Do: Filter images for more uesfull ones
  // To-Do: Filter SRC for evil scripts


  async scrape() {
    let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
    let tab = tabs[0];

    let frames = await chrome.scripting.executeScript({
      target:{tabId: tab.id, allFrames: true },
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
