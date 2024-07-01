import uuid from '../databaseHandling/uuid7.mjs'
import Wish from './wish.mjs'

export default class Currency {
  #id;
  #name;
  #code;
  #sign = "";
  #favorite = false;

  constructor({id,name,code,sign,favorite}) {
    this.#id = id;
    this.#name = name;
    this.#code = code;
    this.#sign = sign;
    this.#favorite = favorite;
  }

  get id() {return this.#id}
  get name() {return this.#name}
  get code() {return this.#code}
  get sign() {return this.#sign}
  get favorite() {return this.#favorite}

  async save() {
    if (!(this.#id == null)) {
      console.log("error: tried to save a currency with existing id")
      return
    }
    if ((this.#name == null) || (this.#code == null)) {
      console.log("error: tried to save a currency without name or code")
      return
    }

    this.#id = uuid()

    let currencyData = {
      "id": this.#id,
      "name": this.#name,
      "code": this.#code,
      "sign": this.#sign,
      "favorite": this.#favorite
    }

    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;

    currencies.push(currencyData);
    await chrome.storage.local.set({'currencies': currencies});
    return this;
  }

  async delete() {
    if ((this.#id.length == 3) || (this.#id == null)) {
      console.log("error: currency couldn't be deleted due to non proper id");
      return
    }
    // TODO: reset prices of wishes with this currency
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    let filteredCurrencies = currencies.filter(obj => obj.id !== this.#id);
    await chrome.storage.local.set({'currencies': filteredCurrencies});
  }

  async update({name,code,sign,favorite}) {
    if ((this.#id.length == 3) || (this.#id == null)) {
      console.log("error: currency couldn't be updated due to improper id")
      return
    }

    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;

    if (name != null) {this.#name = name}
    if (code != null) {this.#code = code}
    if (sign != null) {this.#sign = sign}
    if (favorite != null) {this.#favorite = favorite}

    let currencyData = {
      "id": this.#id,
      "name": this.#name,
      "code": this.#code,
      "sign": this.#sign,
      "favorite": this.#favorite
    }

    let filteredCurrencies = currencies.filter(obj => obj.id !== this.#id);
    filteredCurrencies.push(currencyData);
    await chrome.storage.local.set({'currencies': filteredCurrencies});
    return this;
  }

  async setAsDefaultCurrency() {
    if (this.#id == null) {
      console.log('error: cannot set an unsaved currency as default currency')
      return
    };
    await chrome.storage.local.set({'defaultCurrencyId': this.#id});
  }

  // Class Methods

  static async getDefaultCurrency() {
    let result = await chrome.storage.local.get('defaultCurrencyId');
    let defaultCurrencyId = result.defaultCurrencyId;
    let defaultCurrency = await Currency.read(defaultCurrencyId);
    return defaultCurrency;
  }

  static async read(currencyId) {
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    let currencyData = currencies.find(currency => currency.id == currencyId);
    return new Currency(currencyData);
  }

  static async readAll() {
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;

    function sortByCodeDesc(a,z) { a.code.localeCompare(z.code) };

    let favoriteCurrencies = currencies.filter(currency => currency.favorite == true);
    let sortedFavoriteCurrencies = favoriteCurrencies.sort(sortByCodeDesc(a,z));
    let nonFavoriteCurrencies = currencies.filter(currency => currency.favorite == false);
    let sortedNonFavoriteCurrencies = nonFavoriteCurrencies.sort(sortByCodeDesc(a,z));

    let filteredCurrencies = {
      favorite: sortedFavoriteCurrencies,
      nonFavorite: sortedNonFavoriteCurrencies
    };

    return filteredCurrencies;
  }
}
