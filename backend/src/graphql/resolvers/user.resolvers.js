/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
Resolvers for User GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting users.
*/

const { User } = require('../../models'); // Import the User model

// Define the resolvers for User GraphQL operations
const resolvers = {
  Query: {
    // Resolver for fetching all users
    getAllUsers: async () => {
      try {
        // Fetch and return all users from the database
        return await User.find();
      } catch (error) {
        // Handle errors and throw an error message if fetching fails
        throw new Error(`Failed to fetch all users: ${error.message}`);
      }
    },
    // Resolver for fetching a single user by ID
    getUser: async (_, { id }) => {
      try {
        // Find a user by its ID in the database
        const user = await User.findById(id);
        if (!user) {
          // If user doesn't exist, throw an error
          throw new Error(`User with id ${id} does not exist.`);
        }
        // Return the found user
        return user;
      } catch (error) {
        // Handle errors and throw an error message if fetching fails
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
  },
  Mutation: {
    // Resolver for creating a new user
    createUser: async (_, { input }) => {
      try {
        // Create a new User instance using input data
        const newUser = new User(input);
        // Save the new user to the database
        return await newUser.save();
      } catch (error) {
        // Handle errors and throw an error message if creation fails
        throw new Error(`Failed to create user: ${error.message}`);
      }
    },
    // Resolver for updating a user by ID
    updateUser: async (_, { input }) => {
      try {
        // Find and update the user by ID in the database
        const updatedUser = await User.findOneAndUpdate(
          { _id: input.id },
          input,
          { new: true } // Return the updated user
        );
        if (!updatedUser) {
          // If user doesn't exist, throw an error
          throw new Error(`User with id ${input.id} does not exist.`);
        }
        // Return the updated user
        return updatedUser;
      } catch (error) {
        // Handle errors and throw an error message if update fails
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },
    // Resolver for deleting a user by ID
    deleteUser: async (_, { id }) => {
      try {
        // Find and remove the user by ID from the database
        const deletedUser = await User.findByIdAndRemove(id);
        if (!deletedUser) {
          // If user doesn't exist, throw an error
          throw new Error(`User with id ${id} does not exist.`);
        }
        // Return the deleted user
        return deletedUser;
      } catch (error) {
        // Handle errors and throw an error message if deletion fails
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers; // Export the resolvers