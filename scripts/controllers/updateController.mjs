import View from "../views/updateView.mjs";

document.addEventListener('DOMContentLoaded', async function () {
  const view = new View();

  // Donate to the Developer Button
  const donateButton = document.getElementById('donate');
  donateButton.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });

  // Open MyWishlists in current Tab
  function openWishlists() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('html/mywishlist.html')});
    });
  };
  const wishlistsButton = document.getElementById('go-to-wishlists-button');
  const logo = document.getElementById('logo-and-title');
  wishlistsButton.addEventListener('click', () => {
    openWishlists();
  }, false);
  logo.addEventListener('click', () => {
    openWishlists();
  }, false);

  async function currencyAPI() {
    const display = document.getElementById('currencyAPI');
    var ratesObject = {};
    ratesObject["EUR"] = 1;
    try {
      // Fetch XML data from the ECB URL
      const response = await fetch("https://www.ecb.int/stats/eurofxref/eurofxref-daily.xml");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const str = await response.text(); // Convert the response body to text

      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(str, "text/xml"); // Parse the XML

      // Extract currency rates
      let cubeElements = xmlDoc.querySelectorAll("Cube > Cube");

      cubeElements.forEach(cubeElement => {
        // Check if both 'currency' and 'rate' attributes exist
        if (cubeElement.hasAttribute("currency") && cubeElement.hasAttribute("rate")) {
          let currency = cubeElement.getAttribute("currency");
          let rate = parseFloat(cubeElement.getAttribute("rate"));

          // Add the currency and rate to the ratesObject
          ratesObject[currency] = rate;
        }
      });

      // Display the result
      display.textContent = JSON.stringify(ratesObject, null, 2); // Pretty-print the object
    } catch (error) {
      console.error("Error:", error);
      const display = document.getElementById('currencyAPI');
      display.textContent = "Failed to load currency rates.";
    }
    // I have 123 USD and want to know how much JPY that would be
    // 123 USD to EUR; USD / EUR = EUR ammount
    // EUR to JPY EUR * JPY-rate = JPY ammount

  }
  currencyAPI()
});
