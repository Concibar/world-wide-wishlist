document.addEventListener('DOMContentLoaded', function() { // this waits for the popup.html to fully load
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
      var url = checkPageButton.getAttribute('href');
      window.open(url, 'blank');
  }, false);
}, false);
