/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Resolvers for User GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting users.
*/

// graphql/resolvers/user.resolvers.js

const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing
const { User, Company } = require('../../models'); // Import the User model
const { UserValidator } = require('../../validators'); // Import the user validators

// Define the resolvers for user-related queries and mutations
const resolvers = {
  User: {
    company: async (user) => {
      try {
        // Fetch the associated company based on the company ID in the user
        const company = await Company.findById(user.company);
        return company;
      } catch (error) {
        throw new Error(`Failed to fetch company: ${error.message}`);
      }
    },
    password: () => "",
  },
  Query: {
    // Resolver for fetching all users
    getAllUsers: async () => {
      try {
        // Fetch all users from the database, excluding the password field
        const users = await User.find().select('-password');
        return users;
      } catch (error) {
        throw new Error(`Failed to fetch all users: ${error.message}`);
      }
    },
    // Resolver for fetching a user by ID
    getUser: async (_, { _id }) => {
      try {
        // Fetch a user by ID from the database, excluding the password field
        const user = await User.findById(_id).select('-password');
        if (!user) {
          throw new Error(`User with id ${_id} does not exist.`);
        }
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
  },
  Mutation: {
    // Resolver for creating a new user
    createUser: async (_, { input }) => {
      try {
        // Validate the input data
        await userValidator.validateNewUser(input);
        // Create a new User instance with the provided input data
        const newUser = new User(input);
        // Save the new user to the database
        const savedUser = await newUser.save();
        return savedUser;
      } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    },
    // Resolver for updating a user
    updateUser: async (_, { _id, input }) => {
      try {
        // Validate the input data
        await UserValidator.validateUpdateUser(_id, input);
         // Find the user by ID
        const user = await User.findById(_id);
        if (!user) {
          throw new Error(`User with id ${_id} does not exist.`);
        }
        // Update the user with the new input data
        Object.assign(user, input);
        // Save the updated user to trigger the pre-save middleware
        await user.save();
        // Return the updated user, excluding the password field
        return await User.findById(_id).select('-password');
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },
    // Resolver for deleting a user
    deleteUser: async (_, { _id }) => {
      try {
        // Delete a user by ID from the database, excluding the password field
        const deletedUser = await User.findByIdAndRemove(_id).select('-password');
        if (!deletedUser) {
          throw new Error(`User with id ${_id} does not exist.`);
        }
        return deletedUser;
      } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers; // Export the resolvers