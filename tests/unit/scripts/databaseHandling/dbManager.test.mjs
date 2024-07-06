import { manifestVersion, checkDBschema } from '../../../../scripts/databaseHandling/dbManager.mjs'
import {jest} from '@jest/globals'

// let chrome;
// let mockStorage;
// let mockLocal;
// let mockGet;
// function setUpChromeMocks() {
//   //res.status(200).json({ foo: 'bar' });
//   mockStorage = jest.fn();
//   mockLocal = jest.fn();
//   mockGet = jest.fn((searchterm) => {versionNumber: "123.456.789"});
//   chrome = {
//     storage: mockStorage,
//     local: mockLocal,
//     get: mockGet
//   }
//   mockStorage.mockImplementation(() => chrome);
//   mockLocal.mockImplementation(() => chrome);

// }

describe("dbManager.mjs", () => {
  describe("manifestVersion", () => {

    it("should return 123.456.789", async function () {
      expect(manifestVersion).toBe("123.456.789")
    })

  })

  describe("setupDatabase", () => {
    beforeEach(() => {

    })
    afterEach(jest.clearAllMocks)
    it("should set", async () => {
      jest.spyOn(chrome.runtime, "getManifest").mockReturnValue({version: "1.2.3"})
      await checkDBschema()
    })
  })
})
