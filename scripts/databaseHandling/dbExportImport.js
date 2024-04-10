import Wish from '../models/wish.js'
import Wishlist from '../models/wishlist.js'

export async function exportDatabase() {
  // TODO:
  // 1) read wishlists and wishes
  // 2) parse both into text-data
}

function generateJsonData() {
  // Example data
  const data = {
     name: "John Doe",
     age: 30,
     city: "New York"
  };

  // Convert the data to a JSON string
  const jsonString = JSON.stringify(data, null, 2); // Pretty-printed JSON
  return jsonString;
 }

 function downloadJsonFile(jsonString, filename) {
  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Use the chrome.downloads API to download the file
  chrome.downloads.download({
     url: url,
     filename: filename,
     saveAs: true // Prompts the user to save the file
  }, function(downloadId) {
     console.log('Download started with ID: ' + downloadId);
     // Release the URL object to free up memory
     URL.revokeObjectURL(url);
  });
 }

export async function importDatabase() {
  // TODO:
  // 1) parse giant text input as json
  // 2) for-each through wishlists; check ID doubling and save non-doubles
  // 3) for-each through wishes; check ID doubling and save non-doubles
}
