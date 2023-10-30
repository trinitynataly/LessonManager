/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Company validator
*/

import Joi from 'joi'; // Import the Joi module for validation

export const companySchema = Joi.object({ // Define the company schema
    companyName: Joi.string() // Define the companyName field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Company name must be at least 3 characters long.', // If the companyName is too short
            'string.empty': 'Company name is required.' // If the companyName is empty
         })
        .required(), // companyName is required
    description: Joi.string() // Define the description field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Description must be at least 3 characters long.', // If the description is too short
            'string.empty': 'Description is required.' // If the description is empty
         })
        .required(), // description is required
    address: Joi.string() // Define the address field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Address must be at least 3 characters long.', // If the address is too short
            'string.empty': 'Address is required.' // If the address is empty
         })
        .required(), // address is required
    contactEmail: Joi.string() // Define the contactEmail field
        .email({ tlds: { allow: false } }) // Validate the email address
        .messages({ // Define the error messages
            'string.email': 'Email must be a valid email address.', // If the email is not valid
            'string.empty': 'Email is required.' // If the email is empty
        })
        .required(), // contactEmail is required
    contactPhone: Joi.string() // Define the contactPhone field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Phone must be at least 3 characters long.', // If the phone is too short
            'string.empty': 'Phone is required.' // If the phone is empty
         })
        .required(), // contactPhone is required
});
