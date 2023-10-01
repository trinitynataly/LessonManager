/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Mongoose model for the User entity.
Defines the schema and exports the User model.
*/

const mongoose = require('mongoose');
const {generateAuthTokens, refreshAuthTokens, generatePassswordHash, comparePasswordHash} = require('../helpers/auth');

// Define the schema for the User entity
const userSchema = new mongoose.Schema({
  // Define the field for the user's first name
  first_name: {
    type: String, // First name is stored as a string
    required: true, // First name is required
  },
  // Define the field for the user's last name
  last_name: {
    type: String, // Last name is stored as a string
    required: true, // Last name is required
  },
  // Define the field for the user's email
  email: {
    type: String, // Email is stored as a string
    required: true, // Email is required
    unique: true,  // Ensure the email is unique
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
  // Define the field for the user's password
  password: {
    type: String, // Password is stored as a string
    required: true, // Password is required
    minlength: 6, // Minimum length of 6 characters
    maxlength: 1024, // Maximum length of 1024 characters
    validate: { // Validate the password format
      validator: function (v) { // Use a regular expression to validate the password format
        // The regular expression is taken from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,1024}$/.test(v);
      },
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one digit', // Throw an error message if validation fails
    },
  },
  // Define the field for the company associated with the user
  company: {
    type: mongoose.Schema.Types.ObjectId, // Company is stored as an object ID
    ref: 'Company', // Reference the Company model
  },
  // Define the field for the user's level
  level: {
    type: Number, // Level is stored as a number
    enum: [0, 1, 2], // Possible values: 0 (user), 1 (company admin), 2 (super admin)
    default: 0, // Default value: 0 (user)
  },
  // Define the field for the date of user registration
  registrationDate: {
    type: Date, // Date is stored as a date
    default: Date.now, // Default value: current date and time
  },
  // Define the field for the date of last user access
  lastAccess: {
    type: Date, // Date is stored as a date
  },
  // Define the field for the date of last user profile update
  lastUpdate: {
    type: Date, // Date is stored as a date
    default: Date.now, // Default value: current date and time
  },
  // Define the field for the user's status
  status: {
    type: Number, // Status is stored as a number
    enum: [0, 1], // Possible values: 0 (inactive), 1 (active)
    default: 1, // Default value: 1 (active)
  },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function(next) {
  // Check if the password is modified
  if (!this.isModified('password')) {
    return next(); // Skip if password is not modified
  }

  // Hash the password
  try {
    // Generate a new password hash
    this.password = generatePassswordHash(this.password);
    // Continue
    next();
  } catch (error) { // Catch any errors
    // Pass the error to the next middleware
    return next(error);
  }
});

// Add a method to the user schema that compares a password hash with a password
userSchema.methods.comparePassword = async function (password) {
  // Return the result of comparing the password with the password hash
  return await comparePasswordHash(password, this.password);
};

// Add a method to the user schema that generates a JSON web token
userSchema.methods.generateAuthTokens = function () {
  // Generate a token that includes the user's ID, username, and email
  return generateAuthTokens(this);
};

// Create a Mongoose model named 'User' using the defined schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
