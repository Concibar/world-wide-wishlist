document.addEventListener('DOMContentLoaded', async function () { // this waits for the html to fully load

  // Check js scripts connections
  myWishlistViewConnection();
  wishConnection();
  wishlistConnection();
  dbSetupConnection();

  setupDatabase();
  // TODO: update check/functionality
  const view = new MyWishlistView();

  // Filling with wishlists
  var wishlists = view.fillDefault();
  // TODO: add eventlisteners to wishlists via forloop:
  // remove Event Listeners -> load corresponding wishlist -> attach new eventlisteners
  // TODO: add eventlisteners to wishes via forloop

  // TODO: fct -> display wishlist
  // Get Wishlists
  // Get Wishes with that id
  // tell view to display wishlists + wishes

  // TODO: Get Settings -> default wishlist
  // dctDisplayWishlists(defaultWishlistId)
  // TODO: Get Wishes with def wishlist as id
  // TODO: tell view to display def. wishlist + wishes

  // TODO: eventlisteners for clicking on the other wishlists
  // 1) check if already active -> if yes abbort
  // 2) remove eventlisteners from wishes
  // 3) remove wishes
  // 4) load new wishes
  // 5) add new eventlisteners to wishes
  // MAYBE: do I need a new event listener

  // TODO: eventlistener for edit wish buttons
  // TODO: eventlistener for delete wish buttons

  // TODO: eventlistener for add wish-idea button
  // TODO: eventlistener for add new wishlist button

  // TODO: eventlistener for -> settings

});
