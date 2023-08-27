/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
Main file of the GraphQL backend server application.
Responsible for setting up the Apollo Server, connecting to the database, and handling server termination.
*/

// Import necessary modules
require('dotenv').config(); // Load environment variables from a .env file
const { ApolloServer } = require("apollo-server"); // Import ApolloServer class
const connectDB = require('./db/connect'); // Import database connection function
const { typeDefs, resolvers } = require('./graphql/schema'); // Import the schema.js module

// Create a new Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Connect to the database and start the server
connectDB().then(() => {
  // After a successful connection, start the server
  const PORT = process.env.PORT || 3000; // Set the port number for the server
  server.listen({ port: PORT }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`); // Log the server's URL when it's ready
  });
});

// Handle server termination gracefully
process.on('SIGINT', () => {
  console.log("Gracefully shutting down..."); // Log a message when the server is shutting down
  process.exit(0); // Exit the process with a successful status code
});
