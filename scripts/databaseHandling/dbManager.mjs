import Wishlist from '../models/wishlist.mjs';
import Wish from '../models/wish.mjs';

const manifestVersion = chrome.runtime.getManifest().version

export async function checkDBschema() {
  let result = await chrome.storage.local.get('versionNumber');
  let databaseVersion = result.versionNumber;
  if (databaseVersion == undefined) {
    await setupDatabase()
  } else if (databaseVersion < manifestVersion) {
    await migrateDatabase()
  } else if (databaseVersion == manifestVersion) {
    console.log("database is up to date, no update required")
  }
}

async function setupDatabase() {
  // check and set VersionNumber
  console.log("setup of local storage started")
  let versionNumberResult = await chrome.storage.local.get('versionNumber');
  if (versionNumberResult.versionNumber == undefined) {
    await chrome.storage.local.set({'versionNumber': manifestVersion})
    console.log("versionNumber set to " + manifestVersion)
  }

  // check and set defaultWishlistId
  let defWishlistResult = await chrome.storage.local.get('defaultWishlistId')
  if (defWishlistResult.defaultWishlistId == undefined) {
    await chrome.storage.local.set({'defaultWishlistId': ''})
    console.log("defaultWishlistId set to writeable")
  }

  // check and set defaultCurrencyId
  let defCurrencyResult = await chrome.storage.local.get('defaultCurrencyId')
  if (defCurrencyResult.defaultCurrencyId == undefined) {
    await chrome.storage.local.set({'defaultCurrencyId': 'EUR'})
    console.log("defaultCurrencyId set to default")
  }

  // check and set conversionCurrencyId
  let convCurrencyResult = await chrome.storage.local.get('conversionCurrencyId')
  if (convCurrencyResult.conversionCurrencyId == undefined) {
    await chrome.storage.local.set({'conversionCurrencyId': 'EUR'})
    console.log("conversionCurrencyId set to default")
  }

  // check and set settings to default
  let settingsResult = await chrome.storage.local.get('settings')
  if (settingsResult.settings == undefined) {
    await chrome.storage.local.set({'settings': {
      "orderWishlistsBy": "alphaNumAscending"
    }})
    console.log("settings set to default")
  }

  // check and set currencies
  let currenciesResult = await chrome.storage.local.get('currencies')
  if (currenciesResult.currencies == undefined) {
    await chrome.storage.local.set({'currencies': [
      {
        "id": "USD",
        "name": "United States Dollar",
        "code": "USD",
        "sign": "$",
        "favored": true
      },
      {
        "id": "JPY",
        "name": "Japanese Yen",
        "code": "JPY",
        "sign": "¥",
        "favored": true
      },
      {
        "id": "BGN",
        "name": "Bulgarian Lev",
        "code": "BGN",
        "sign": "лв",
        "favored": false
      },
      {
        "id": "CZK",
        "name": "Czech Koruna",
        "code": "CZK",
        "sign": "Kč",
        "favored": false
      },
      {
        "id": "DKK",
        "name": "Danish Krone",
        "code": "DKK",
        "sign": "kr",
        "favored": false
      },
      {
        "id": "GBP",
        "name": "Pound Sterling",
        "code": "GBP",
        "sign": "£",
        "favored": true
      },
      {
        "id": "HUF",
        "name": "Hungarian Forint",
        "code": "HUF",
        "sign": "Ft",
        "favored": false
      },
      {
        "id": "PLN",
        "name": "Polish Złoty",
        "code": "PLN",
        "sign": "zł",
        "favored": false
      },
      {
        "id": "RON",
        "name": "Romanian Leu",
        "code": "RON",
        "sign": false,
        "favored": false
      },
      {
        "id": "SEK",
        "name": "Swedish Krona",
        "code": "SEK",
        "sign": "kr",
        "favored": false
      },
      {
        "id": "CHF",
        "name": "Swiss Franc",
        "code": "CHF",
        "sign": false,
        "favored": false
      },
      {
        "id": "ISK",
        "name": "Icelandic Krona",
        "code": "ISK",
        "sign": "kr",
        "favored": false
      },
      {
        "id": "NOK",
        "name": "Norwegian Krone",
        "code": "NOK",
        "sign": "kr",
        "favored": false
      },
      {
        "id": "TRY",
        "name": "Turkish Lira",
        "code": "TRY",
        "sign": "₺",
        "favored": false
      },
      {
        "id": "AUD",
        "name": "Australian Dollar",
        "code": "AUD",
        "sign": "$",
        "favored": false
      },
      {
        "id": "BRL",
        "name": "Brazilian Real",
        "code": "BRL",
        "sign": "$",
        "favored": false
      },
      {
        "id": "CAD",
        "name": "Canadian Dollar",
        "code": "CAD",
        "sign": "$",
        "favored": false
      },
      {
        "id": "CNY",
        "name": "Chinese Yuan Renminbi",
        "code": "CNY",
        "sign": "¥",
        "favored": false
      },
      {
        "id": "HKD",
        "name": "Hong Kong Dollar",
        "code": "HKD",
        "sign": "$",
        "favored": false
      },
      {
        "id": "IDR",
        "name": "Indonesian Rupiah",
        "code": "IDR",
        "sign": "Rp",
        "favored": false
      },
      {
        "id": "ILS",
        "name": "Israeli Shekel",
        "code": "ILS",
        "sign": "₪",
        "favored": false
      },
      {
        "id": "INR",
        "name": "Indian Rupee",
        "code": "INR",
        "sign": "₹",
        "favored": false
      },
      {
        "id": "KRW",
        "name": "South Korean Won",
        "code": "KRW",
        "sign": "₩",
        "favored": false
      },
      {
        "id": "MXN",
        "name": "Mexican Peso",
        "code": "MXN",
        "sign": "$",
        "favored": false
      },
      {
        "id": "MYR",
        "name": "Malaysian Ringgit",
        "code": "MYR",
        "sign": "RM",
        "favored": false
      },
      {
        "id": "NZD",
        "name": "New Zealand Dollar",
        "code": "NZD",
        "sign": "$",
        "favored": false
      },
      {
        "id": "PHP",
        "name": "Philippine Peso",
        "code": "PHP",
        "sign": "₱",
        "favored": false
      },
      {
        "id": "SGD",
        "name": "Singapore Dollar",
        "code": "SGD",
        "sign": "$",
        "favored": false
      },
      {
        "id": "THB",
        "name": "Thai Baht",
        "code": "THB",
        "sign": "฿",
        "favored": false
      },
      {
        "id": "ZAR",
        "name": "South African Rand",
        "code": "ZAR",
        "sign": "R",
        "favored": false
      },
      {
        "id": "EUR",
        "name": "Euro",
        "code": "EUR",
        "sign": "€",
        "favored": true
      }
    ]})
    console.log("currencies set to default")
  }

  // check and set conversionRatesDate
  let conversionRatesDateResult = await chrome.storage.local.get('conversionRatesDate');
  if (conversionRatesDateResult.conversionRatesDate == undefined) {
    await chrome.storage.local.set({"conversionRatesDate": "1111-11-11",})
  }

  // check and set conversionRates
  let conversionRatesResult = await chrome.storage.local.get('conversionRates')
  if (conversionRatesResult.conversionRates == undefined) {
    await chrome.storage.local.set({"conversionRates": {
    "EUR": 1,
    "USD": 0,
    "JPY": 0,
    "BGN": 0,
    "CZK": 0,
    "DKK": 0,
    "GBP": 0,
    "HUF": 0,
    "PLN": 0,
    "RON": 0,
    "SEK": 0,
    "CHF": 0,
    "ISK": 0,
    "NOK": 0,
    "TRY": 0,
    "AUD": 0,
    "BRL": 0,
    "CAD": 0,
    "CNY": 0,
    "HKD": 0,
    "IDR": 0,
    "ILS": 0,
    "INR": 0,
    "KRW": 0,
    "MXN": 0,
    "MYR": 0,
    "NZD": 0,
    "PHP": 0,
    "SGD": 0,
    "THB": 0,
    "ZAR": 0
  },})
  }

  // check and set wishlists
  let wishlistsResult = await chrome.storage.local.get('wishlists')
  if (wishlistsResult.wishlists == undefined) {
    await chrome.storage.local.set({'wishlists': []})
    console.log("wishlists set to writeable")
    // create 3 starting Wishlists and set default Wishlist
    let defaultWishlist = new Wishlist({'name': "World Wide Wishlist"})
    await defaultWishlist.save()
    await defaultWishlist.setAsDefaultWishlist();
    let secondWishlist = new Wishlist({name: "Hobby needs"})
    await secondWishlist.save()
    let thirdWishlist = new Wishlist({name: "Gifts for Friends"})
    await thirdWishlist.save()
  }

  // check and set wishes
  let wishesResult = await chrome.storage.local.get('wishes')
  if (wishesResult.wishes == undefined) {
    await chrome.storage.local.set({'wishes': []})
    console.log("wishes set to writeable")
  }
}

export async function migrateDatabase() {
  let result = await chrome.storage.local.get('versionNumber');
  let databaseVersion = result.versionNumber;
  console.log("Update detected, migration started from version " + databaseVersion + " to version " + manifestVersion);
  if (databaseVersion <= '1.1.2') {
    let oldVersion = databaseVersion;
    databaseVersion = '1.1.2';
    console.log("starting migration from " + oldVersion + " to " + databaseVersion);
    await setupDatabase()
    await chrome.storage.local.set({'versionNumber': databaseVersion});
    let wishesResult = await chrome.storage.local.get('wishes');
    let wishes = wishesResult.wishes;
    for (let i = 0; i < wishes.length; i++) {
      let wish = new Wish(wishes[i]);
      let noteWithPrice = wish.note + " old Price: " + wish.price;
      await wish.update({
        note: noteWithPrice,
        price: 0,
        currencyId: "EUR"
      })
    }
    let wishlistsResult = await chrome.storage.local.get('wishlists');
    let wishlists = wishlistsResult.wishlists;
    for (let i = 0; i < wishlists.length; i++) {
      let wishlist = new Wishlist(wishlists[i]);
      await wishlist.update();
    }
    console.log("migration from " + oldVersion + " to " + databaseVersion + " finished");
  }
}
