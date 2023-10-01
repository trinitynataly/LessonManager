/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/09/2023
Load and export all validator files within the current directory.
Responsible for importing and exporting all the validator files for the application.
*/

// Import the glob module
const glob = require('glob');
// Create an empty object to store the validators
const validators = {};
// Find all validator files within the current directory
const validatorFiles = glob.sync('src/validators/*.validators.js');
// Load validator files from the current directory
validatorFiles.forEach(file => {
  // Import the validator file
  const validator = require(`../../${file}`);
  // Extract the validator name by removing the path and '.validators.js' extension
  let validatorName = file.split('/').pop().replace('.validators.js', ''); 
  // Capitalize the first letter of the validator name and add 'Validator' to the end
  validatorName = validatorName.charAt(0).toUpperCase() + validatorName.slice(1) + 'Validator';
  // Add the imported validator to the validators object
  validators[validatorName] = validator; 
});
// Export the object containing all the validators
module.exports = validators;
