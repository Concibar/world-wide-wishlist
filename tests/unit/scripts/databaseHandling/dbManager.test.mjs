import { checkDBschema } from '../../../../scripts/databaseHandling/dbManager.mjs'
import {jest} from '@jest/globals'

//

describe("dbManager.mjs", () => {

  describe("checkDBschema encounters empty chrome storage", () => {

    afterAll(jest.clearAllMocks)

    it("should set 11 times", async () => {
      await checkDBschema()
      console.log(chrome.storage.local.get());
    })

    // storage should return versionNumber
    // storage should return defaultWishlistId
    // storage should return defaultCurrencyId
    // storage should return settings
    // storage should return currencies
    // storage should return wishes
    // storage should return wishlists

  })

  describe("checkDBschema encounters matching chrome storage", () => {

    afterAll(jest.clearAllMocks)

    it("should not set anything", async () => {
      await checkDBschema()
      //TODO
    })

    it("should print to console", async () => {
      await checkDBschema()
    })

  })

  describe("checkDBschema encounters migratable chrome storage", () => {

    afterAll(jest.clearAllMocks)

    it("TODO", async () => {

    })

  })
})

//
