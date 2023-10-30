/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Client validator
*/

import Joi from 'joi'; // Import the Joi module for validation

export const clientSchema = Joi.object({ // Define the client schema
    firstName: Joi.string() // Define the firstName field
        .messages({ // Define the error messages
            'string.empty': 'First name is required.' // If the firstName is empty
         })
        .required(), // firstName is required
    lastName: Joi.string() // Define the lastName field
        .messages({ // Define the error messages
            'string.empty': 'Last name is required.' // If the lastName is empty
         })
        .required(), // lastName is required
    email: Joi.string() // Define the email field
        .email({ tlds: { allow: false } }) // Validate the email address
        .messages({ // Define the error messages
            'string.email': 'Email must be a valid email address.', // If the email is not valid
            'string.empty': 'Email is required.'  // If the email is empty
        })
        .required(), // email is required
    phone: Joi.string() // Define the phone field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Phone must be at least 3 characters long.', // If the phone is too short
            'string.empty': 'Phone is required.' // If the phone is empty
         })
        .required(), // phone is required
    address: Joi.string().allow('').optional(), // Define the address field
    city: Joi.string().allow('').optional(), // Define the city field
    state: Joi.string().allow('').optional(), // Define the state field
    postalCode: Joi.string().allow('').optional(), // Define the postalCode field
    country: Joi.string().allow('').optional(), // Define the country field
});