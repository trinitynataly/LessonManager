/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Mongoose model for the User entity.
Defines the schema and exports the User model.
*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define your secret pepper value
const pepper = 'your_secret_pepper_value'; // Replace with your actual pepper value

// Define the schema for the User entity
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true, // First name is required
  },
  last_name: {
    type: String,
    required: true, // Last name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Ensure email is unique
    lowercase: true, // Store email in lowercase
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Reference the Company model
  },
  level: {
    type: Number,
    enum: [0, 1, 2], // Possible values: 0, 1, 2
    default: 0, // Default value: 0 (user)
  },
  registrationDate: {
    type: Date,
    default: Date.now, // Default value: current date and time
  },
  lastAccess: {
    type: Date,
  },
  lastUpdate: {
    type: Date,
    default: Date.now, // Default value: current date and time
  },
  status: {
    type: Number,
    enum: [0, 1], // Possible values: 0 (inactive), 1 (active)
    default: 1, // Default value: 1 (active)
  },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function(next) {
  console.log('zzz');
  if (!this.isModified('password')) {
    return next(); // Skip if password is not modified
  }

  try {
    const saltRounds = 10; // You can adjust this value
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Combine password with pepper before hashing
    const pepperedPassword = this.password + pepper;
    
    // Hash the password using the generated salt and pepper
    const hashedPassword = await bcrypt.hash(pepperedPassword, salt);
    this.password = hashedPassword; // Replace plain password with hash
    next();
  } catch (error) {
    return next(error);
  }
});

// Create a Mongoose model named 'User' using the defined schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
