/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
Main file of the GraphQL backend server application.
Responsible for setting up the Apollo Server, connecting to the database, and handling server termination.
*/

require('dotenv').config(); // Import the dotenv module and initialize it
const config = require('config'); // Import config package
const { ApolloServer } = require('@apollo/server'); // Import ApolloServer class
const { startStandaloneServer } = require('@apollo/server/standalone'); // Import the startStandaloneServer function
const { connectDB } = require('./db/connect'); // Import database connection function
const { typeDefs, resolvers } = require('./graphql/schema'); // Import the schema.js module
const { authenticateUser } = require('./helpers/auth'); // Import the app private key

const serverConfig = config.get('server'); // Get server configuration settings

// Define the startServer function
async function startServer() {
  // Create a new Apollo Server instance
  const server = new ApolloServer({
    typeDefs: typeDefs, // Pass the typeDefs to the Apollo Server
    resolvers: resolvers, // Pass the resolvers to the Apollo Server
    // Define the formatError function to format errors - Removes stack trace in anything but development
    formatError: (error) => {
      const { message, extensions } = error; // Extract the error message and extensions
      // Log the error
      if (!serverConfig.debug) {
        // In production, remove the stack trace from the error
        delete extensions.stacktrace;
      }
      // Return the error message and extensions
      return { message, extensions };
    },
  });
  // Connect to the database
  await connectDB();
  // Start the server
  const { url } = await startStandaloneServer(server, {
    // Define the server listen port
    listen: { port: serverConfig.port },
    // Define a context function to add the user to the context
    context: async ({ req, res }) => {
      // Return the user from the authenticateUser function
      return authenticateUser(req);
    },
  });
  // Log the server URL
  console.log(`🚀 Server ready at ${url}`);
}

// Call the startServer function to start the server
startServer();