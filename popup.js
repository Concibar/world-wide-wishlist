document.addEventListener('DOMContentLoaded', function() { // this waits for the popup.html to fully load
  // Makes the button open it's link in a new Tab
  // var checkPageButton = document.getElementById('checkPage');
  // checkPageButton.addEventListener('click', function() {
  //     var url = checkPageButton.getAttribute('href');
  //     window.open(url, 'blank');
  // }, false);

  wishConnectionCheck();

  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    document.getElementById('wish-name').innerText = tabs[0].title;
  });

  // Makes the button insert some html into the popup
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
  }, false);
}, false);
