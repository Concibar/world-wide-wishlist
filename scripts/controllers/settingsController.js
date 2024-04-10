import View from "../views/settingsView.js";
import {exportDatabase, importDatabase} from '../databaseHandling/dbExportImport.js'
import checkDBschema from '../databaseHandling/dbManager.js'

document.addEventListener('DOMContentLoaded', async function () { // this waits for the popup.html to fully load
  // Check if Database needs to be set or updated
  await checkDBschema();

  const view = new View();

  // event listener to export click -> export to file + download shenanigans

  // event listener to file change event -> if file valid -> "unlock" import button; if not -> clear file selector and display message

  // event listener import click -> if file change has content -> start import shenanigans; if not -> file-select red shadow
});
