import { assert } from 'chai'
import { checkDBschema } from '../../../scripts/databaseHandling/dbManager.mjs'
import chrome from 'sinon-chrome'
import sinon from 'sinon'

global.chrome = chrome;

describe("dbManager.mjs", function() {

  beforeEach(() => {
    sinon.stub(chrome.storage.local, 'get').returns(Promise.resolve({ versionNumber: '1.1.0' }))
    sinon.stub(chrome.runtime, 'getManifest').returns({ version: '1.1.0' });
  });

  afterEach(() => {
    chrome.storage.local.get.restore()
    chrome.runtime.getManifest.restore()
  });

  it("manifest Version should be 1.1.0", function () {
  })
})
