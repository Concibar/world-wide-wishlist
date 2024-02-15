document.addEventListener('DOMContentLoaded', async function () { // this waits for the html to fully load

  // Check js scripts connections
  myWishlistViewConnection();
  wishConnection();
  wishlistConnection();
  dbSetupConnection();

  setupDatabase();
  // TODO: update check/functionality
  const view = new MyWishlistView();
  const wishlistsContainer = document.getElementById('wishlists');
  const wishesContainer = document.getElementById('wishes');
  const createNewWishlist = document.getElementById('create-new-list');
  const addIdea = document.getElementById('add-an-idea');
  const settings = document.getElementById('settings');
  const donate = document.getElementById('donate');
  const editWishlist = document.getElementById('edit-wishlist');

  await view.firstLoad();
  wishlistsContainer.addEventListener("click", (event) => {
    let wishlistCssId = event.target.id;
    let numStr = wishlistCssId.replace(/[^0-9]/g, '');
    let wishlistId = parseInt(numStr, 10);
    Wish.readWishesOnWishlist(wishlistId).then(wishes => {
      view.displayWishes(wishes, wishlistId);
    });
  });
  wishesContainer.addEventListener("click", (event) => {
    if (event.target.nodeName == "BUTTON") {
      var buttonCssId = event.target.id;
      var numStr = buttonCssId.replace(/[^0-9]/g, '');
      var wishId = parseInt(numStr, 10);

      // TODO
      if (event.target.matches(".go-to-wish-website")) {
        console.log("going to wish website of " + wishId);
      } else if (event.target.matches(".move-wish")) {
        console.log("moving the wish of " + wishId);
      } else if (event.target.matches(".edit-wish")) {
        console.log("editing the wish of" + wishId);
      } else if (event.target.matches(".delete-wish")) {
        console.log("deleting the wish of" + wishId);
      };
    };
  });
  createNewWishlist.addEventListener("click", () => {
    console.log("creating new wishlist");
  });
  addIdea.addEventListener("click", () => {
    console.log("adding a new idea");
  });
  settings.addEventListener("click", () => {
    console.log("going to settings");
  });
  donate.addEventListener("click", () => {
    console.log("going to donation");
  });
  editWishlist.addEventListener("click", () => {
    console.log("editing the wishlist");
  });

});
