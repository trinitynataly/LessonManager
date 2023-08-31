/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/08/2023
GraphQL schema configuration.
Responsible for loading and merging type definitions and resolvers for the GraphQL schema.
*/

// Import necessary modules
const { gql } = require('apollo-server'); // Import the gql function
const { mergeTypeDefs } = require('@graphql-tools/merge'); // Import the mergeTypeDefs function
const { loadFilesSync } = require('@graphql-tools/load-files'); // Import the loadFilesSync function
const path = require('path'); // Import the path module to work with file paths

// Define the base schema using the gql tag
const baseSchema = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

// Load type and schema files, including the base schema
const typeDefsArray = [
  baseSchema, // Include the base schema directly
  ...loadFilesSync(path.join(__dirname, "types")), // Load all type files
  ...loadFilesSync(path.join(__dirname, "schemas")), // Load all schema files
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
