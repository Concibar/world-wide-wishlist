export default class SettingsView {

  constructor () {}

  unlockImportButton(filename) {
    let fontawesomeFileUploadedClasslist = "fa-solid fa-file-circle-check";
    document.getElementById('import-button').classList.remove('is-inactive');
    document.getElementById('database-input-icon').className = fontawesomeFileUploadedClasslist;
    document.getElementById('database-input-text').innerText = filename;
  };

  lockImportButton() {
    let fontawesomeFolderClasslist = "fa-regular fa-folder-open";
    document.getElementById('import-button').classList.add('is-inactive');
    document.getElementById('database-input-icon').className = fontawesomeFolderClasslist;
    document.getElementById('database-input-text').innerText = "Choose file to import...";
  };
}
