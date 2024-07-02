import { manifestVersion, checkDBschema } from '../../../../scripts/databaseHandling/dbManager.mjs'
import {jest} from '@jest/globals'

describe("dbManager.mjs", function () {
  describe("manifestVersion", function () {
    it("should return 1.1.0", async function () {
      jest.spyOn(chrome.runtime, "getManifest").mockResolvedValue({
        version: "1.1.0"
      })
      expect(await manifestVersion).toBe("1.1.0")
    })

  })
})
