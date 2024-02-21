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
  const createWishlistButton = document.getElementById('create-new-wishlist');
  const addIdeaButton = document.getElementById('add-an-idea');
  const settings = document.getElementById('settings');
  const donate = document.getElementById('donate');
  const editWishlistButton = document.getElementById('edit-wishlist');

  const createWishlistModal = document.getElementById('create-wishlist-modal');
  const createWishlistModalSave = document.getElementById('create-wishlist-modal-save');
  const addIdeaModal = document.getElementById('add-idea-modal');
  const addIdeaModalSave = document.getElementById('add-idea-modal-save');
  const editWishModalSave = document.getElementById('edit-wish-modal-save');

  var wishToBeEdited;

  async function loadPage() {
    let wishlists = await Wishlist.readAll();
    let result = await chrome.storage.local.get('defaultWishlistId');
    let defaultWishlistId = result.defaultWishlistId;
    let wishes = await Wish.readWishesOnWishlist(defaultWishlistId);
    view.completeLoad(defaultWishlistId, wishes, wishlists);
  };
  await loadPage();

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

  createWishlistButton.addEventListener("click", () => {
    view.openModal(createWishlistModal);
  });

  createWishlistModalSave.addEventListener("click", async function () {
    var formData = view.getCreateWishlistFormData();
    if (formData) {
      view.closeModal(createWishlistModal);
      let wishlist = new Wishlist(formData);
      wishlist = await wishlist.save();
      if (formData.newDefault) {
        await wishlist.setAsDefaultWishlist();
      };
      let wishlists = await Wishlist.readAll();
      let result = await chrome.storage.local.get('defaultWishlistId');
      await loadPage();
      view.displayWishes([], wishlist.id, wishlists);
    };
  });

  addIdeaButton.addEventListener("click", () => {
    view.openModal(addIdeaModal);
  });

  addIdeaModalSave.addEventListener('click', () => {
    var formData = view.getAddIdeaFormData();
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
  editWishlistButton.addEventListener("click", () => {
    console.log("editing the wishlist");
  });

  editWishModalSave.addEventListener('click', () => {
    var formData = view.getEditWishFormData();
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
