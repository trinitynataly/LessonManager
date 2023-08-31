/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
Connect to MongoDB and handle database events.
Responsible for establishing a connection to the MongoDB server and managing various connection events.
*/

const mongoose = require('mongoose'); // Import Mongoose library for MongoDB

const MONGO_SERVER = process.env.MONGO_SERVER || 'mongodb://localhost:27017/lessonmanager'; // MongoDB server URL

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_SERVER, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to MongoDB
    console.log('Connected to MongoDB'); // Log successful connection
  } catch (err) {
    console.error('MongoDB connection error:', err); // Log connection error
    process.exit(1); // Exit process with failure
  }

  const db = mongoose.connection;

  db.on('connecting', function() {
    console.log('connecting to MongoDB...'); // Log when connecting
  });

  db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error); // Log connection error
  });

  db.on('connected', function() {
    console.log('MongoDB connected!'); // Log when connected
  });

  db.once('open', function() {
    console.log('MongoDB connection opened!'); // Log when connection is opened
  });

  db.on('reconnected', function () {
    console.log('MongoDB reconnected!'); // Log when reconnected
  });

  db.on('disconnected', function() {
    console.log('MongoDB disconnected!'); // Log when disconnected
  });
};

module.exports = connectDB; // Export the connectDB function