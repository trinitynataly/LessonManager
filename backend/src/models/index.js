/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
Load and export all model files within the current directory.
Responsible for importing and exporting all the model files for the application.
*/

const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module

let models = {}; // Create an empty object to store the models

// Read all files in the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    // Filter out the current file (index.js) and any non-JS files
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Import each model file
    const model = require(path.join(__dirname, file)); // Import the model file
    const modelName = file.split('.')[0]; // Extract the model name by removing '.js' extension
    models[modelName] = model; // Add the imported model to the models object
  });

module.exports = models; // Export the object containing all the models
