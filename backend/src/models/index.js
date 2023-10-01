/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/09/2023
Load and export all model files within the current directory.
Responsible for importing and exporting all the model files for the application.
*/

// Import the glob module
const glob = require('glob');

 // Create an empty object to store the models
let models = {};
// Find all model files within the current directory
const modelFiles = glob.sync('src/models/*.model.js');
// Load model files from the current directory
modelFiles.forEach(file => {
    // Import the model file
    const model = require(`../../${file}`);
    // Extract the model name by removing the path and '.model.js' extension
    let modelName = file.split('/').pop().replace('.model.js', '');
    // Capitalize the first letter of the model name
    modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    // Add the imported model to the models object
    models[modelName] = model;
});
// Export the object containing all the models
module.exports = models; 
