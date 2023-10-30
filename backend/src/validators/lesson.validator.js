/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Defines validation functions for the Lesson entity.
*/

const Joi = require('joi'); // Import Joi library for validating input
const { Lesson } = require('../models'); // Import the Lesson model
const { ValidationError } = require('apollo-server'); // Import the Apollo error class

// Define the lesson validators
const lessonValidator = {
    // Define a function to validate creation of a new lesson
    validateLesson: async (input) => {
        // Define the validation schema
        const schema = Joi.object({
            lessonName: Joi.string().required(), // Lesson name is required
            description: Joi.string().required().allow('', null), // Description is optional
            client: Joi.string().required(), // Client is required
            user: Joi.string().email().required(), // User is required
            start: Joi.date().required(), // Start is required
            duration: Joi.number().min(30).max(120).required(), // Duration is required
           });

        // Validate the input against the schema
        const { error } = schema.validate(input);
        if (error) { // If validation fails, throw an error
            throw new ValidationError(`Invalid input data: ${error.message}`);
        }
        // After validating the input, check for overlapping lessons
        const overlappingLessons = await Lesson.find({
            $and: [ // Find lessons where both conditions true
                {
                    $or: [ // Find lessons where either condition is true
                        { user: input.user }, // Scenario 1: Existing lesson is for the same user
                        { client: input.client } // Scenario 2: Existing lesson is for the same client
                    ]
                },
                {
                    $or: [ // Find lessons where either condition is true
                        // Scenario 1: Existing lesson starts during the new lesson
                        {
                            start: { // Compare start of the existing lesson
                                $gte: input.start, // Start is greater than or equal to the start of the new lesson
                                $lt: new Date(input.start.getTime() + input.duration * 60000) // Start is less than the end of the new lesson (start + duration)
                            }
                        },
                        // Scenario 2: Existing lesson ends during the new lesson
                        {
                            $expr: { // Compare the end of the existing lesson
                                $and: [ // Both conditions must be true
                                    { $lt: ["$start", new Date(input.start.getTime() + input.duration * 60000)] }, // End is less than the end of the new lesson (start + duration) 
                                    { $gt: [{ $add: ["$start", { $multiply: ["$duration", 60000] }] }, input.start] } // End is greater than the start of the new lesson
                                ]
                            }
                        },
                        // Scenario 3: Existing lesson entirely encompasses the new lesson
                        {
                            start: { $lte: input.start }, // Start is less than or equal to the start of the new lesson
                            $expr: { // Compare the end of the existing lesson
                                $gte: [{ $add: ["$start", { $multiply: ["$duration", 60000] }] }, new Date(input.start.getTime() + input.duration * 60000)] // End is greater than or equal to the end of the new lesson (start + duration)   
                            }
                        }
                    ]
                }
            ]
        });
        // If there are overlapping lessons, throw a validation error
        if (overlappingLessons.length > 0) {
            // If there are overlapping lessons, throw a validation error
            throw new ValidationError('A lesson is already booked for the specified time slot.');
        }

    },
};

// Export the client validators
module.exports = lessonValidator;