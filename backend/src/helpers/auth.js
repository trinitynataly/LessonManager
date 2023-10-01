/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 30/09/2023
Helper functions for authentication and authorization.
*/

// Import the ApolloError and AuthenticationError classes
const { AuthenticationError, ForbiddenError } = require('apollo-server');
// Import the jsonwebtoken and bcrypt libraries
const jwt = require('jsonwebtoken');
// Import the bcrypt library
const bcrypt = require('bcrypt');

// Load app private key from environment variables
const appPrivateKey = process.env.APP_PRIVATE_KEY; 
if (!appPrivateKey) { // Check if the private key is defined
    // If the private key is not defined, log an error and exit the process
    console.error('FATAL ERROR: APP_PRIVATE_KEY is not defined');
    process.exit(1);
}

// Load password pepper from environment variables
const passwordPepper = process.env.PASSWORD_PEPPER;
if (!passwordPepper) { // Check if the password pepper is defined
    // If the password pepper is not defined, log an error and exit the process
    console.error('FATAL ERROR: PASSWORD_PEPPER is not defined');
    process.exit(1);
}

// Define the generatePassswordHash function to generate a password hash using bcrypt with salt and pepper
const generatePassswordHash = async (password) => {
    // Add the password pepper to the password
    const pepperedPassword = password + passwordPepper;
    // Generate a salt using bcrypt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash using bcrypt
    const hashedPassword = await bcrypt.hash(pepperedPassword, salt);
    // Return the hashed password
    return hashedPassword;
}

// Define the comparePasswordHash function to compare a password with a hash
const comparePasswordHash = async (password, hash) => {
    // Add the password pepper to the password
    const pepperedPassword = password + passwordPepper;
    // Compare the password with the hash using bcrypt
    return await bcrypt.compare(pepperedPassword, hash);
}

// Define the authenticateUser function to authenticate a user
const authenticateUser = (request) => {
    try {
        // Get the user token from the headers
        const token = request.headers.authorization || '';
        // If there is no token, return null
        if (!token) return;
        // Verify the token using the JWT and app private key
        const user = jwt.verify(token, appPrivateKey); 
        // Check if the user exists
        if (user) {
            // If the user exists, return the user
            return { user };
        }
    } catch (error) {
        // If there is an error, throw an error
        return;
    }
}

// Define the generateAuthTokens function to generate a JSON web token
const generateAuthTokens = (user) => {
    // Generate an access token
    const accessToken = jwt.sign(
        { _id: user._id, email: user.email, level: user.level, company: user.company._id },
        appPrivateKey,
        { expiresIn: '10m' }  // Expires in 10 minutes
    );

    // Generate a refresh token with a longer lifespan
    const refreshToken = jwt.sign(
        { _id: user._id, email: user.email, level: user.level, company: user.company._id },
        appPrivateKey,
        { expiresIn: '7d' }  // Expires in 7 days
    );

    return { accessToken, refreshToken };
}

const refreshAuthTokens = (refreshToken) => {
    try {
        // Verify the refresh token using the JWT and app private key
        const user = jwt.verify(refreshToken, appPrivateKey); 
        // Check if the user exists
        if (!user) {
            // If the user does not exist, throw an error
            throw new AuthenticationError('Error decoding JWT token');
        }
        // Generate an access token
        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, level: user.level, company: user.company },
            appPrivateKey,
            { expiresIn: '10m' }  // Expires in 10 minutes
        );
        // Return the access token
        return { user, accessToken };
    } catch (error) {
        // If there is an error, throw an error
        throw new AuthenticationError(`Failed to decode JWT token`);
    }
}

// Define the isAuthenticated function to check if a user is authenticated
const isAuthenticated = (context) => {
    // Check if the user object exists in the context
    if (!context.user) {
        // If the user object does not exist, throw an error
        throw new AuthenticationError('User is not authenticated');
    }
}
  
// Define the isAuthorized function to check if a user is authorized to perform an action
const isAuthorized = (user, ownerId, companyId, owner=false) => {
    // Check if the user is a super admin
    if (user.level === 2) {
        // If the user is a super admin, they are authorized to perform any action
        return;
    }
    // Check if the user is a manager and the owner of the company
    if (user.level === 1 && user.company === companyId) {
        // If the user is a manager and the owner of the company, they are authorized to perform any action
        return;
    }
    // Check if the user is a user
    if (user.level === 0) {
        // If ownership permission is required, check if the user is the owner of the resource
        if (owner) {
            // If the user is the owner of the resource, they are authorized to perform any action
            if (user._id === ownerId) {
                return;
            }
        // If ownership permission is not required, check if the user belongs to the company
        } else {
            // If the user belongs to the company, they are authorized to perform any action
            if (user.company === companyId) {
                return;
            }
        }
    } 
    // If the user is not authorized, throw an error
    throw new ForbiddenError('You are not authorized to perform this action');
}

// Export the helper functions
module.exports = {
    authenticateUser, // Export the authenticateUser function
    generateAuthTokens, // Export the generateAuthTokens function
    refreshAuthTokens, // Export the refreshAuthTokens function
    generatePassswordHash, // Export the generatePassswordHash function
    comparePasswordHash, // Export the comparePasswordHash function
    isAuthenticated, // Export the isAuthenticated function
    isAuthorized, // Export the isAuthorized function
};