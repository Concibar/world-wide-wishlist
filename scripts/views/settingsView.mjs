import Currency from "../models/currency.mjs";
export default class SettingsView {

  constructor () {}

  async loadCurrencies() {
    let currenciesByType = await Currency.getCurrenciesByType();

    let currencies = await Currency.getAllCurrencies();
    const defaultCurrencyDropdownContent = document.getElementById('default-currency-dropdown-content');
    defaultCurrencyDropdownContent.innerHTML = '';

    const conversionCurrencyDropdownContent = document.getElementById('conversion-currency-dropdown-content');
    conversionCurrencyDropdownContent.innerHTML = '';

    currencies.forEach(currency => {
      defaultCurrencyDropdownContent.insertAdjacentHTML('beforeend', this.#makeCurrencyDropdownElement(currency));
      conversionCurrencyDropdownContent.insertAdjacentHTML('beforeend', this.#makeCurrencyDropdownElement(currency));
    });

    const favoredCurrencyDropdownContent = document.getElementById('favored-currency-dropdown-content');
    favoredCurrencyDropdownContent.innerHTML = '';
    currenciesByType.nonFavored.forEach((currency) => {
      favoredCurrencyDropdownContent.insertAdjacentHTML('beforeend', this.#makeCurrencyDropdownElement(currency));
    })

    const currentDefaultCurrency = document.getElementById('current-default-currency');
    currentDefaultCurrency.innerText = currenciesByType.default.name;
    const currentConversionCurrency = document.getElementById('current-conversion-currency');
    currentConversionCurrency.innerText = currenciesByType.conversion.name;

    const favoredCurrencyTagContainer = document.getElementById('favored-currencies-tag-container');
    favoredCurrencyTagContainer.innerHTML = '';
    currenciesByType.favored.forEach((currency) => {
      favoredCurrencyTagContainer.insertAdjacentHTML('beforeend', this.#makefavoredCurrencyTag(currency));
    })
  }

  unlockImportButton(filename) {
    let fontawesomeFileUploadedClasslist = "fa-solid fa-file-circle-check";
    document.getElementById('import-button').classList.remove('is-inactive');
    document.getElementById('database-input-icon').className = fontawesomeFileUploadedClasslist;
    document.getElementById('database-input-text').innerText = filename;
  };

  lockImportButton() {
    let fontawesomeFolderClasslist = "fa-regular fa-folder-open";
    document.getElementById('database-input').value = "";
    document.getElementById('import-button').classList.add('is-inactive');
    document.getElementById('database-input-icon').className = fontawesomeFolderClasslist;
    document.getElementById('database-input-text').innerText = "Choose file to import...";
  };

  importProgress() {
    document.getElementById('import-export-box').innerHTML = `
      <label for="progress-bar">Processing Document, don't close this site!</label>
      <progress id="progress-bar" class="progress is-large is-success" max="100"></progress>
    `;
  }

  importSuccess() {
    document.getElementById('import-export-box').innerHTML = `
      <section class="hero is-success">
        <div class="hero-body">
          <p class="title">Database imported successfully!</p>
          <p class="subtitle">reload the page if you want to import another one</p>
        </div>
      </section>
    `;
  }

  #makeCurrencyDropdownElement(currency) {
    return `<a class="dropdown-item" data-currency-code="${currency.code}"> ${currency.code} - ${currency.name} </a>`
  }
  #makefavoredCurrencyTag(currency) {
    return `
    <div class="control">
      <div class="tags has-addons">
        <span class="tag is-link">${currency.code}</span>
        <span data-currency-code="${currency.code}" class="tag is-delete is-clickable is-danger"></span>
      </div>
    </div>
    `
  }
}
