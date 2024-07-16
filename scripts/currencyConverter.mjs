import Currency from "./models/currency.mjs";

// ASYNC because this is an API
// error handling because this is an API

export async function fetchAndUpdateCurrencyRatesOnceDaily() {
  if (await areRatesUpToDate()) { return };

  var ratesObject = {};
  ratesObject["EUR"] = 1;
  try {
    const response = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const str = await response.text();

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(str, "text/xml");

    let cubeElements = xmlDoc.querySelectorAll("Cube > Cube");
    cubeElements.forEach(cubeElement => {
      if (cubeElement.hasAttribute("currency") && cubeElement.hasAttribute("rate")) {
        let currency = cubeElement.getAttribute("currency");
        let rate = parseFloat(cubeElement.getAttribute("rate"));
        ratesObject[currency] = rate;
      }
    });
    chrome.storage.local.set({'conversionRates': ratesObject})
  } catch (error) { console.error("Error:", error) }
}

async function areRatesUpToDate() {
  let today = new Date().toISOString().split("T")[0];
  let result = await chrome.storage.local.get('conversionRatesDate');
  let conversionRatesDate = result.conversionRatesDate;

  if (today === conversionRatesDate) {
    return true;
  } else {
    await chrome.storage.local.set({'conversionRatesDate': today})
    return false;
  }
}

export async function sumAndConvert(wishes) {
  // get handed the unthankful job in form of an Array of wishes
  let conversionCurrency = await Currency.getConversionCurrency();
  let ratesResult = await chrome.storage.local.get('conversionRates');
  let rates = ratesResult.conversionRates;
  let currencies = await Currency.getAllCurrencies();
  let sumsByCurrency = {}
  sumsByCurrency.total = 0;
  currencies.forEach((currency) => {
    sumsByCurrency[currency.code] = 0;
  })
  wishes.forEach((wish) => {
    if (wish.price > 0) {
      sumsByCurrency[wish.currencyId] = sumsByCurrency[wish.currencyId] + wish.price;
      sumsByCurrency.total = sumsByCurrency.total + (wish.price / rates[wish.currencyId]) * rates[conversionCurrency.code];
    }
  })
  sumsByCurrency.total = Math.round(sumsByCurrency.total * 100)/100;
  return sumsByCurrency;
}
