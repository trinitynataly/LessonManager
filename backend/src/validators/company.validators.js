/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Defines validation functions for the Company entity.
*/

const Joi = require('joi'); // Import Joi library for validating input
const { Company } = require('../models'); // Import the Company model

// Define the company validators
const companyValidator = {
  // Define a function to validate creation of a new company
  validateNewCompany: async (input) => {
    // Define the validation schema
    const schema = Joi.object({
      companyName: Joi.string().min(3).max(50).required(),
      description: Joi.string().allow('', null),
      address: Joi.string().allow('', null),
      contactEmail: Joi.string().email().required(),
      contactPhone: Joi.string().pattern(/(\+61\d{9}|0\d{8})/).allow('', null),
      logoUrl: Joi.string().uri().allow('', null),
      timezone: Joi.string().allow('', null)
    });

    const { error } = schema.validate(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if email is unique
    const existingCompany = await Company.findOne({ contactEmail: new RegExp(`^${input.contactEmail}$`, 'i') });
    if (existingCompany) {
      throw new Error('Email already in use');
    }
  },

  // Define a function to validate updating an existing company
  validateUpdateCompany: async (_id, input) => {
    const schema = Joi.object({
      companyName: Joi.string().min(3).max(50).optional(),
      description: Joi.string().allow('', null).optional(),
      address: Joi.string().allow('', null).optional(),
      contactEmail: Joi.string().email().optional(),
      contactPhone: Joi.string().pattern(/(\+61\d{9}|0\d{9})/).allow('', null).optional(),
      logoUrl: Joi.string().uri().allow('', null).optional(),
      timezone: Joi.string().allow('', null).optional()
    });

    const { error } = schema.validate(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if email is unique if it's being updated
    if (input.contactEmail) {
      const existingCompany = await Company.findOne({ contactEmail: new RegExp(`^${input.contactEmail}$`, 'i'), _id: { $ne: _id } });
      if (existingCompany) {
        throw new Error('Email already in use');
      }
    }
  },

  // You can add more validation functions as needed
};

module.exports = companyValidator;
