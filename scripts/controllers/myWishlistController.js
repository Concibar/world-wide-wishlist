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
  const addIdeaButton = document.getElementById('add-an-idea');
  const settings = document.getElementById('settings');
  const donate = document.getElementById('donate');
  const editWishlist = document.getElementById('edit-wishlist');

  const addIdeaModal = document.getElementById('add-idea-modal');
  const editWishModalSave = document.getElementById('edit-wish-modal-save');
  const addIdeaModalSave = document.getElementById('add-idea-modal-save');

  var wishToBeEdited;

  Wishlist.readAll().then(wishlists => {view.firstLoad(wishlists);});

  wishlistsContainer.addEventListener("mousedown", (event) => {
    let dataWishlistId = event.target.dataset.wishlistId;
    let wishlistId = parseInt(dataWishlistId, 10);
    Wishlist.readAll().then(wishlists => {
      Wish.readWishesOnWishlist(wishlistId).then(wishes => {
        view.displayWishes(wishes, wishlistId, wishlists);
      });
    });
  });
  // adds listeners to all wish-buttons
  wishesContainer.addEventListener("click", (event) => {
    if (event.target.nodeName == "BUTTON") {
      var dataWishId = event.target.dataset.wishId;
      var wishId = parseInt(dataWishId, 10);
      if (event.target.matches(".go-to-wish-website")) {
        Wish.read(wishId).then(wish => {
          window.open(wish.url);
        });
      } else if (event.target.matches(".move-wish")) {
        Wish.read(wishId).then(wish => {
          view.toggleDropdown(wish);
        });
      } else if (event.target.matches(".edit-wish")) {
        Wish.read(wishId).then(wish => {
          view.editWish(wish);
          wishToBeEdited = wish;
        });
      } else if (event.target.matches(".delete-wish")) {
        Wish.read(wishId).then(wish => {
          view.deleteWish(wish);
          wish.delete();
        });
      } else if (event.target.matches(".undo-delete")) {
        Wish.undoDelete().then(wish => {
          Wishlist.readAll().then(wishlists => {
            view.undoDeleteWish(wish,wishlists);
          });
        });
      };
    } else if (event.target.nodeName == "A") {
      let dataWishId = event.target.dataset.wishId;
      let wishId = parseInt(dataWishId, 10);
      let dataWishlistId = event.target.dataset.wishlistId;
      let wishlistId = parseInt(dataWishlistId, 10);

      Wish.read(wishId).then(wish => {
        wish.update({wishlistId: wishlistId});
        view.moveWish(wish);
      });
    };
  });
  // TODO:
  createNewWishlist.addEventListener("click", () => {
    console.log("creating new wishlist");
  });

  addIdeaButton.addEventListener("click", () => {
    view.openModal(addIdeaModal);
  });

  addIdeaModalSave.addEventListener('click', () => {
    formData = view.getAddIdeaFormData();
    if (formData) {
      let wish = new Wish(formData);
      view.closeModal(addIdeaModal);
      wish.save().then((wish) => {
        Wishlist.readAll().then(wishlists => {
          Wish.readWishesOnWishlist(wish.wishlistId).then(wishes => {
            view.displayWishes(wishes, wish.wishlistId, wishlists);
          });
        });

      });
    };
  });

  settings.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
  });

  donate.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });
  // TODO:
  editWishlist.addEventListener("click", () => {
    console.log("editing the wishlist");
  });

  editWishModalSave.addEventListener('click', () => {
    formData = view.getEditWishFormData();
    if (formData) {
      Wishlist.readAll().then(wishlists => {
        wishToBeEdited.update(formData).then((wish) => {
          view.updateWish(wish, wishlists)
        });
      });
      view.closeModal(document.getElementById('edit-wish-modal'));
    };
  });

  // General closing Modal listeners
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      view.closeAllModals();
    };
  });
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-close')
    || event.target.classList.contains('modal-background')
    || event.target.classList.contains('modal-cancel')
    || event.target.classList.contains('delete')) {
    const $modalToClose = event.target.closest('.modal');
    view.closeModal($modalToClose);
  }})
});
