/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
Mongoose model for the User entity.
Defines the schema and exports the User model.
*/

const mongoose = require('mongoose'); // Import the Mongoose library

// Define the schema for the User entity
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true, // First name is required
  },
  last_name: {
    type: String,
    required: true, // Last name is required
  } 
});

// Create a Mongoose model named 'User' using the defined schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the User model