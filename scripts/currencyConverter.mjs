
console.log("Currency Converter connected!");

// This function fetches the current exchange rate from the ECB API
async function fetchExchangeRate() {
  try {
    const response = await fetch('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    } else {
      // Parse the XML response here
      // Create a new DOMParser instance
      const parser = new DOMParser();

      // XML string to parse
      const xmlString = response;

      // Parse the XML string
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

      // Access the text content of the <item> element
      const itemText = xmlDoc.getElementsByTagName('item')[0].textContent;

      // Log the text content
      console.log(itemText); // Output: Example Item
      // This is a simplified example; parsing XML requires additional steps
      console.log("Exchange rate fetched successfully");
    }
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
  }
}

// Call the function to fetch the exchange rate
fetchExchangeRate();
