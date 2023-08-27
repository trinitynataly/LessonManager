/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
GraphQL type definitions for the User entity.
Defines the structure of the User type and input type.
*/

const { gql } = require('apollo-server'); // Import the gql function from Apollo Server

// Define the GraphQL type definitions for the User entity
const userType = gql`
  # Define the User type with its fields
  type User {
    id: ID!           # ID of the user (automatically generated)
    first_name: String! # First name of the user
    last_name: String!  # Last name of the user
  }

  # Define the User input type for mutations
  input UserInput {
    id: ID             # ID of the user (optional for updates)
    first_name: String! # First name of the user
    last_name: String!  # Last name of the user
  }
`;

module.exports = userType; // Export the User type and input type
