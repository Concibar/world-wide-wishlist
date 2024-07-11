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

  static async getCurrency(currencyId) {
    let currencies = await Currency.getAllCurrencies();
    let currency = currencies.find(currency => currency.id == currencyId);
    return currency;
  }

  static async getAllCurrencies() {
    const sortByCodeDesc = (a,z) => a.code.localeCompare(z.code);
    let currenciesResult = await chrome.storage.local.get(['currencies']);
    let currencyElements = currenciesResult.currencies;
    let currencies = [];
    currencyElements.forEach((currencyElement) => {
      let currency = new Currency(currencyElement);
      currencies.push(currency);
    })
    let sortedCurrencies = currencies.sort(sortByCodeDesc);
    return sortedCurrencies;
  }

  static async getDefaultCurrency() {
    let result = await chrome.storage.local.get('defaultCurrencyId');
    let defaultCurrencyId = result.defaultCurrencyId;
    let defaultCurrency = await Currency.getCurrency(defaultCurrencyId);
    return defaultCurrency;
  }

  static async getConversionCurrency() {
    let result = await chrome.storage.local.get('conversionCurrencyId');
    let conversionCurrencyId = result.conversionCurrencyId;
    let conversionCurrency = await Currency.getCurrency(conversionCurrencyId);
    return conversionCurrency;
  }

  static async getCurrenciesByType() {
    let defaultCurrency = await Currency.getDefaultCurrency();
    let currencies = await Currency.getAllCurrencies();
    currencies.splice(currencies.findIndex((currency) => {return currency.id === defaultCurrency.id}), 1);
    let favoredCurrencies = [];
    let nonFavoredCurrencies = [];
    currencies.forEach(currency => {
      currency.favored ? favoredCurrencies.push(currency) : nonFavoredCurrencies.push(currency);
    });

    let currenciesbyType = {
      default: defaultCurrency,
      favored: favoredCurrencies,
      nonFavored: nonFavoredCurrencies
    };
    return currenciesbyType;
  }

  static async getFavoredCurrencies() {
    let currencies = await Currency.getAllCurrencies();
    let favoredCurrencies = currencies.filter(currency => currency.favored == true);
    return favoredCurrencies;
  }

  static async getNonFavoredCurrencies() {
    let currencies = await Currency.getAllCurrencies();
    let nonFavoredCurrencies = currencies.filter(currency => currency.favored == true);
    return nonFavoredCurrencies;
  }
}
