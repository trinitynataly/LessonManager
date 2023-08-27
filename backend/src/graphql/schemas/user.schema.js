/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
GraphQL schema for the User entity.
Defines the queries and mutations related to the user.
*/

const { gql } = require('apollo-server'); // Import the gql function from Apollo Server

// Define the GraphQL schema for the User entity
const userSchema = gql`
  # Define the queries related to the user
  type Query {
    # Fetch all users
    getAllUsers: [User]!
    # Fetch a single user by ID
    getUser(id: ID!): User
  }

  # Define the mutations related to the user
  type Mutation {
    # Create a new user
    createUser(input: UserInput!): User!
    # Update an existing user
    updateUser(input: UserInput!): User!
    # Delete a user by ID
    deleteUser(id: ID!): User!
  }
`;

module.exports = userSchema; // Export the user schema
