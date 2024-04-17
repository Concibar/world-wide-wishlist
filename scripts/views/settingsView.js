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
    document.getElementById('database-input').value = "";
    document.getElementById('import-button').classList.add('is-inactive');
    document.getElementById('database-input-icon').className = fontawesomeFolderClasslist;
    document.getElementById('database-input-text').innerText = "Choose file to import...";
  };

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
}
