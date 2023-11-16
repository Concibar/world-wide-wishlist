document.addEventListener('DOMContentLoaded', function() { // this waits for the popup.html to fully load
  // Makes the button open it's link in a new Tab
  // var checkPageButton = document.getElementById('checkPage');
  // checkPageButton.addEventListener('click', function() {
  //     var url = checkPageButton.getAttribute('href');
  //     window.open(url, 'blank');
  // }, false);

  // Makes the button insert some html into the popup
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      document.getElementById('title-insert').innerText = tabs[0].title;
    });
  }, false);
}, false);
