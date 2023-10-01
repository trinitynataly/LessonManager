/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/09/2023
Defines validation functions for the User entity.
*/

const Joi = require('joi'); // Import Joi library for validating input
const { ValidationError } = require('apollo-server'); // Import the Apollo error class
const { Company, User } = require('../models'); // Import the Company model

// Define the user validators
const userValidator = {
  // Define a function to validate creation of a new user
  validateLoginUser: async (input) => {
    // Define the validation schema
    const schema = Joi.object({
      email: Joi.string().email().min(5).max(255).required(), // Email is required and must be a valid email address
      password: Joi.string().min(6).max(1024).required() // Password is required
    });
    // Validate the input against the schema
    const { error } = schema.validate(input);
    if (error) { // If validation fails, throw an error
      throw new ValidationError(`Invalid input data: ${error.message}`);
    }
  },
  // Define a function to validate creation of a new user
  validateNewUser: async (input) => {
    // Define the validation schema
    const schema = Joi.object({
      first_name: Joi.string().min(2).max(50).required(), // First name is required
      last_name: Joi.string().min(2).max(50).required(), // Last name is required
      email: Joi.string().email().min(5).max(255).required(), // Email is required and must be a valid email address
      password: Joi.string().min(6).max(1024).required(), // Password is required
      company: Joi.string().required(), // Company ID is required
      level: Joi.number().integer().min(0).max(2).optional(), // User level is optional
      status: Joi.number().integer().min(0).max(1).optional() // User status is optional
    });

    // Validate the input against the schema
    const { error } = schema.validate(input);
    if (error) { // If validation fails, throw an error
      throw new ValidationError(`Invalid input data: ${error.message}`);
    }

    // Check if email is unique (case-insensitive)
    const existingUser = await User.findOne({ email: new RegExp(`^${input.email}$`, 'i') });
    // If email is not unique, throw an error
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    // Check if the company ID exists
    const existingCompany = await Company.findById(input.company);
    // If the company ID doesn't exist, throw an error
    if (!existingCompany) {
      throw new ValidationError('Invalid company ID');
    }
  },

  // Define a function to validate updating an existing user
  validateUpdateUser: async (_id, input) => {
    // Define the validation schema
    const schema = Joi.object({
      first_name: Joi.string().min(2).max(50).optional(), // First name is optional
      last_name: Joi.string().min(2).max(50).optional(), // Last name is optional
      email: Joi.string().email().min(5).max(255).optional(), // Email is optional and must be a valid email address
      password: Joi.string().min(6).max(1024).optional(), // Password is optional
      company: Joi.string().optional(), // Company ID is optional
      level: Joi.number().integer().min(0).max(2).optional(), // User level is optional
      status: Joi.number().integer().min(0).max(1).optional() // User status is optional
    });

    // Validate the input against the schema
    const { error } = schema.validate(input);
    // If validation fails, throw an error
    if (error) {
      throw new ValidationError(`Invalid input data: ${error.message}`);
    }

    // Check if email is unique if it's being updated (case-insensitive)
    if (input.email) {
      // Check if email is unique
      const existingUser = await User.findOne({ email: new RegExp(`^${input.email}$`, 'i'), _id: { $ne: _id } });
      // If email is not unique, throw an error
      if (existingUser) {
        throw new ValidationError('Email already in use');
      }
    }

    // If company ID is being updated, check if it exists
    if (input.company) {
      // Check if the company ID exists
      const existingCompany = await Company.findById(input.company);
      // If the company ID doesn't exist, throw an error
      if (!existingCompany) {
        throw new ValidationError('Invalid company ID');
      }
    }
  }
};

// Export the user validators
module.exports = userValidator;
