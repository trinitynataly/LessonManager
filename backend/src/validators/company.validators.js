/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/09/2023
Defines validation functions for the Company entity.
*/

const Joi = require('joi'); // Import Joi library for validating input
const { Company } = require('../models'); // Import the Company model
const { ValidationError } = require('apollo-server'); // Import the Apollo error class

// Define the company validators
const companyValidator = {
  // Define a function to validate creation of a new company
  validateNewCompany: async (input) => {
    // Define the validation schema
    const schema = Joi.object({
      companyName: Joi.string().min(3).max(50).required(), // Company name is required
      description: Joi.string().allow('', null), // Description is optional
      address: Joi.string().allow('', null), // Address is optional
      contactEmail: Joi.string().email().required(), // Contact email is required and must be a valid email address
      contactPhone: Joi.string().pattern(/(\+61\d{9}|0\d{8})/).allow('', null), // Contact phone is optional and must be a valid Australian phone number
      logoUrl: Joi.string().uri().allow('', null), // Logo URL is optional and must be a valid URL
      timezone: Joi.string().allow('', null) // Timezone is optional
    });

    // Validate the input against the schema
    const { error } = schema.validate(input);
    if (error) { // If validation fails, throw an error
      throw new ValidationError(`Invalid input data: ${error.message}`);
    }

    // Check if email is unique
    const existingCompany = await Company.findOne({ contactEmail: new RegExp(`^${input.contactEmail}$`, 'i') });
    // If email is not unique, throw an error
    if (existingCompany) {
      throw new ValidationError('Email already in use in another company');
    }
  },

  // Define a function to validate updating an existing company
  validateUpdateCompany: async (_id, input) => {
    // Define the validation schema
    const schema = Joi.object({
      companyName: Joi.string().min(3).max(50).optional(), // Company name is optional
      description: Joi.string().allow('', null).optional(), // Description is optional
      address: Joi.string().allow('', null).optional(), // Address is optional
      contactEmail: Joi.string().email().optional(), // Contact email is optional and must be a valid email address
      contactPhone: Joi.string().pattern(/(\+61\d{9}|0\d{9})/).allow('', null).optional(), // Contact phone is optional and must be a valid Australian phone number
      logoUrl: Joi.string().uri().allow('', null).optional(), // Logo URL is optional and must be a valid URL
      timezone: Joi.string().allow('', null).optional() // Timezone is optional
    });

    // Validate the input against the schema
    const { error } = schema.validate(input);
    if (error) { // If validation fails, throw an error
      throw new ValidationError(`Invalid input data: ${error.message}`);
    }

    // Check if email is unique if it's being updated
    if (input.contactEmail) {
      // Check if email is unique (case-insensitive)
      const existingCompany = await Company.findOne({ contactEmail: new RegExp(`^${input.contactEmail}$`, 'i'), _id: { $ne: _id } });
      // If email is not unique, throw an error
      if (existingCompany) {
        throw new ValidationError('Email already in use in another company');
      }
    }
  }
};

// Export the company validators
module.exports = companyValidator;
