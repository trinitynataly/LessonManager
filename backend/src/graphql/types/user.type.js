/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
GraphQL type definitions for the User entity.
Defines the structure of the User type and input type.
*/

const { gql } = require('apollo-server'); // Import the gql function from Apollo Server

// Define the GraphQL type definitions for the User entity
const userType = gql`
  # User type definition
  type User {
    _id: ID! # User's unique identifier
    first_name: String! # User's first name
    last_name: String! # User's last name
    email: String! # User's email
    password: String! # User's password hash (encrypted)
    company: Company # Company associated with the user
    level: Int! # User level (0-user, 1-manager, 2-site admin)
    registrationDate: String! # Date of user registration
    lastAccess: String # Date of last user access
    lastUpdate: String! # Date of last user profile update
    status: Int! # User status (0-user inactive, 1-user active),
    access_token: String # User's JWT access token
    refresh_token: String # User's JWT refresh token
  }

  # Type for the access token
  type AccessToken {
    access_token: String # User's JWT access token
    refresh_token: String # User's JWT refresh token
  }

  # Type for generic response
  type Response {
    message: String # Response message
  }

  # Input type for creating or updating a user
  input UserInput {
    first_name: String! # User's first name
    last_name: String! # User's last name
    email: String! # User's email
    password: String # User's password
    company: ID # ID of the associated company
    level: Int # User level
    status: Int # User status
  }

  # Input type for logging in a user
  input LoginInput {
    email: String! # User's email
    password: String! # User's password
  }

  # Input type for new user and company registration
  input RegisterInput {
    first_name: String! # User's first name
    last_name: String! # User's last name
    email: String! # User's email
    password: String! # User's password
    companyName: String! # Company name
  }

  # Input type for updating a user's password
  input UpdatePasswordInput {
    current_password: String! # User's current password
    new_password: String! # User's new password
  }
`;

module.exports = userType; // Export the User type and input type
