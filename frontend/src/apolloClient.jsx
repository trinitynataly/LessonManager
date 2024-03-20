/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 15/02/2024
Apollo Client initialisation.
*/

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'; // Import the Apollo Client libraries
import { onError } from "@apollo/client/link/error"; // Import the onError function from the Apollo Client library
import authLink from './AuthLink'; // Import the AuthLink component for token authentication
import { handleLogoutWithoutHook } from './helpers/auth'; // Import the handleLogoutWithoutHook function

// Create an error link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // If there is a network error, log it in the console
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
  // Handle GraphQL errors
  if (graphQLErrors) {
    // Map through the errors
    graphQLErrors.map(({ message }) => {
      // If the error message is "User is not authenticated", force logout
      if (message === "User is not authenticated") {
        // Logot & redirect to login page
        handleLogoutWithoutHook();
      }
      return null;
    });
  }
});

const httpLink = new HttpLink({ // Create a new HTTP link
    uri: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql", // Set the URI to the GraphQL API endpoint
  });
   
export const client = new ApolloClient({ // Create a new Apollo Client instance
    link: from([ authLink, errorLink, httpLink ]), // Set the link property to the error link
    cache: new InMemoryCache(), // Set the cache to the in-memory cache
});