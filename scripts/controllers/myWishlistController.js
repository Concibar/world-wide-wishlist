document.addEventListener('DOMContentLoaded', async function () { // this waits for the html to fully load

  // Check js scripts connections
  myWishlistViewConnection();
  wishConnection();
  wishlistConnection();
  dbSetupConnection();
  storageTestingConnection();

  // DEBUG:
  // await setTestDatabase();

  await setupDatabase();
  // TODO: update check/functionality
  const view = new MyWishlistView();
  const wishlistsContainer = document.getElementById('wishlists');
  const wishesContainer = document.getElementById('wishes');
  const createNewWishlist = document.getElementById('create-new-list');
  const addIdea = document.getElementById('add-an-idea');
  const settings = document.getElementById('settings');
  const donate = document.getElementById('donate');
  const editWishlist = document.getElementById('edit-wishlist');
  const editWishModalSave = document.getElementById('edit-wish-modal-save');
  const modalClosingElements = (document.querySelectorAll('.modal-background, .modal-close, .delete, .modal-cancel') || []);
  var wishToBeEdited;

  await view.firstLoad();
  // DONE
  wishlistsContainer.addEventListener("mousedown", (event) => {
    let wishlistCssId = event.target.id;
    let numStr = wishlistCssId.replace(/[^0-9]/g, '');
    let wishlistId = parseInt(numStr, 10);
    Wish.readWishesOnWishlist(wishlistId).then(wishes => {
      view.displayWishes(wishes, wishlistId);
    });
  });
  // add listeners to all wish-buttons
  // TODO: 2 listeners; DONE 3/5
  wishesContainer.addEventListener("click", (event) => {
    if (event.target.nodeName == "BUTTON") {
      var buttonCssId = event.target.id;
      var numStr = buttonCssId.replace(/[^0-9]/g, '');
      var wishId = parseInt(numStr, 10);

      if (event.target.matches(".go-to-wish-website")) {
        Wish.read(wishId).then(wish => {
          window.open(wish.url);
        });
      } else if (event.target.matches(".move-wish")) {
        Wish.read(wishId).then(wish => {
          view.moveWish(wish);
          // TODO: save the wish returned from moveWish here
        });
      } else if (event.target.matches(".edit-wish")) {
        Wish.read(wishId).then(wish => {
          view.editWish(wish);
          wishToBeEdited = wish;
        });
      } else if (event.target.matches(".delete-wish")) {
        Wish.read(wishId).then(wish => {
          view.deleteWish(wish.id).then(() => {wish.delete()})
        });
      } else if (event.target.matches(".undo-delete")) {
        view.lastDeletedWish.save();
        view.undoDeleteWish();
      };
    };
  });
  // TODO:
  createNewWishlist.addEventListener("click", () => {
    console.log("creating new wishlist");
  });
  // TODO:
  addIdea.addEventListener("click", () => {
    console.log("adding a new idea");
  });
  // DONE:
  settings.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
  });
  // DONE:
  donate.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });
  // TODO:
  editWishlist.addEventListener("click", () => {
    console.log("editing the wishlist");
  });

  editWishModalSave.addEventListener('click', () => {
    formData = view.getEditWishModalFormData();
    if (formData) {
      wishToBeEdited.update(formData)
      .then((wish) => {view.updateWish(wish)})
      view.closeModal(document.getElementById('edit-wish-modal'));
    };
  })

  // Escape-key closes all Modals:
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      view.closeAllModals();
    };
  });

  modalClosingElements.forEach((element) => {
    const $modalToClose = element.closest('.modal');

    element.addEventListener('click', () => {
      view.closeModal($modalToClose);
    });
  });

});
