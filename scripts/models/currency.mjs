import uuid from '../databaseHandling/uuid7.mjs'
import Wish from './wish.mjs'

export default class Currency {
  #id;
  #name;
  #code;
  #sign = "";
  #favored = false;

  constructor({id,name,code,sign,favored}) {
    this.#id = id;
    this.#name = name;
    this.#code = code;
    this.#sign = sign;
    this.#favored = favored;
  }

  get id() {return this.#id}
  get name() {return this.#name}
  get code() {return this.#code}
  get sign() {return this.#sign}
  get favored() {return this.#favored}

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

  static async getConversionCurrency() {
    let result = await chrome.storage.local.get('conversionCurrencyId');
    let conversionCurrencyId = result.conversionCurrencyId;
    let conversionCurrency = await Currency.read(conversionCurrencyId);
    return conversionCurrency;
  }

  static async read(currencyId) {
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    let currencyData = currencies.find(currency => currency.id == currencyId);
    return new Currency(currencyData);
  }

  static async getCurrenciesByType() {
    const sortByCodeDesc = (a,z) => a.code.localeCompare(z.code);
    let defaultCurrency = await Currency.getDefaultCurrency();

    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    currencies.splice(currencies.findIndex((currency) => {return currency.id === defaultCurrency.id}), 1);

    let favoredCurrencies = currencies.filter(currency => currency.favored == true);
    let sortedFavoredCurrencies = favoredCurrencies.sort(sortByCodeDesc);
    let nonFavoredCurrencies = currencies.filter(currency => currency.favored == false);
    let sortedNonFavoredCurrencies = nonFavoredCurrencies.sort(sortByCodeDesc);

    let currenciesbyType = {
      default: defaultCurrency,
      favored: sortedFavoredCurrencies,
      nonFavored: sortedNonFavoredCurrencies
    };
    return currenciesbyType;
  }

  static async getAllCurrencies() {
    const sortByCodeDesc = (a,z) => a.code.localeCompare(z.code);
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    let sortedCurrencies = currencies.sort(sortByCodeDesc);
    return sortedCurrencies;
  }

  static async getFavoredCurrencies() {
    const sortByCodeDesc = (a,z) => a.code.localeCompare(z.code);
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    let favoredCurrencies = currencies.filter(currency => currency.favored == true);
    let sortedFavoredCurrencies = favoredCurrencies.sort(sortByCodeDesc);
    return sortedFavoredCurrencies;
  }

  static async getNonFavoredCurrencies() {
    const sortByCodeDesc = (a,z) => a.code.localeCompare(z.code);
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencies = currenciesResult.currencies;
    let nonFavoredCurrencies = currencies.filter(currency => currency.favored == false);
    let sortedNonFavoredCurrencies = nonFavoredCurrencies.sort(sortByCodeDesc);
    return sortedNonFavoredCurrencies;
  }
}
