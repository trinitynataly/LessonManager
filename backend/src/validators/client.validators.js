/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Defines validation functions for the Company entity.
*/

const Joi = require('joi'); // Import Joi library for validating input
const { Client } = require('../models'); // Import the Client model
const { ValidationError } = require('apollo-server'); // Import the Apollo error class

// Define the client validators
const clientValidator = {
    // Define a function to validate creation of a new client
    validateNewClient: async (input) => {
        // Define the validation schema
        const schema = Joi.object({
            company: Joi.string().required(), // Company is required
            firstName: Joi.string().min(3).max(50).required(), // First name is required
            lastName: Joi.string().min(3).max(50).required(), // Last name is required
            email: Joi.string().email().required(), // Email is required and must be a valid email address
            phone: Joi.string().required(), // Phone is required and must be a valid Australian phone number
            address: Joi.string().allow('', null), // Address is optional
            city: Joi.string().allow('', null), // City is optional
            state: Joi.string().allow('', null), // State is optional
            postalCode: Joi.string().allow('', null), // postalCode is optional
            country: Joi.string().allow('', null), // Country is optional
        });

        // Validate the input against the schema
        const { error } = schema.validate(input);
        if (error) { // If validation fails, throw an error
            throw new ValidationError(`Invalid input data: ${error.message}`);
        }

        // Check if email is unique
        const existingEmail = await Client.findOne({ email: new RegExp(`^${input.email}$`, 'i') });
        // If email is not unique, throw an error
        if (existingEmail) {
            throw new ValidationError('Email already in use in another client');
        }

        // Check if phone is unique
        const existingPhone = await Client.findOne({ phone: new RegExp(`^${input.phone}$`, 'i') });
        // If phone is not unique, throw an error
        if (existingPhone) {
            throw new ValidationError('Phone already in use in another client');
        }
    },

    // Define a function to validate updating an existing client
    validateUpdateClient: async (_id, input) => {
        // Define the validation schema
        const schema = Joi.object({
            company: Joi.string().optional(), // Company is optional
            firstName: Joi.string().min(3).max(50).optional(), // First name is optional
            lastName: Joi.string().min(3).max(50).optional(), // Last name is optional
            email: Joi.string().email().optional(), // Email is required and must be a valid email address
            phone: Joi.string().optional(), // Phone is required and must be a valid Australian phone number
            address: Joi.string().allow('', null).optional(), // Address is optional
            city: Joi.string().allow('', null).optional(), // City is optional
            state: Joi.string().allow('', null).optional(), // State is optional
            postalCode: Joi.string().allow('', null).optional(), // postalCode is optional
            country: Joi.string().allow('', null).optional(), // Country is optional
        });

        // Validate the input against the schema
        const { error } = schema.validate(input);
        if (error) { // If validation fails, throw an error
            throw new ValidationError(`Invalid input data: ${error.message}`);
        }

        // Check if email is unique if it's being updated
        if (input.email) {
            // Check if email is unique (case-insensitive)
            const existingEmail = await Client.findOne({ email: new RegExp(`^${input.email}$`, 'i'), _id: { $ne: _id } });
            // If email is not unique, throw an error
            if (existingEmail) {
                throw new ValidationError('Email already in use in another client');
            }
        }

        // Check if phone is unique if it's being updated
        if (input.phone) {
            // Check if phone is unique (case-insensitive)
            const existingPhone = await Client.findOne({ phone: new RegExp(`^${input.phone}$`, 'i'), _id: { $ne: _id } });
            // If phone is not unique, throw an error
            if (existingPhone) {
                throw new ValidationError('Phone already in use in another client');
            }
        }
    }
};

// Export the client validators
module.exports = clientValidator;