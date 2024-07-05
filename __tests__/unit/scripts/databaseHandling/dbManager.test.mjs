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

global.chrome ={
  runtime: {
    getManifest: () => ({version: "123.456.789"})
  }
};

describe("dbManager.mjs", function () {
  describe("manifestVersion", function () {
    const mockManifest = chrome.runtime.getManifest()
    export const mockManifestVersion = manifest.version
    it("should return 123.456.789", async function () {
      console.log(mockManifestVersion);
      expect(mockManifestVersion).toBe("123.456.789")
    })

  })
})
