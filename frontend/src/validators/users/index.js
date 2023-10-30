/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
User validator
*/

import Joi from 'joi'; // Import the Joi module for validation

export const loginSchema = Joi.object({ // Define the login schema
    email: Joi.string() // Define the email field
        .email({ tlds: { allow: false } }) // Validate the email address
        .messages({ // Define the error messages
            'string.email': 'Email must be a valid email address.', // If the email is not valid
            'string.empty': 'Email is required.' // If the email is empty
        })
        .required(), // email is required
    password: Joi.string() // Define the password field
        .min(6) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Password must be at least 6 characters long.', // If the password is too short
            'string.empty': 'Password is required.' // If the password is empty
        })
        .required(), // password is required
});

export const registerSchema = Joi.object({ // Define the register schema
    email: Joi.string() // Define the email field
        .email({ tlds: { allow: false } }) // Validate the email address
        .messages({ // Define the error messages
            'string.email': 'Email must be a valid email address.', // If the email is not valid
            'string.empty': 'Email is required.' // If the email is empty
        })
        .required(), // email is required
    password: Joi.string() // Define the password field
        .min(6) // Set the minimum length
        .max(1024) // Set the maximum length
        .pattern( // Set the pattern
            new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'), // Define the pattern
            { name: 'password' } // Define the name of the pattern
        )
        .messages({ // Define the error messages
            'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.', // If the password does not match the pattern
            'string.min': 'Password must be at least 6 characters long.', // If the password is too short
            'string.max': 'Password must be at most 1024 characters long.', // If the password is too long
            'string.empty': 'Password is required.'  // If the password is empty
        })
        .required(), // password is required
    confirm_password: Joi.any() // Define the confirm_password field
        .valid(Joi.ref('password')) // Set the valid values
        .required() // confirm_password is required
        .label('Confirm Password') // Set the label
        .messages({ // Define the error messages
            'any.only': 'Passwords do not match.' // If the passwords do not match
        }),
    first_name: Joi.string() // Define the first_name field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'First name must be at least 3 characters long.', // If the first_name is too short
            'string.empty': 'First name is required.' // If the first_name is empty
         })
        .required(), // first_name is required
    last_name: Joi.string() // Define the last_name field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Last name must be at least 3 characters long.', // If the last_name is too short
            'string.empty': 'Last name is required.' // If the last_name is empty
         })
        .required(), // last_name is required
    companyName: Joi.string() // Define the companyName field
        .min(3) // Set the minimum length
        .messages({ 
            'string.min': 'Company name must be at least 3 characters long.', // If the companyName is too short
            'string.empty': 'Company name is required.' 
         })
        .required(), // companyName is required
});

export const profileSchema = Joi.object({  // Define the profile schema
    email: Joi.string() // Define the email field
        .email({ tlds: { allow: false } }) // Validate the email address
        .messages({ // Define the error messages
            'string.email': 'Email must be a valid email address.', // If the email is not valid
            'string.empty': 'Email is required.' // If the email is empty
        })
        .required(), // email is required
    first_name: Joi.string() // Define the first_name field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'First name must be at least 3 characters long.', // If the first_name is too short
            'string.empty': 'First name is required.' // If the first_name is empty
         })
        .required(), // first_name is required
    last_name: Joi.string() // Define the last_name field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Last name must be at least 3 characters long.', // If the last_name is too short
            'string.empty': 'Last name is required.' // If the last_name is empty
         })
        .required(), // last_name is required
});

export const updatePasswordSchema = Joi.object({ // Define the update password schema
    current_password: Joi.string() // Define the current_password field
        .messages({ // Define the error messages
            'string.empty': 'Password is required.' // If the password is empty
        })
        .required(), // current_password is required
    new_password: Joi.string() // Define the new_password field
        .min(6) // Set the minimum length
        .max(1024) // Set the maximum length
        .pattern( // Set the pattern
            new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'), // Define the pattern
            { name: 'password' } // Define the name of the pattern
        )
        .messages({ // Define the error messages
            'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',  // If the password does not match the pattern
            'string.min': 'Password must be at least 6 characters long.', // If the password is too short
            'string.max': 'Password must be at most 1024 characters long.', // If the password is too long
            'string.empty': 'Password is required.' // If the password is empty
        })
        .required(), // new_password is required
    repeat_password: Joi.any() // Define the repeat_password field
        .valid(Joi.ref('new_password')) // Set the valid values
        .required() // repeat_password is required
        .label('Confirm Password') // Set the label
        .messages({ // Define the error messages
            'any.only': 'Passwords do not match.' // If the passwords do not match
        }),
});

export const userSchema = (isEditMode) => Joi.object({ // Define the user schema
    email: Joi.string() // Define the email field
        .email({ tlds: { allow: false } }) // Validate the email address
        .messages({ // Define the error messages
            'string.email': 'Email must be a valid email address.', // If the email is not valid
            'string.empty': 'Email is required.' // If the email is empty
        })
        .required(), // email is required
    password: isEditMode // Check if the user is in edit mode
        ? Joi.string() // If the user is in edit mode
            .allow('') // Allow empty password
            .min(6) // Set the minimum length
            .max(1024) // Set the maximum length
            .pattern(  // Set the pattern
                new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'), // Define the pattern
                { name: 'password' } // Define the name of the pattern
            ).messages({ // Define the error messages
                'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.', // If the password does not match the pattern
                'string.min': 'Password must be at least 6 characters long.', // If the password is too short
                'string.max': 'Password must be at most 1024 characters long.', // If the password is too long
            })
            .optional() // Make password optional in edit mode
        : Joi.string() // Apply your existing validation rules in create mode
            .min(6) // Set the minimum length
            .max(1024) // Set the maximum length
            .pattern( // Set the pattern
                new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'), // Define the pattern
                { name: 'password' } // Define the name of the pattern
            ).messages({ // Define the error messages
                'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.', // If the password does not match the pattern
                'string.min': 'Password must be at least 6 characters long.', // If the password is too short
                'string.max': 'Password must be at most 1024 characters long.', // If the password is too long
                'string.empty': 'Password is required.' // If the password is empty
            })
            .required(), // password is required
    repeat_password: Joi.any() // Define the repeat_password field
        .valid(Joi.ref('password'))  // Set the valid values
        .required() // repeat_password is required
        .label('Confirm Password') // Set the label
        .messages({ // Define the error messages
            'any.only': 'Passwords do not match.' // If the passwords do not match
        }),
    first_name: Joi.string() // Define the first_name field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'First name must be at least 3 characters long.', // If the first_name is too short
            'string.empty': 'First name is required.' // If the first_name is empty
         })
        .required(), // first_name is required
    last_name: Joi.string() // Define the last_name field
        .min(3) // Set the minimum length
        .messages({ // Define the error messages
            'string.min': 'Last name must be at least 3 characters long.', // If the last_name is too short
            'string.empty': 'Last name is required.' // If the last_name is empty
         })
        .required(), // last_name is required
    level: Joi.number() // Define the level field
        .integer() // Set the type
        .min(0) // Set the minimum value
        .max(2) // Set the maximum value
        .messages({ // Define the error messages
            'number.min': 'This user level is not supported', // If the level is not supported
            'number.max': 'This user level is not supported', // If the level is not supported
            'number.empty': 'Level is required.' // If the level is empty
        })
        .required(), // level is required
    status: Joi.number() // Define the status field
        .integer() // Set the type
        .min(0) // Set the minimum value
        .max(1) // Set the maximum value
        .messages({ // Define the error messages
            'number.min': 'This user status is not supported', // If the status is not supported
            'number.max': 'This user status is not supported', // If the status is not supported
            'number.empty': 'Status is required.' // If the status is empty
        })
        .required(), // status is required
});