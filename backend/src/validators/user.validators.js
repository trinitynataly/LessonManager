/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Defines validation functions for the User entity.
*/

const Joi = require('joi');
const { Company, User } = require('../models'); // Import the Company model

const userValidator = {
  validateNewUser: async (input) => {
    const schema = Joi.object({
      first_name: Joi.string().min(2).max(50).required(),
      last_name: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, 'password').required(),
      company: Joi.string().required(),
      level: Joi.number().integer().min(0).max(2).optional(),
      status: Joi.number().integer().min(0).max(1).optional()
    });

    const { error } = schema.validate(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if email is unique (case-insensitive)
    const existingUser = await User.findOne({ email: new RegExp(`^${input.email}$`, 'i') });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Check if the company ID exists
    const existingCompany = await Company.findById(input.company);
    if (!existingCompany) {
      throw new Error('Invalid company ID');
    }
  },

  validateUpdateUser: async (_id, input) => {
    const schema = Joi.object({
      first_name: Joi.string().min(2).max(50).optional(),
      last_name: Joi.string().min(2).max(50).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, 'password').optional(),
      company: Joi.string().optional(),
      level: Joi.number().integer().min(0).max(2).optional(),
      status: Joi.number().integer().min(0).max(1).optional()
    });

    const { error } = schema.validate(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if email is unique if it's being updated (case-insensitive)
    if (input.email) {
      const existingUser = await User.findOne({ email: new RegExp(`^${input.email}$`, 'i'), _id: { $ne: _id } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // If company ID is being updated, check if it exists
    if (input.company) {
      const existingCompany = await Company.findById(input.company);
      if (!existingCompany) {
        throw new Error('Invalid company ID');
      }
    }
  }
};

module.exports = userValidator;
