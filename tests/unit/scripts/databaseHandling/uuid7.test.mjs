import uuid, {extractTimeFromUUIDv7 as uuidToDate} from '../../../../scripts/databaseHandling/uuid7.mjs'
import {jest} from '@jest/globals'

describe("uuid7.js", function () {

  describe("uuid7()", function () {
    var testUuid = uuid();
    var testDepth = 1000;

    var arrayOfUuids = [];
    for (let i = 0; i < testDepth; i++) {
      arrayOfUuids[i] = uuid();
    };

    it("should return a string", function () {
      expect(typeof testUuid).toBe('string');
    });
    it("should be 36 letters long", function () {
      expect(testUuid.length).toBe(36);
    });
    it(`should always(testing ${testDepth} times) follow the structure 8-4-4-4-12 and each non-hyphon should be from 0123456789abcdef`, function () {
      var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
      arrayOfUuids.forEach((uuid) => {
        for (let i = 0; i < 36; i++) {
          if ([8,13,18,23].includes(i)) {
            expect(uuid[i]).toBe("-");
          } else {
            expect(hexDigits).toContain(uuid[i]);
          };
        };
      });
    });
    it(`13th digit should always(testing ${testDepth} times) be a 7`, function () {
      arrayOfUuids.forEach((uuid) => {
        expect(uuid[14]).toBe("7");
      });
    });
    it(`value at 17th digit should always(testing ${testDepth} times) to be 8,9,a or b`, function () {
      arrayOfUuids.forEach((uuid) => {
        expect(["8","9","a","b"]).toContain(uuid[19]);
      });
    });
    it("should be tied to a date", function() {
      arrayOfUuids.forEach((uuid) => {
        expect(uuidToDate(uuid) instanceof Date).toBeTruthy()
      });
    });
    it("should read the current date(year, month, day)", function () {
      var currentDate = new Date()
      arrayOfUuids.forEach((uuid) => {
        expect(uuidToDate(uuid).getFullYear()).toBe(currentDate.getFullYear())
        expect(uuidToDate(uuid).getMonth()).toBe(currentDate.getMonth())
        expect(uuidToDate(uuid).getDate()).toBe(currentDate.getDate())
      });
    });
    it(`should always(testing ${testDepth} times) be unique`, function () {
      arrayOfUuids.forEach((uuid, i) => {
        let uniqueArray = arrayOfUuids
        uniqueArray.splice(i, 1)
        expect(uniqueArray).not.toContain(uuid)
      });
    })
  })

  describe("extractTimeFromUUIDv7(uuid)", function () {
    it("should return a Date Object", function () {
      let result = uuidToDate("01904b95-88f8-7ade-899b-6e0dd379a692")
      expect(result instanceof Date).toBeTruthy()
    })
    it("should read the correct date", function () {
      var uuidDate = uuidToDate("01904b95-88f8-7ade-899b-6e0dd379a692")
      var actualDate = new Date(1719255009528)
      expect(uuidDate.getTime()).toBe(actualDate.getTime())
    })
  })
});
