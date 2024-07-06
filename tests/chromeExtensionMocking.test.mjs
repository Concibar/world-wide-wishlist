import { chromeSetVersion, chromeLoadVersion, chromeManifest } from "../development/chromeExtensionMocking.mjs"
import {jest} from '@jest/globals'

describe("Trying out testing for global methods Mockingjay", () => {

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
