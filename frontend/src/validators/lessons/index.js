/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 05/10/2024
Validation schema for lessons
*/

import Joi from 'joi'; // Import the Joi module for validation

// Define the lesson schema
export const lessonSchema = Joi.object({ 
    lessonName: Joi.string() // Validate lessonName as a string
        .required() // lessonName is required
        .messages({
            'string.empty': 'Lesson name is required.'
        }),
    description: Joi.string() // Validate description as a string
        .allow('') // Allow description to be empty
        .optional(), // description is optional
    client: Joi.string() // Validate client as a string
        .required() // client is required
        .messages({
            'string.empty': 'Client ID is required.'
        }),
    user: Joi.string() // Validate user as a string
        .required() // user is required
        .messages({
            'string.empty': 'User ID is required.'
        }),
    start: Joi.date() // Validate start as a date
        .required() // start is required
        .messages({
            'date.base': 'A valid start date is required.'
        }),
    duration: Joi.number() // Validate duration as a number
        .integer() // duration should be an integer
        .min(30) // Minimum duration
        .max(120) // Maximum duration
        .required() // duration is required
        .messages({
            'number.base': 'Duration must be a number.',
            'number.min': 'Duration must be at least 30 minutes.',
            'number.max': 'Duration must be no more than 120 minutes.'
        }),
    lessonType: Joi.string() // Validate lessonType as a string
        .valid('lesson', 'training', 'meeting', 'event', 'other') // Enum validation
        .required() // lessonType is required
        .messages({
            'any.only': 'Lesson type must be one of lesson, training, meeting, event, or other.'
        }),
    importance: Joi.number() // Validate importance as a number
        .integer() // importance should be an integer
        .min(0) // Minimum importance
        .max(5) // Maximum importance
        .optional() // importance is optional
        .default(0), // Default value for importance
    mood: Joi.string() // Validate mood as a string
        .valid('happy', 'sad', 'interested', 'tired', 'frustrated', 'angry', 'surprised', 'confident', 'nervous', 'indifferent', 'neutral') // Enum validation for moods
        .optional() // mood is optional
        .default('neutral'), // Default value for mood
});
