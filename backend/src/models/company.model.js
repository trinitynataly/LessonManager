/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/09/2023
Mongoose model for the Company entity.
Defines the schema and exports the Company model.
*/

// Import the Mongoose library for working with MongoDB
const mongoose = require('mongoose');
// Define the schema for the Company object
const companySchema = new mongoose.Schema({
  // Define the field for the company name
  companyName: {
    type: String,
    required: true, // The company name is required
    unique: true, // Ensure the company name is unique
  }, 
  // Define the field for the company description
  description: String,
  // Define the field for the company address
  address: String,
  // Define the field for the company contact email
  contactEmail: String,
  // Define the field for the company contact phone number
  contactPhone: String,
  // Define the field for the URL of the company's logo
  logoUrl: String,
  // Define the field for the company's timezone
  timezone: String,
});

// Create the Company model from the schema
const Company = mongoose.model('Company', companySchema);

// Export the Company model to be used in other parts of the application
module.exports = Company;
