import { chromeSetVersion, chromeLoadVersion, chromeManifest } from "../development/chromeExtensionMocking.mjs"
import {jest} from '@jest/globals'

describe("Ensuring chrome extension API is mocked correctly", () => {

  describe("chromeLoadVersion", function() {
    it("should return the set version", async function() {
      await chromeSetVersion('666')
      let version = await chromeLoadVersion()
      console.log(version);
      expect(version).toBe('666')
    })
  })

  describe("chromeManifest", () => {
    it("should return manifest-version of 1.2.3", () => {
      jest.spyOn(chrome.runtime, "getManifest").mockReturnValue({version: "1.2.3"})
      let manifestVersion = chromeManifest()
      expect(manifestVersion.version).toBe('1.2.3')
    })
  })
});

// chrome.storage.local.get(trueKey) returns correct value with key given as variable
// chrome.storage.local.get(falseKey) returns undefined with false key given as variable
// chrome.storage.local.get("trueKey") returns correct value with key given as string
// chrome.storage.local.get("falseKey") returns undefined with false key given as string
// chrome.storage.local.get([trueKey]) returns correct value with key given as variable in an array
// chrome.storage.local.get([falseKey]) returns undefined with key given as variable in an array
// chrome.storage.local.get(["trueKey"]) returns correct value with key given as string in an array
// chrome.storage.local.get(["falseKey"]) returns undefined with key given as string in an array
// chrome.storage.local.get() returns the complete storage

// chrome.storage.local.set({object}) returns a promise that resolves to null
// chrome.storage.local.set({object}) returns saves the object so it can be recalled by the get method aka modifies the global manual mock

// chrome.storage.local.get() returns from manual mock
// chrome.storage.local.get() returns from spyOn changed mock
// chrome.storage.local.get() returns from manual mock again fater spyOn mock has been cleared (?)

// chrome.runtime.getManifest() returns the manifest object from manual mock
// chrome.runtime.getManifest() returns the manifest object from spy mock
// chrome.runtime.getManifest() returns the manifest object from manual mock after spy mock has been reset
// chrome.runtime.getManifest() returns the manifest object

// chrome.runtime.getManifest() returns the manifest object from manual mock
// chrome.runtime.getManifest() returns the manifest object from spy mock
// chrome.runtime.getManifest() returns the manifest object from manual mock after spy mock has been reset
// chrome.runtime.getManifest() returns the manifest object
