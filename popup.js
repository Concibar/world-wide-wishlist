document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
      chrome.tabs.getSelected(null, function(tab) {
          d = document;
          window.open('https://www.google.com/search?q=Zulqadar Idrishi', 'blank');
      });
  }, false);
}, false);
