import puppeteer from 'puppeteer';
import { setTimeout } from "timers/promises";
import {
  openPopup,
  openBrowser,
  testHtml
} from "../utils.mjs"

describe("Popup tries loading data from page", async function () {

  before(async () => {
    global.assert = assert
    global.browser = await openBrowser()
    global.testPage = await browser.newPage()
    await testPage.goto(testHtml)
    await testPage.setViewport( { width: 1920, height: 1040} )
    global.popup = await openPopup(browser)
  })

  after(async function () {
    await testPage.close();
    await browser.close();
    console.log("headless browser terminated");
  })

  it("should fill name with a string", async function () {
    let name = await popup.$eval('#wish-name', el => el.value)
    console.log(name)
    expect(typeof name).toBe("String")
    assert.isNotEmpty(name)
  })

  it("should fill name with a not-empty string", async function () {
    let name = await popup.$eval('#wish-name', el => el.value)
    console.log(name)
    expect(name.length).toBeGreaterThan(0)
  })

  // it("gallery should have an image", function () {

  // })
})


//   describe("User can enter/edit data", function () {
//     it("different image displays on clicking next", function () {

//     })
//     it("previous image displays on clicking previous", function () {

//     })
//     it("different image displays on clicking previous again", function () {

//     })

//     it("title can take string input", function () {

//     })

//     it("price can take string input", function () {

//     })

//     it("quantity can take number as input", function () {

//     })

//     it("quantity can be increased", function () {

//     })

//     it("note can take string input", function () {

//     })

//     it("wishlists can be selected", function () {

//     })
//   })

//   describe("User can close popup", function () {
//     it("Popup closes on X", function () {

//     })
//   })

//   describe("User can go to wishlists", function () {
//     it("Browser action", function () {

//     })
//     it("Go-to-wishlists-button", function () {

//     })
//   })

//   describe("User can go to Settings", function () {
//     it("Browser action", function () {

//     })
//     it("Go-to-wishlists-button", function () {

//     })
//   })

//   describe("User can save valid input and go to wishlists", function () {
//     it("User can save valid wish to selected wishlist", function () {

//     })
//     it("success message is displayed", function () {

//     })
//     it("sucess link opens wishlists in current tab", function () {

//     })
//   })

//   describe("User cannot save stupid invalid data", function () {
//     describe("Title cannot be invalid", function () {
//       it("different image displays on clicking next", function () {

//       })
//     })

//     describe("Quantity cannot be invalid", function () {
//       it("different image displays on clicking next", function () {

//       })
//     })

//     describe("Note cannot be invalid", function () {
//       it("different image displays on clicking next", function () {

//       })
//     })

//     describe("Price cannot be invalid", function () {
//       it("different image displays on clicking next", function () {

//       })
//     })
//   })

//   describe("User can open and cluse up the new wishlist form", function () {
//     it("add wishlist opens modal", function () {

//     })

//     it("modal can be closed via clicking outside", function () {

//     })

//     it("modal can be closed via clicking X", function () {

//     })

//     it("modal can be closed via clicking cancel", function () {

//     })

//     it("Name can be filled", function () {

//     })

//     it("checkbox for new default wishlist can be checked", function () {

//     })

//     it("modal can be closed via clicking outside", function () {

//     })

//   })

//   describe("User can make a new wishlist if valid data is provided", function () {
//     it("save a new non-default wishlist closes the modal", function () {

//     })
//     it("save a new non-default wishlist selects the new wishlist", function () {

//     })
//     it("user can save to new wishlist", function () {

//     })
//     it("save a new default wishlist selects the new wishlist", function () {

//     })
//     it("user can save to new default wishlist", function () {

//     })

//   })

//   describe("User can not make a new wishlist if stupid invalid data is provided", function () {
//     it("trying to save invalid wishlist doesn't the modal", function () {

//     })
//     it("trying to save invalid wishlist displays error", function () {

//     })
//     it("user can save once data is valid again", function () {

//     })

//   })

// const saveButton = await popup.waitForSelector("#save-wish");
// await saveButton.click();

// const successButton = await popup.waitForSelector("#success-go-to-wishlists-button", {visible: true});
// await successButton.click();
