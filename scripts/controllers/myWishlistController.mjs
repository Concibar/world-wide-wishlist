import Wish from '../models/wish.mjs'
import Wishlist from '../models/wishlist.mjs'
import View from '../views/myWishlistView.mjs'
import { fetchAndUpdateCurrencyRatesOnceDaily } from '../currencyConverter.mjs';

document.addEventListener('DOMContentLoaded', async function () {
  await fetchAndUpdateCurrencyRatesOnceDaily();

  const view = new View();
  const createWishlistModal = document.getElementById('create-wishlist-modal');
  const addIdeaModal = document.getElementById('add-idea-modal');
  var wishToBeEdited;
  var wishlistToBeEdited;

  async function loadPage() {
    let wishlists = await Wishlist.readAll();
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    let wishes = await Wish.readWishesOnWishlist(defaultWishlist);
    await view.completeLoad(defaultWishlist, wishes, wishlists);
  }
  await loadPage();

  // When Tab comes back into focus, reload with saved position to get new wishes/wishlists
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      let scroll = wishesContainer.scrollTop;
      let scrollHeight = wishesContainer.scrollHeight;
      loadPage().then(() => {
        Wishlist.readAll().then(wishlists => {
          Wishlist.read(view.currentWishlistId).then(wishlist => {
            Wish.readWishesOnWishlist(wishlist).then(wishes => {
              view.displayWishes(wishes, wishlist, wishlists).then( () => {
                // if the wishes container is unchanged, scroll down to previous position, otherwise scroll to top
                wishesContainer.scrollTop = (scrollHeight == wishesContainer.scrollHeight) ? scroll : 0;
              });
            });
          })
        });
      });
    }
  });

  // Wishlist clicked -> Display according wishes
  const wishlistsContainer = document.getElementById('wishlists');
  wishlistsContainer.addEventListener("mousedown", (event) => {
    let wishlistId = event.target.dataset.wishlistId;
    Wishlist.readAll().then(wishlists => {
      Wishlist.read(wishlistId).then(wishlist => {
        Wish.readWishesOnWishlist(wishlist).then(wishes => {
          view.displayWishes(wishes, wishlist, wishlists);
        });
      })
    });
  });

  // sort function
  const sortByDropdown = document.getElementById('wishes-sort-by');
  sortByDropdown.addEventListener('click', async (event) => {
    let sortBy = event.target.dataset.sortBy;
    let wishlist = await Wishlist.read(view.currentWishlistId);
    if (sortBy == Wishlist.SORT_BY_OPTIONS.ALPHA_NUM_A_TO_Z  ||
        sortBy == Wishlist.SORT_BY_OPTIONS.ALPHA_NUM_Z_TO_A  ||
        sortBy == Wishlist.SORT_BY_OPTIONS.DATES_NEW_TO_OLD  ||
        sortBy == Wishlist.SORT_BY_OPTIONS.DATES_OLD_TO_NEW  ||
        sortBy == Wishlist.SORT_BY_OPTIONS.PRICE_HIGH_TO_LOW ||
        sortBy == Wishlist.SORT_BY_OPTIONS.PRICE_LOW_TO_HIGH ||
        sortBy == Wishlist.SORT_BY_OPTIONS.CUSTOM) {
        console.log(sortBy);
        await wishlist.update({orderedBy: sortBy});
        let wishlists = await Wishlist.readAll();
        let wishes = await Wish.readWishesOnWishlist(wishlist);
        await view.displayWishes(wishes, wishlist, wishlists);
      }
  })

  // any click outside of dropdown closes current active dropdowns
  document.body.addEventListener('click', (event) => {
    if (event.target.matches(".move-wish")) {
      return;
    }
    let openDropdown = document.querySelector(".dropdown.is-active");
    if (openDropdown != null) {
      openDropdown.classList.remove('is-active');
    }
  });

  // move wish; edit wish; delete Wish; undo-delete
  const wishesContainer = document.getElementById('wishes');
  wishesContainer.addEventListener("click", (event) => {
    if (event.target.nodeName == "BUTTON") {
      var wishId = event.target.dataset.wishId;
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
      let wishId = event.target.dataset.wishId;
      let wishlistId = event.target.dataset.wishlistId;

      Wish.read(wishId).then(wish => {
        wish.update({wishlistId: wishlistId});
        view.moveWish(wish);
      });
    } else if (!event.target.matches(".wishes") ) {
      var closestBox = event.target.closest(".actual-wishcard");
      if (closestBox) {
        var wishId = closestBox.dataset.wishId;
        Wish.read(wishId).then(wish => {
          window.open(wish.url);
        });
      }
    }
  });

  // Create Wishlist Button
  const createWishlistButton = document.getElementById('create-new-wishlist');
  createWishlistButton.addEventListener("click", () => {
    view.openModal(createWishlistModal);
  });

  // Add Idea Button
  const addIdeaButton = document.getElementById('add-an-idea');
  addIdeaButton.addEventListener("click", () => {
    view.openModal(addIdeaModal);
  });

  // Settings Button
  const settingsButton = document.getElementById('settings');
  settingsButton.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('html/settings.html')});
    });
  });

  // Donate to the Developer Button
  const donateButton = document.getElementById('donate');
  donateButton.addEventListener("click", () => {
    window.open("https://ko-fi.com/H2H2H8OO");
  });

  // Edit Wishlist Button
  const editWishlistButton = document.getElementById('edit-wishlist');
  editWishlistButton.addEventListener("click", () => {
    var wishlistId = view.currentWishlistId;
    Wishlist.read(wishlistId).then((wishlist) => {
      view.editWishlist(wishlist);
      wishlistToBeEdited = wishlist;
    });
  });

  // --- MODAL STUFF ---

  // Create Wishlist Save
  async function createWishlistSave() {
    let formData = view.getCreateWishlistFormData();
    if (formData) {
      view.closeModal(createWishlistModal);
      let wishlist = new Wishlist(formData);
      wishlist = await wishlist.save();
      if (formData.newDefault) {
        await wishlist.setAsDefaultWishlist();
      }
      let wishlists = await Wishlist.readAll();
      await loadPage();
      view.displayWishes([], wishlist, wishlists);
    }
  };
  const createWishlistModalSave = document.getElementById('create-wishlist-modal-save');
  createWishlistModalSave.addEventListener("click", createWishlistSave);
  const createWishlistNameField = document.getElementById('create-wishlist-name');
  createWishlistNameField.addEventListener("keydown", async (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      await createWishlistSave();
    }
  });

  // Edit Wishlist Save TODO: refactor so update takes an object
  async function editWishlistSave() {
    let formData = view.getEditWishlistFormData();
    if (formData) {
      view.closeModal(document.getElementById('edit-wishlist-modal'));
      if (formData.newDefault) {
        await wishlistToBeEdited.setAsDefaultWishlist();
      };
      await wishlistToBeEdited.update(formData);
      let wishes = await Wish.readWishesOnWishlist(wishlistToBeEdited);
      let wishlists = await Wishlist.readAll();
      await loadPage();
      view.displayWishes(wishes, wishlistToBeEdited, wishlists);
    }
  };
  const editWishlistModalSaveButton = document.getElementById('edit-wishlist-modal-save');
  editWishlistModalSaveButton.addEventListener('click', editWishlistSave);
  const editWishlistNameField = document.getElementById('edit-wishlist-name');
  editWishlistNameField.addEventListener("keydown", async (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      await editWishlistSave();
    }
  });

  // Add Idea Save
  function addIdeaSave() {
    let formData = view.getAddIdeaFormData();
    if (formData) {
      let wish = new Wish(formData);
      view.closeModal(addIdeaModal);
      wish.save().then((wish) => {
        Wishlist.readAll().then(wishlists => {
          Wishlist.read(wish.wishlistId).then(wishlist => {
            Wish.readWishesOnWishlist(wishlist).then(wishes => {
              view.displayWishes(wishes, wishlist, wishlists);
            });
          })
        });
      });
    }
  };
  const addIdeaModalSaveButton = document.getElementById('add-idea-modal-save');
  addIdeaModalSaveButton.addEventListener('click', addIdeaSave);
  const addIdeaForm = document.getElementById('add-idea-form');
  addIdeaForm.addEventListener('keydown', (event) => {
    if(event.key === "Enter") {
      addIdeaSave()
    }
  });

  // Edit Wishlist delete
  const editWishlistModalDeleteButton = document.getElementById('edit-wishlist-modal-delete');
  editWishlistModalDeleteButton.addEventListener('click', async function() {
    let defaultWishlist = await Wishlist.getDefaultWishlist();
    let deleteBoolean = view.deleteWishlist(defaultWishlist.id);
    if (deleteBoolean) {
      view.closeModal(document.getElementById('edit-wishlist-modal'));
      await wishlistToBeEdited.delete();
      await loadPage();
    }
  });

  // Edit Wish Save
  function editWishSave() {
    let formData = view.getEditWishFormData();
    if (formData) {
      Wishlist.readAll().then(wishlists => {
        wishToBeEdited.update(formData).then((wish) => {
          view.updateWish(wish, wishlists)
        });
      });
      view.closeModal(document.getElementById('edit-wish-modal'));
    }
  };
  const editWishModalSaveButton = document.getElementById('edit-wish-modal-save');
  editWishModalSaveButton.addEventListener('click', editWishSave);
  const editWishForm = document.getElementById('edit-wish-form');
  editWishForm.addEventListener('keydown', (event) => {
    if(event.key === "Enter") {
      editWishSave()
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
