/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 05/03/2024
Mongoose model for the Lesson entity.
Defines the schema and exports the Lesson model.
*/

// Import the Mongoose library for working with MongoDB
const mongoose = require('mongoose');
// Define the schema for the Lesson object
const lessonSchema = new mongoose.Schema({
  // Define the field for the lesson name
  lessonName: {
    type: String,
    required: true, // The lesson name is require
  }, 
  // Define the field for the lesson description
  description: String,
  // Define the field for the client
  client: {
    type: mongoose.Schema.Types.ObjectId, // Client is stored as an object ID
    ref: 'Client', // Reference the Client model
    required: true, // The client is required
  },
  // Define the field for the user
  user: {
    type: mongoose.Schema.Types.ObjectId, // User is stored as an object ID
    ref: 'User', // Reference the User model
    required: true, // The user is required
  },
  // Define the field for the start
  start: {
    type: Date,
    required: true, // The start date is required
  },
  // Define the field for duration in minutes
  duration: {
    type: Number,
    min: 30,
    max: 120,
    default: 60,
    required: true,
  },
  lessonType: {
    type: String,
    enum: ['lesson', 'training', 'meeting', 'event', 'other'],
    default: 'lesson',
    required: true,
  },
  importance: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'interested', 'tired', 'frustrated', 'angry', 'surprised', 'confident', 'nervous', 'indifferent', 'neutral'],
    default: 'neutral',
  },
}, { timestamps: true });

// Create the Lesson model from the schema
const Lesson = mongoose.model('Lesson', lessonSchema);

// Export the Lesson model to be used in other parts of the application
module.exports = Lesson;
