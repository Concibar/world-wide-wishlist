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


  const editWishlistModalSave = document.getElementById('edit-wishlist-modal-save');
  const editWishlistModalDelete = document.getElementById('edit-wishlist-modal-delete');
  const createWishlistModal = document.getElementById('create-wishlist-modal');
  const createWishlistModalSave = document.getElementById('create-wishlist-modal-save');
  const addIdeaModal = document.getElementById('add-idea-modal');
  const addIdeaModalSave = document.getElementById('add-idea-modal-save');
  const editWishModalSave = document.getElementById('edit-wish-modal-save');

  var wishToBeEdited;
  var wishlistToBeEdited;

  async function loadPage() {
    let wishlists = await Wishlist.readAll();
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    let wishes = await Wish.readWishesOnWishlist(defaultWishlist.id);
    view.completeLoad(defaultWishlist.id, wishes, wishlists);
  }
  await loadPage();

  // Wishlist clicked -> Display according wishes
  wishlistsContainer.addEventListener("mousedown", (event) => {
    let dataWishlistId = event.target.dataset.wishlistId;
    let wishlistId = parseInt(dataWishlistId, 10);
    Wishlist.readAll().then(wishlists => {
      Wish.readWishesOnWishlist(wishlistId).then(wishes => {
        view.displayWishes(wishes, wishlistId, wishlists);
      });
    });
  });

  // any click outside of dropdown closes current active dropdowns
  document.body.addEventListener('click', () => {
    let openDropdown = document.querySelector(".dropdown.is-active");
    openDropdown.classList.remove('is-active');
  });

  // listen to go to website; move wish; edit wish; delete Wish; undo-delete
  wishesContainer.addEventListener("click", (event) => {
    if (event.target.nodeName == "BUTTON") {
      var dataWishId = event.target.dataset.wishId;
      var wishId = parseInt(dataWishId, 10);
      if (event.target.matches(".move-wish")) {
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
      }
    } else if (event.target.nodeName == "A") {
      let dataWishId = event.target.dataset.wishId;
      let wishId = parseInt(dataWishId, 10);
      let dataWishlistId = event.target.dataset.wishlistId;
      let wishlistId = parseInt(dataWishlistId, 10);

      Wish.read(wishId).then(wish => {
        wish.update({wishlistId: wishlistId});
        view.moveWish(wish);
      });
    } else if (!event.target.matches(".wishes") ) {
      var closestBox = event.target.closest(".actual-wishcard");
      if (closestBox) {
        var dataWishId = closestBox.dataset.wishId;
        var wishId = parseInt(dataWishId, 10);
        Wish.read(wishId).then(wish => {
          window.open(wish.url);
        });
      }
    }
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
      }
      let wishlists = await Wishlist.readAll();
      await loadPage();
      view.displayWishes([], wishlist.id, wishlists);
    }
  });

  addIdeaButton.addEventListener("click", () => {
    addIdeaModal.querySelector('#add-idea-quantity').value = 1;
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
    }
  });

  settings.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('html/settings.html') });
  });

  donate.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });

  editWishlistButton.addEventListener("click", () => {
    var wishlistId = view.currentWishlistId;
    Wishlist.read(wishlistId).then((wishlist) => {
      view.editWishlist(wishlist);
      wishlistToBeEdited = wishlist;
    });
  });

  editWishlistModalSave.addEventListener('click', async function() {
    var name = view.getEditWishlistNewName();
    if (name) {
      view.closeModal(document.getElementById('edit-wishlist-modal'));
      await wishlistToBeEdited.update(name);
      let wishes = await Wish.readWishesOnWishlist(wishlistToBeEdited.id);
      let wishlists = await Wishlist.readAll();
      await loadPage();
      view.displayWishes(wishes, wishlistToBeEdited.id, wishlists);
    }
  });

  editWishlistModalDelete.addEventListener('click', async function() {
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    let deleteBoolean = view.deleteWishlist(defaultWishlist.id);
    if (deleteBoolean) {
      view.closeModal(document.getElementById('edit-wishlist-modal'));
      await wishlistToBeEdited.delete();
      await loadPage();
    }
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
    }
  });

  // General closing Modal listeners
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      view.closeAllModals();
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-close')
    || event.target.classList.contains('modal-background')
    || event.target.classList.contains('modal-cancel')
    || event.target.classList.contains('delete')) {
    const $modalToClose = event.target.closest('.modal');
    view.closeModal($modalToClose);
  }});

});
