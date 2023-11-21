function scraperConnection() {
  console.log("Scraper reports for duty!");
};

async function scrape() {
  let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  let tab = tabs[0];

  let frames = await chrome.scripting.executeScript({
    target:{tabId: tab.id, allFrames: true },
    func:grabImages
  });

  let title = tab.title;
  let url = tab.url;
  let images = combineFrames(frames);

  let scraped = {
    tilte:  title,
    url: url,
    images: images
  }
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
