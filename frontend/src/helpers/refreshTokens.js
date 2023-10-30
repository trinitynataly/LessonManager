/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Helper to refresh tokens
*/

import { gql } from '@apollo/client'; // Import the gql tag
import { client } from '../apolloClient';  // Adjust the import path to match your file structure

// Define the GraphQL mutation to refresh tokens
const REFRESH_TOKEN = gql`
  mutation refreshToken($token: String!) {
    refreshToken(token: $token) {
      access_token
      refresh_token
    }
  }
`;

// Define the function to refresh tokens
export async function refreshTokens(token) {
  try {
    // Call the refreshToken mutation
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: token }
    });
    // if no token is received, throw an error
    if (!data.refreshToken) throw new Error('No token received');
    // all is good so return the new tokens
    return data.refreshToken;
  } catch (error) { // catch any error
    // log the error and return empty tokens
    console.error('Failed to refresh tokens:', error.message);
    // return empty tokens
    return {
      access_token: '',
      refresh_token: '',
    };
  }
}
