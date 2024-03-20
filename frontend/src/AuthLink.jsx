/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 05/03/2024
AuthLink plugin for Apollo Client
*/

import { setContext } from '@apollo/client/link/context'; // Import the setContext function
import jwtDecode from 'jwt-decode'; // Import the jwtDecode function
import { refreshTokens } from './helpers/refreshTokens'; // Import the refreshTokens function
import { getUserFromSessionStorage, saveTokenToSessionStorage, removeTokenfromSessionStorage } from './helpers/auth'; // Import the getUserFromSessionStorage function

// Helper function to check if token is will expire in the next 5 minutes
const isTokenExpiringSoon = (token) => {
    if (!token) return false; // If there is no token, return false (token is not expiring soon
    // Decode the token using jwtDecode function
    const decodedToken = jwtDecode(token); 
    // Get the current time in seconds
    const currentTime = Date.now().valueOf() / 1000;
    // Return true if the token will expire in the next 5 minutes (300 seconds), false otherwise
    return decodedToken.exp < (currentTime + 300);
};

// AuthLink function to set the authorization header with the token for apollo client
const authLink = setContext(async (operation, { headers }) => {
    // Skip the auth link logic for these operations
    if (operation.operationName === 'loginUser' || operation.operationName === 'registerUser' || operation.operationName === 'refreshToken') {
        return { headers };  // Skip the auth link logic for these operations
    }
    // Get the user from the session storage
    const user = getUserFromSessionStorage();
    // Init the token variable
    let token = '';
    // check if user is logged in
    if (user) {
        // Get the access token from the user object
        token = user.access_token;
        // Check if token is expired or close to expiring
        if (isTokenExpiringSoon(token)) {
            // Get the refresh token from the user object
            token = user.refresh_token; 
            const newTokens = await refreshTokens(token); 
            // Update the access token
            if (newTokens) {
                if (!newTokens.access_token) {
                    removeTokenfromSessionStorage();
                } else {
                    user.access_token = newTokens.access_token;
                    // Update the refresh token
                    user.refresh_token = newTokens.refresh_token; 
                    // Update the user object in the StoreContext
                    saveTokenToSessionStorage(user); 
                    // Set the token to the new access token
                    token = user.access_token;
                }
            } else {
                // If the refresh token is expired, log the user out
                removeTokenfromSessionStorage();
            }
        }
    }
    // Return the headers with the authorization token
    return {
        headers: {
            ...headers, // Spread the existing headers
            authorization: token ? `Bearer ${token}` : "", // Set the authorization header with the token
        }
    };
});

// Export the authLink function
export default authLink;