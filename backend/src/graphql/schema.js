/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/08/2023
GraphQL schema configuration.
Responsible for loading and merging type definitions and resolvers for the GraphQL schema.
*/

// Import necessary modules
const { gql } = require('apollo-server'); // Import the gql function
const glob = require('glob'); // Import the glob module
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge'); // Import the mergeTypeDefs and mergeResolvers functions

// Define the base schema using the gql tag
const baseSchema = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

// Find all type and schema files within the current directory
const typeNames = glob.sync('src/graphql/types/*.type.js');
const schemaNames = glob.sync('src/graphql/schemas/*.schema.js');

// Load type and schema files, including the base schema
const typeDefsArray = [
  baseSchema, // Include the base schema directly
  ...typeNames.map((type) => require(`../../${type}`)), // Load all type definitions
  ...schemaNames.map((schema) => require(`../../${schema}`)), // Load all schema definitions
];

// Merge all loaded type definitions
const typeDefs = mergeTypeDefs(typeDefsArray); 
// Find all resolver files within the current directory
const resolverNames = glob.sync('src/graphql/resolvers/*.resolvers.js');
// Load resolver files
const resolversArray = resolverNames.map((resolver) => require(`../../${resolver}`));
// Merge all loaded resolvers
const resolvers = mergeResolvers(resolversArray); 
// Export the merged type definitions and resolvers
module.exports = { typeDefs, resolvers }; 
