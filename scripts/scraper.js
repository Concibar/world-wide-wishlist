function scraperConnection() {
  console.log("Scraper reports for duty!");
};

// To-Do: try to scrape for price and currency
// To-Do: implement a scalable special scraper call for specific URLs (Amazon, Ali-Express, Etsy, Ebay)
// To-Do: Try to filter images for more uesfull ones

async function scrape() {
  let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  let tab = tabs[0];

  let frames = await chrome.scripting.executeScript({
    target:{tabId: tab.id, allFrames: true },
    func:grabImages
  });

  let scraped = {
    name:  tab.title,
    url: tab.url,
    imageArray: combineFrames(frames),
    price_in_cents: 0
  };
  console.log(scraped)
  return scraped;
};

// private functions
function grabImages() {
  const images = document.querySelectorAll("img");
  return Array.from(images).map(image=>image.src);
};

function combineFrames(frames) {
  if (!frames || !frames.length) {
    alert("Error: Couldn't find any images on the specified page");
    // To-Do: give the no-images-found image placeholder
    // let imageUrls = ["path/to/placeholder.png"]
    // return imageUrls
    return;
  };
  return frames.map(frame => frame.result).reduce((r1, r2) => r1.concat(r2));
};


  // let originalImage = document.querySelector(`src=${scraped.images[0]}`);
