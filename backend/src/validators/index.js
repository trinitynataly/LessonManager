/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 30/08/2023
Load and export all validator files within the current directory.
Responsible for importing and exporting all the validator files for the application.
*/

const fs = require('fs');
const path = require('path');

const validators = {};

// Read all files in the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    // Filter out non-JavaScript files and the current index.js file
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const validator = require(path.join(__dirname, file));

    // Extract the main part of the filename, for example: "company" from "company.validators.js"
    const validatorName = file.split('.')[0];

    // Convert to camelCase for more natural JavaScript usage
    const camelCasedName = validatorName.charAt(0).toUpperCase() + validatorName.slice(1) + 'Validator';

    validators[camelCasedName] = validator;
  });

module.exports = validators;
