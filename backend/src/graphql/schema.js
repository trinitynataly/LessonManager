/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
GraphQL schema configuration.
Responsible for loading and merging type definitions and resolvers for the GraphQL schema.
*/

// Import necessary modules
const { mergeTypeDefs } = require('@graphql-tools/merge'); // Import the mergeTypeDefs function
const { loadFilesSync } = require('@graphql-tools/load-files'); // Import the loadFilesSync function
const path = require('path'); // Import the path module to work with file paths

// Load type and schema files
const typeDefsArray = [
  ...loadFilesSync(path.join(__dirname, "schemas")), // Load all schema files
  ...loadFilesSync(path.join(__dirname, "types")) // Load all type files
];

// Merge type definitions
const typeDefs = mergeTypeDefs(typeDefsArray); // Merge all loaded type definitions

// Load resolvers
const resolversArray = loadFilesSync(path.join(__dirname, "resolvers")); // Load all resolver files

// Merge resolvers
const resolvers = resolversArray.reduce((acc, resolver) => {
  for (let key in resolver) {
    if (!acc[key]) {
      acc[key] = {}; // Create an empty object for the resolver key if it doesn't exist
    }
    Object.assign(acc[key], resolver[key]); // Merge the resolver functions for the key
  }
  return acc;
}, {});

module.exports = { typeDefs, resolvers }; // Export the merged type definitions and resolvers
