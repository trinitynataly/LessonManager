/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Resolvers for Company GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting companies.
*/

const { Company } = require('../../models'); // Import the Company model
const { CompanyValidator } = require('../../validators'); // Import the company validators

// Define the resolvers for Company GraphQL operations
const resolvers = {
  // Define the resolver for the Company type
  Query: {
    // Resolver for fetching all companies
    getAllCompanies: async () => { //
      try {
        // Fetch and return all companies from the database
        return await Company.find();
      } catch (error) {
        // Handle errors and throw an error message if fetching fails
        throw new Error(`Failed to fetch all companies: ${error.message}`);
      }
    },
    // Resolver for fetching a single company by ID
    getCompany: async (_, { _id }) => {
      try {
        // Find a company by its ID in the database
        const company = await Company.findById(_id);
        if (!company) {
          // If company doesn't exist, throw an error
          throw new Error(`Company with id ${_id} does not exist.`);
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
        await CompanyValidator.validateNewCompany(input);
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
    updateCompany: async (_, { _id, input }) => {
      try {
        await CompanyValidator.validateUpdateCompany(_id, input);
        // Find and update the company by ID in the database
        const company = await Company.findById(_id);
        if (!company) {
          throw new Error(`Company with id ${_id} does not exist.`);
        }       
        // Update the user with the new input data
        Object.assign(company, input);
        // Save the updated user to trigger the pre-save middleware
        await company.save();
        // Return the updated user, excluding the password field
        return await Company.findById(_id)
      } catch (error) {
        // Handle errors and throw an error message if update fails
        throw new Error(`Failed to update company: ${error.message}`);
      }
    },
    // Resolver for deleting a company by ID
    deleteCompany: async (_, { _id }) => {
      try {

        // Find and remove the company by ID from the database
        const deletedCompany = await Company.findByIdAndRemove(_id);
        if (!deletedCompany) {
          // If company doesn't exist, throw an error
          throw new Error(`Company with id ${_id} does not exist.`);
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
