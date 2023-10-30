/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Mutations for the users GraphQL API
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL mutation for authorizing a user
export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    loginUser(input: $loginInput) {
      _id
      email
      level
      first_name
      last_name
      company {
        _id
        companyName
      }
      lastAccess
      lastUpdate
      access_token
      refresh_token
    }
  }
`;

// Define the GraphQL mutation for registering a user
export const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    registerUser(input: $registerInput) {
      _id
      email
      level
      first_name
      last_name
      company {
        _id
        companyName
      }
      lastAccess
      lastUpdate
      access_token
      refresh_token
    }
  }
`;

// Define the GraphQL mutation for refreshing a user's access token
export const CREATE_USER = gql`
  mutation CreateUser($UserInput: UserInput!) {
    createUser(input: $UserInput) {
      _id
      email
      level
      status
      first_name
      last_name
      company {
        _id
        companyName
      }
      lastAccess
      lastUpdate
    }
  }
`;

// Define the GraphQL mutation for updating a user
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $UserInput: UserInput!) {
    updateUser(_id: $id, input: $UserInput) {
      _id
      email
      level
      status
      first_name
      last_name
      company {
        _id
        companyName
      }
      lastAccess
      lastUpdate
    }
  }
`;

// Define the GraphQL mutation for updating a user's password
export const CHANGE_USER_PASSWORD = gql`
  mutation ChangeUserPassword($input: UpdatePasswordInput!) {
    changeUserPassword(input: $input) {
      message
    }
  }
`;

// Define the GraphQL mutation for deleting a user
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(_id: $id) {
      _id
      email
      level
      first_name
      last_name
      company {
        _id
        companyName
      }
      lastAccess
      lastUpdate
    }
  }
`;