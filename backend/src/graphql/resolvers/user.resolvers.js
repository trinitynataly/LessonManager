/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Resolvers for User GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting users.
*/

// graphql/resolvers/user.resolvers.js

const { ApolloError, ForbiddenError } = require('apollo-server'); // Import the ApolloError and ForbiddenError classes
const { User, Company } = require('../../models'); // Import the User model
const { UserValidator } = require('../../validators'); // Import the user validators
const { isAuthenticated, isAuthorized, refreshAuthTokens } = require('../../helpers/auth'); // Import the auth helpers

// Define the resolvers for user-related queries and mutations
const resolvers = {
  // Define the resolver for the User type
  User: {
    // Resolver for fetching the associated company for a user
    company: async (user) => {
      try {
        // Fetch the associated company based on the company ID in the user
        const company = await Company.findById(user.company);
        // Return the found company
        return company;
      } catch (error) {
        // If the company doesn't exist, throw an error
        throw new ApolloError(`Failed to get company data: ${error.message}`, 'GET_COMPANY_ERROR');
      }
    },
    // Do not show hashed password value
    password: () => "",
  },
  Query: {
    // Resolver for fetching all users
    getAllUsers: async (_, { companyID }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Fetch the companyID and level from the authenticated user
      const userCompanyID = context.user.company;
      const userLevel = context.user.level;
      // Define the filter based on the user's level
      let filter = {};
      // If the user is a super admin, allow to specify company ID
      if (userLevel === 2) {
        // If company ID is specified, check if it exists
        if (companyID) {
          // Check if the company exists in the database
          const company = await Company.findById(companyID);
          // If the company doesn't exist, throw an error
          if (!company) {
            throw new ApolloError(`Company with id ${companyID} does not exist.`, 'GET_COMPANY_ERROR');
          }
        }
        // If company ID is specified, use it as a filter, otherwise use the user's company ID
        filter.company = companyID? companyID : userCompanyID;
     } else {
        // If the user is not a super admin, they can only list users of their company
        filter.company = userCompanyID;
      }
      // Fetch users based on the defined filter, excluding the password field
      const users = await User.find(filter).select('-password');
      // Return the fetched users
      return users;
    },
    // Resolver for fetching a user by ID
    getUser: async (_, { _id }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Fetch a user by ID from the database, excluding the password field
      const user = await User.findById(_id).select('-password');
      // If the user doesn't exist, throw an error
      if (!user) {
        throw new ApolloError(`User with id ${_id} does not exist`, 'GET_USER_ERROR');
      }
      // Check if the user is authorized to read the user
      isAuthorized(context.user, user._id, user.company._id);
      // Return the fetched user
      return user;
    },
  },
  Mutation: {
    // Resolver for creating a new user
    createUser: async (_, { input }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Validate the input data
      await UserValidator.validateNewUser(input);
      // Check if the user is authorized to create a new user in the specified company
      isAuthorized(context.user, null, input.company, true);
      // Create a new User instance with the provided input data
      const user = new User(input);
      // Save the new user to the database
      await user.save();
      // Pick only the necessary user data and add the auth token
      const { password, ...userData } = user.toObject();
      // Return the new user, excluding the password field
      return userData;
    },
    // Resolver for updating a user
    updateUser: async (_, { _id, input }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Validate the input data
      await UserValidator.validateUpdateUser(_id, input);
      // Find the user by ID
      const user = await User.findById(_id);
      // If the user doesn't exist, throw an error
      if (!user) {
        throw new ApolloError(`User with id ${_id} does not exist`, 'GET_USER_ERROR');
      }
      // Check if the user is authorized to update this user
      isAuthorized(context.user, user._id, user.company, true);
      // If the user is not a super admin, they can only update users of their company
      if (context.user.level < 2) {
        // Check if user is trying to change the company
        if (input.company && input.company != user.company) {
          // Throw an error if the user is trying to change the company
          throw new ForbiddenError(`You have no permission to change company for this user`);
        }
        // Check if user is trying to change the level to a higher level of its own
        if (input.level > user.level)  {
          // Throw an error if the user is trying to change the level to a higher level of its own
          throw new ForbiddenError(`You have no permission to update level for this user`);
        }
      }
      // Update the user with the new input data
      Object.assign(user, input);
      // Save the updated user to trigger the pre-save middleware
      await user.save();
      // Return the updated user, excluding the password field
      return await User.findById(_id).select('-password');
    },
    // Resolver for deleting a user
    deleteUser: async (_, { _id }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
        // Find the user by ID
        const user = await User.findById(_id);
        // If the user doesn't exist, throw an error
        if (!user) {
          throw new ApolloError(`User with id ${_id} does not exist`, 'GET_USER_ERROR');
        }
        // Check if the user is authorized to update a new user in the specified company
        isAuthorized(context.user, null, user.company, true);
      // Check if the user is trying to delete themselves
      if (context.user._id == _id) {
        // Throw an error if the user is trying to delete themselves
        throw new ForbiddenError(`You can't delete yourself.`);
      }
      // Delete the user from the database and return the deleted user except the password field
      const deletedUser = await User.findByIdAndRemove(_id).select('-password');
      // If the user doesn't exist, throw an error
      if (!deletedUser) {
        throw new ApolloError(`User with id ${_id} does not exist`, 'GET_USER_ERROR');
      }
      // Return the deleted user
      return deletedUser;
    },
    // Resolver for logging in a user
    loginUser: async (_, { input }) => {
      // Validate the input data
      await UserValidator.validateLoginUser(input);
      // Find the user by email case insensitive
      const user = await User.findOne({ email: new RegExp(`^${input.email}$`, 'i'), status: 1 });
      // If the user doesn't exist, throw an error
      if (!user) {
        throw new ApolloError(`User with email ${input.email} does not exist`, 'LOGIN_USER_ERROR');
      }
      // Check if the password is correct
      const isPasswordCorrect = await user.comparePassword(input.password);
      // If the password is incorrect, throw an error
      if (!isPasswordCorrect) {
        throw new ApolloError(`Supplied password is incorrect for this user`, 'LOGIN_USER_ERROR');
      }
      // Generate an auth token for the user
      const { accessToken, refreshToken } = user.generateAuthTokens();
      // Pick only the necessary user data and add the auth token
      const { password, ...userData } = user.toObject();
      // Add the access token to the user data
      userData.access_token = accessToken;
      // Add the refresh token to the user data
      userData.refresh_token = refreshToken;
      // Return the user data
      return userData;
    },
    changeUserPassword: async (_, { input }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Validate the input data
      await UserValidator.validateChangePassword(input);
      // get current user from db
      const user = await User.findOne({ _id: context.user._id, status: 1 });
      // If the user doesn't exist, throw an error
      if (!user) {
        throw new ApolloError(`This account does not exists or is disabled`, 'LOGIN_USER_ERROR');
      }
      // Check if the old password is correct for this user
      const isPasswordCorrect = await user.comparePassword(input.current_password);
      // If the password is incorrect, throw an error
      if (!isPasswordCorrect) {
        // Throw an error if the password is incorrect
        throw new ApolloError(`Your current password is incorrect`, 'CHANGE_PASSWORD_ERROR');
      }
      // Update the user's password with the new password
      user.password = input.new_password;
      // Save the updated user to trigger the pre-save middleware
      await user.save();
      // Return true
      return { message: 'Password updated successfully' };
    },
    registerUser: async (_, { input }) => {
      // Validate the input data
      await UserValidator.validateRegisterUser(input);
      // Create new company with supplied company Name

      const company = new Company({ companyName: input.companyName });
      // Save the new company to the database
      await company.save();
      // Create a new User instance with the provided input data, including the company ID, make him an admin and active
      input.company = company._id;
      input.level = 1;
      input.status = 1;
      const user = new User(input);
      // Save the new user to the database
      await user.save();
      // Generate an auth token for the user
      const { accessToken, refreshToken } = user.generateAuthTokens();
      // Pick only the necessary user data and add the auth token
      const { password, ...userData } = user.toObject();
      // Add the access token to the user data
      userData.access_token = accessToken;
      // Add the refresh token to the user data
      userData.refresh_token = refreshToken;
      // Return the user data
      return userData;
    },
    // Resolver for refreshing a user's auth token
    refreshToken: async (_, { token }) => {
      // Refresh the user's auth token
      const { user, accessToken, refreshToken } = refreshAuthTokens(token);
      // check if user still active in DB
      const userInDB = await User.findById(user._id);
      // If the user doesn't exist or is inactive, throw an error
      if (!userInDB || userInDB.status !== 1) {
        throw new ApolloError(`Refresh token is invalid or expired`, 'LOGIN_USER_ERROR');
      }
      // Return the new access token
      return { access_token: accessToken, refresh_token: refreshToken };
    },
  },
};

module.exports = resolvers; // Export the resolvers