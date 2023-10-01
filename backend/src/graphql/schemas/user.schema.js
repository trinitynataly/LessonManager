/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
GraphQL schema for the User entity.
Defines the queries and mutations related to the user.
*/

// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the User type and related input
const userSchema = gql`
  # Extend the Query type with new user-related queries
  extend type Query {
    getAllUsers(companyID: ID): [User]! # Get a list of all users
    getUser(_id: ID!): User # Get a user by ID
  }

  # Extend the Mutation type with new user-related mutations
  extend type Mutation {
    createUser(input: UserInput!): User! # Create a new user
    updateUser(_id: ID!, input: UserInput!): User! # Update an existing user
    deleteUser(_id: ID!): User! # Delete a user
    loginUser(input: LoginInput!): User! # Login a user
    refreshToken(refreshToken: String!): AccessToken! # Refresh a user's JWT access token
  }
`;

// Export the User schema to be used in the application
module.exports = userSchema;

