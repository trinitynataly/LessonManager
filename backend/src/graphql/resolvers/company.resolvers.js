/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
Resolvers for Company GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting companies.
*/

const { Company } = require('../../models'); // Import the Company model

// Define the resolvers for Company GraphQL operations
const resolvers = {
  Query: {
    // Resolver for fetching all companies
    getAllCompanies: async () => {
      try {
        // Fetch and return all companies from the database
        return await Company.find();
      } catch (error) {
        // Handle errors and throw an error message if fetching fails
        throw new Error(`Failed to fetch all companies: ${error.message}`);
      }
    },
    // Resolver for fetching a single company by ID
    getCompany: async (_, { id }) => {
      try {
        // Find a company by its ID in the database
        const company = await Company.findById(id);
        if (!company) {
          // If company doesn't exist, throw an error
          throw new Error(`Company with id ${id} does not exist.`);
        }
        // Return the found company
        return company;
      } catch (error) {
        // Handle errors and throw an error message if fetching fails
        throw new Error(`Failed to fetch company: ${error.message}`);
      }
    },
  },
  Mutation: {
    // Resolver for creating a new company
    createCompany: async (_, { input }) => {
      try {
        // Create a new Company instance using input data
        const newCompany = new Company(input);
        // Save the new company to the database
        return await newCompany.save();
      } catch (error) {
        // Handle errors and throw an error message if creation fails
        throw new Error(`Failed to create company: ${error.message}`);
      }
    },
    // Resolver for updating a company by ID
    updateCompany: async (_, { input }) => {
      try {
        // Find and update the company by ID in the database
        const updatedCompany = await Company.findOneAndUpdate(
          { _id: input.id },
          input,
          { new: true } // Return the updated company
        );
        if (!updatedCompany) {
          // If company doesn't exist, throw an error
          throw new Error(`Company with id ${input.id} does not exist.`);
        }
        // Return the updated company
        return updatedCompany;
      } catch (error) {
        // Handle errors and throw an error message if update fails
        throw new Error(`Failed to update company: ${error.message}`);
      }
    },
    // Resolver for deleting a company by ID
    deleteCompany: async (_, { id }) => {
      try {
        // Find and remove the company by ID from the database
        const deletedCompany = await Company.findByIdAndRemove(id);
        if (!deletedCompany) {
          // If company doesn't exist, throw an error
          throw new Error(`Company with id ${id} does not exist.`);
        }
        // Return the deleted company
        return deletedCompany;
      } catch (error) {
        // Handle errors and throw an error message if deletion fails
        throw new Error(`Failed to delete company: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers; // Export the resolvers
