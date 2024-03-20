/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 20/02/2024
Validators for the Calendar entity.
*/

const Joi = require('joi'); // Import Joi library for validating input
const { Calendar } = require('../models'); // Import the Calendar model
const { ValidationError } = require('apollo-server'); // Import the Apollo error class

// Define the calendar validators
const calendarValidator = {
    // Define a function to validate creation of a new calendar
    validateCalendar: async (input) => {
        // Define the validation schema
        const schema = Joi.object({
            calendarName: Joi.string().required(), // Calendar name is required
            user: Joi.string().email().required(), // User is required
        });

        // Validate the input against the schema
        const { error } = schema.validate(input);
        if (error) { // If validation fails, throw an error
            throw new ValidationError(`Invalid input data: ${error.message}`);
        }
        // After validating the input, check for overlapping calendars
        const overlappingCalendars = await Calendar.find({
            $and: [ // Find calendars where both conditions true
                {
                    user: input.user, // Existing calendar is for the same user
                },
                {
                    calendarName: input.calendarName, // Existing calendar has the same name
                }
            ]
        });
        if (overlappingCalendars.length > 0) { // If overlapping calendars found, throw an error
            throw new ValidationError('A calendar with the same name already exists for this user');
        }
    },
};

// Export the calendar validators
module.exports = calendarValidator;