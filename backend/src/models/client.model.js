/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Mongoose model for the Client entity.
Defines the schema and exports the Client model.
*/

// Import the Mongoose library for working with MongoDB
const mongoose = require('mongoose');
// Define the schema for the Company object
const clientSchema = new mongoose.Schema({
    // Define the field for the company associated with the client
    company: {
        type: mongoose.Schema.Types.ObjectId, // Company is stored as an object ID
        ref: 'Company', // Reference the Company model
    },
    // Define the field for the client's first name
    firstName: {
        type: String,
        required: true, // The client's first name is required
    },
    // Define the field for the client's last name
    lastName: {
        type: String,
        required: true, // The client's last name is required
    },
    // Define the field for the client's email
    email: {
        type: String,
        required: true, // The client's email is required
        unique: true, // Ensure the client's email is unique
        lowercase: true, // Convert the email to lowercase before saving it
        minlength: 5, // Minimum length of 5 characters
        maxlength: 255, // Maximum length of 255 characters
        validate: { // Validate the email format
            validator: function (v) { // Use a regular expression to validate the email format
                // The regular expression is taken from https://emailregex.com/
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: 'Invalid email address', // Throw an error message if validation fails
        },
    },
    // Define the field for the client's phone number
    phone: {
        type: String,
        required: true, // The client's phone number is required
        unique: true, // Ensure the client's phone number is unique
        minlength: 5, // Minimum length of 5 characters
        maxlength: 255, // Maximum length of 255 characters
        validate: { // Validate the phone number format
            validator: function (v) { // Use a regular expression to validate the phone number format
                // The regular expression is taken from https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
                return /^\+?\d{5,255}$/.test(v);
            },
            message: 'Invalid phone number', // Throw an error message if validation fails
        },
    },
    // Define the field for the client's address
    address: {
        type: String,
        required: true, // The client's address is required
    },
    // Define the field for the client's city
    city: {
        type: String,
        required: true, // The client's city is required
    },
    // Define the field for the client's state
    state: {
        type: String,
        required: true, // The client's state is required
    },
    // Define the field for the client's country
    country: {
        type: String,
        required: true, // The client's country is required
    },
    // Define the field for the client's postal code
    postalCode: {
        type: String,
        required: true, // The client's postal code is required
    },
});

// Create the Client model from the schema
const Client = mongoose.model('Client', clientSchema);

// Export the Client model to be used in other parts of the application
module.exports = Client;
