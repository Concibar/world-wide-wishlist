import Wishlist from '../models/wishlist.mjs'

const manifest = chrome.runtime.getManifest()
export const manifestVersion = manifest.version

export async function checkDBschema() {
  let result = await chrome.storage.local.get('versionNumber')
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
  await chrome.storage.local.set({'versionNumber': manifestVersion})
  console.log("versionNumber set to " + manifestVersion)

  // check and set settings
  let settingsResult = await chrome.storage.local.get('settings')
  if (settingsResult.settings == undefined) {
    await chrome.storage.local.set({'settings': {
      "currencyConversion": false,
      "convertToCurrencyId": "EUR"
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
        "favorite": true
      },
      {
        "id": "JPY",
        "name": "Japanese Yen",
        "code": "JPY",
        "sign": "¥",
        "favorite": true
      },
      {
        "id": "BGN",
        "name": "Bulgarian Lev",
        "code": "BGN",
        "sign": "лв",
        "favorite": false
      },
      {
        "id": "CZK",
        "name": "Czech Koruna",
        "code": "CZK",
        "sign": "Kč",
        "favorite": false
      },
      {
        "id": "DKK",
        "name": "Danish Krone",
        "code": "DKK",
        "sign": "kr",
        "favorite": false
      },
      {
        "id": "GBP",
        "name": "Pound Sterling",
        "code": "GBP",
        "sign": "£",
        "favorite": true
      },
      {
        "id": "HUF",
        "name": "Hungarian Forint",
        "code": "HUF",
        "sign": "Ft",
        "favorite": false
      },
      {
        "id": "PLN",
        "name": "Polish Złoty",
        "code": "PLN",
        "sign": "zł",
        "favorite": false
      },
      {
        "id": "RON",
        "name": "Romanian Leu",
        "code": "RON",
        "sign": false,
        "favorite": false
      },
      {
        "id": "SEK",
        "name": "Swedish Krona",
        "code": "SEK",
        "sign": "kr",
        "favorite": false
      },
      {
        "id": "CHF",
        "name": "Swiss Franc",
        "code": "CHF",
        "sign": false,
        "favorite": false
      },
      {
        "id": "ISK",
        "name": "Icelandic Krona",
        "code": "ISK",
        "sign": "kr",
        "favorite": false
      },
      {
        "id": "NOK",
        "name": "Norwegian Krone",
        "code": "NOK",
        "sign": "kr",
        "favorite": false
      },
      {
        "id": "TRY",
        "name": "Turkish Lira",
        "code": "TRY",
        "sign": "₺",
        "favorite": false
      },
      {
        "id": "AUD",
        "name": "Australian Dollar",
        "code": "AUD",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "BRL",
        "name": "Brazilian Real",
        "code": "BRL",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "CAD",
        "name": "Canadian Dollar",
        "code": "CAD",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "CNY",
        "name": "Chinese Yuan Renminbi",
        "code": "CNY",
        "sign": "¥",
        "favorite": false
      },
      {
        "id": "HKD",
        "name": "Hong Kong Dollar",
        "code": "HKD",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "IDR",
        "name": "Indonesian Rupiah",
        "code": "IDR",
        "sign": "Rp",
        "favorite": false
      },
      {
        "id": "ILS",
        "name": "Israeli Shekel",
        "code": "ILS",
        "sign": "₪",
        "favorite": false
      },
      {
        "id": "INR",
        "name": "Indian Rupee",
        "code": "INR",
        "sign": "₹",
        "favorite": false
      },
      {
        "id": "KRW",
        "name": "South Korean Won",
        "code": "KRW",
        "sign": "₩",
        "favorite": false
      },
      {
        "id": "MXN",
        "name": "Mexican Peso",
        "code": "MXN",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "MYR",
        "name": "Malaysian Ringgit",
        "code": "MYR",
        "sign": "RM",
        "favorite": false
      },
      {
        "id": "NZD",
        "name": "New Zealand Dollar",
        "code": "NZD",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "PHP",
        "name": "Philippine Peso",
        "code": "PHP",
        "sign": "₱",
        "favorite": false
      },
      {
        "id": "SGD",
        "name": "Singapore Dollar",
        "code": "SGD",
        "sign": "$",
        "favorite": false
      },
      {
        "id": "THB",
        "name": "Thai Baht",
        "code": "THB",
        "sign": "฿",
        "favorite": false
      },
      {
        "id": "ZAR",
        "name": "South African Rand",
        "code": "ZAR",
        "sign": "R",
        "favorite": false
      },
      {
        "id": "EUR",
        "name": "Euro",
        "code": "EUR",
        "sign": "€",
        "favorite": true
      }
    ]})
    console.log("currencies set to default")
  }

  // check and set defaultCurrencyId
  let defCurrencyResult = await chrome.storage.local.get('defaultCurrencyId')
  if (defCurrencyResult.defaultCurrencyId == undefined) {
    await chrome.storage.local.set({'defaultCurrencyId': 'EUR'})
    console.log("defaultCurrencyId set to default")
  }

  // check and set defaultWishlistId
  let defWishlistResult = await chrome.storage.local.get('defaultWishlistId')
  if (defWishlistResult.defaultWishlistId == undefined) {
    await chrome.storage.local.set({'defaultWishlistId': ''})
    console.log("defaultWishlistId set to writeable")
  }

  // check and set wishlists
  let wishlistsResult = await chrome.storage.local.get('wishlists')
  if (wishlistsResult.wishlists == undefined) {
    await chrome.storage.local.set({'wishlists': []})
    console.log("wishlists set to writeable")
  }

  // check and set wishes
  let wishesResult = await chrome.storage.local.get('wishes')
  if (wishesResult.wishes == undefined) {
    await chrome.storage.local.set({'wishes': []})
    console.log("wishes set to writeable")
  }

  // create 3 starting Wishlists and set default Wishlist
  let defaultWishlist = new Wishlist({'name': "World Wide Wishlist"})
  await defaultWishlist.save()
  await defaultWishlist.setAsDefaultWishlist();
  let secondWishlist = new Wishlist({name: "Hobby needs"})
  await secondWishlist.save()
  let thirdWishlist = new Wishlist({name: "Ideas for Friends"})
  await thirdWishlist.save()
}

async function migrateDatabase() {
  let result = await chrome.storage.local.get('versionNumber');
  let databaseVersion = result.versionNumber;
  console.log("Update detected, migration started from version " + databaseVersion + " to version " + manifestVersion);
  if (databaseVersion <= '1.0.2') {
    let oldVersion = databaseVersion;
    databaseVersion = '1.0.2';
    console.log("starting migration from " + oldVersion + " to " + databaseVersion);
    await chrome.storage.local.set({'versionNumber': databaseVersion});
    console.log("migration from " + oldVersion + " to " + databaseVersion + " finished");
  }
  // TODO: migration for the prices
}
