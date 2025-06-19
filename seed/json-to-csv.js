const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import the UUID generator

/**
 * Escapes a string value for CSV, handling commas, double quotes, and newlines.
 * @param {*} value The value to escape.
 * @returns {string} The CSV-safe string.
 */
function escapeCsvValue(value) {
  if (value === null || typeof value === 'undefined') {
    return ''; // Represent null/undefined as empty string in CSV
  }
  let stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    stringValue = stringValue.replace(/"/g, '""');
    stringValue = `"${stringValue}"`;
  }
  return stringValue;
}

/**
 * Converts an array of JSON objects to a CSV string, generating a UUID for the 'id' field.
 * @param {Array<Object>} jsonArray The array of JSON objects.
 * @returns {string|null} The CSV string, or null if input is invalid.
 */
function jsonToCsv(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    console.error('Input is not a non-empty array.');
    return null;
  }

  // Determine headers. 'id' will be the first column.
  // Other headers are taken from the keys of the first object, excluding 'id' to avoid duplication if it existed.
  const firstObjectKeys = Object.keys(jsonArray[0]);
  const otherHeaders = firstObjectKeys.filter((key) => key !== 'id');
  const headers = ['id', ...otherHeaders]; // 'id' is guaranteed to be the first header

  const csvRows = [];

  // Add header row
  csvRows.push(headers.map(escapeCsvValue).join(','));

  // Add data rows
  for (const originalRow of jsonArray) {
    // Create a new object for processing to avoid modifying the original array/objects
    const processedRow = { ...originalRow };
    processedRow.id = uuidv4(); // Generate and assign/overwrite UUID for the 'id' field

    const values = headers.map((header) => {
      // processedRow[header] will correctly pick up the new UUID for the 'id' header.
      // If a header (from otherHeaders) isn't in a particular originalRow (for inconsistent JSON objects),
      // processedRow[header] would be undefined, and escapeCsvValue handles it.
      return escapeCsvValue(processedRow[header]);
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// --- Main execution logic ---
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node json-to-csv.js <inputFile.json> [outputFile.csv]');
    console.log("Generates a new UUID for the 'id' field in the output CSV.");
    console.log(
      'If outputFile.csv is not provided, CSV will be printed to console.',
    );
    console.log('\nExample (save your JSON as data.json first):');
    console.log('  node json-to-csv.js data.json output-with-uuids.csv');
    return;
  }

  const inputFilePath = args[0];
  const outputFilePath = args[1] || null;

  let jsonData;
  try {
    const fileContent = fs.readFileSync(path.resolve(inputFilePath), 'utf8');
    jsonData = JSON.parse(fileContent);
  } catch (error) {
    console.error(
      `Error reading or parsing JSON file "${inputFilePath}":`,
      error.message,
    );
    return;
  }

  const csvString = jsonToCsv(jsonData);

  if (csvString) {
    if (outputFilePath) {
      try {
        fs.writeFileSync(path.resolve(outputFilePath), csvString);
        console.log(
          `CSV data with generated UUIDs successfully written to "${outputFilePath}"`,
        );
      } catch (error) {
        console.error(
          `Error writing CSV to file "${outputFilePath}":`,
          error.message,
        );
      }
    } else {
      console.log("\n--- CSV Output (with generated UUIDs for 'id') ---");
      console.log(csvString);
    }
  }
}

// If you want to test directly without command line args, uncomment and modify:
/*
(function testDirectly() {
  console.log("--- Direct Test ---");
  const csvOutput = jsonToCsv(exampleJsonData);
  if (csvOutput) {
    console.log(csvOutput);
  }
})();
*/

// Only run main if the script is executed directly
if (require.main === module) {
  main();
}

// Export for potential programmatic use (optional)
module.exports = { jsonToCsv, escapeCsvValue };
