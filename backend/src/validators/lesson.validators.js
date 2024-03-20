/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 02/03/2024
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
            user: Joi.string().required(), // User is required
            start: Joi.date().required(), // Start is required
            duration: Joi.number().min(30).max(120).required(), // Duration is required
            lessonType: Joi.string().valid('training', 'lesson', 'meeting', 'event', 'other').optional(), // Lesson type is optional, defalut will be assigned as other
            importance: Joi.number().min(0).max(5).optional(), // Importance is optional, defaulr will be assigned as 0
            mood: Joi.string().valid('happy', 'sad', 'interested', 'tired', 'frustrated', 'angry', 'surprised', 'confident', 'nervous', 'indifferent', 'neutral').optional(), // Mood is optional, default will be assigned as neutral
        }); 

        // Validate the input against the schema
        const { error } = schema.validate(input);
        if (error) { // If validation fails, throw an error
            throw new ValidationError(`Invalid input data: ${error.message}`);
        }

        // Convert start to a Date object if it's not already
        if (!(input.start instanceof Date)) {
            input.start = new Date(input.start);
        }

        // Check if conversion was successful
        if (isNaN(input.start.getTime())) {
            throw new ValidationError('Invalid start date.');
        }

        // After validating the input, check for overlapping lessons
        /*const overlappingLessons = await Lesson.find({
            $and: [
                {
                    $or: [
                        { user: input.user },
                        { client: input.client }
                    ]
                },
                {
                    $or: [
                        {
                            start: {
                                $gte: input.start,
                                $lt: new Date(input.start.getTime() + input.duration * 60000)
                            }
                        },
                        {
                            $expr: {
                                $and: [
                                    { $lt: ["$start", new Date(input.start.getTime() + input.duration * 60000)] },
                                    { $gt: [{ $add: ["$start", { $multiply: ["$duration", 60000] }] }, input.start] }
                                ]
                            }
                        },
                        {
                            start: { $lte: input.start },
                            $expr: {
                                $gte: [{ $add: ["$start", { $multiply: ["$duration", 60000] }] }, new Date(input.start.getTime() + input.duration * 60000)]
                            }
                        }
                    ]
                }
            ]
        });

        // If there are overlapping lessons, throw a validation error
        if (overlappingLessons.length > 0) {
            throw new ValidationError('A lesson is already booked for the specified time slot.');
        }*/
    },
};

// Export the lesson validators
module.exports = lessonValidator;