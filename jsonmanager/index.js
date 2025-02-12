const axios = require('axios');

// Replace with your jsonbin.io API URL and your API Key
const BIN_ID = '<YOUR_BIN_ID>';
const API_KEY = '<YOUR_API_KEY>';
const jsonBinUrl = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Function to read data from JSONbin.io
async function readDataFromJsonBin() {
  try {
    const response = await axios.get(jsonBinUrl, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    return response.data.record;
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
}

// Function to write sorted data back to JSONbin.io
async function writeDataToJsonBin(data) {
  try {
    const response = await axios.put(jsonBinUrl, data, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    console.log('Data updated successfully:', response.data);
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

// Function to sort data by date (assuming each item has a 'date' property)
function sortDataByDate(data) {
  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Main function to read, sort, and overwrite the JSON file
async function processData() {
  const data = await readDataFromJsonBin();

  if (data) {
    const sortedData = sortDataByDate(data);
    await writeDataToJsonBin(sortedData);
  }
}

// Trigger function - simulate button click with a call to processData
function trigger() {
  processData().catch((error) => {
    console.error('Error during process:', error);
  });
}

// For now, trigger on a button click
document.getElementById('triggerButton').addEventListener('click', trigger);
