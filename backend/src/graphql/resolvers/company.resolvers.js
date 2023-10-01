/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
Resolvers for Company GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting companies.
*/

const { ApolloError } = require('apollo-server'); // Import the ApolloError class
const { Company } = require('../../models'); // Import the Company model
const { CompanyValidator } = require('../../validators'); // Import the company validators
const { isAuthenticated, isAuthorized } = require('../../helpers/auth'); // Import the auth helpers

// Define the resolvers for Company GraphQL operations
const resolvers = {
  // Define the resolver for the Company type
  Query: {
    // Resolver for fetching all companies
    getAllCompanies: async (_, {}, context) => { //
      // Check if the user is authenticated
      isAuthenticated(context);
      // Fetch the companyID and level from the authenticated user
      const userCompanyID = context.user.company;
      const userLevel = context.user.level;
      // Define the filter based on the user's level
      let filter = {};
      // If the user is a super admin, return all companies
      if (userLevel < 2) {
        // If the user is not a super admin, return only the company they belong to
        filter._id = userCompanyID;
      }
      // Fetch and return all companies from the database
      return await Company.find(filter);
    },
    // Resolver for fetching a single company by ID
    getCompany: async (_, { _id }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Check if the user is authorized to read the company
      isAuthorized(context.user, null, _id);
      // Find a company by its ID in the database
      const company = await Company.findById(_id);
      // If company doesn't exist, throw an error
      if (!company) {
        throw new ApolloError(`Company with id ${_id} does not exist.`, 'GET_COMPANY_ERROR');
      }
      // Return the found company
      return company;
    },
  },
  Mutation: {
    // Resolver for creating a new company
    createCompany: async (_, { input }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Check if the user is authorized to create a company
      isAuthorized(context.user, null, null, true);
      // Validate the input data for creating a new company
      await CompanyValidator.validateNewCompany(input);
      // Create a new Company instance using input data
      const newCompany = new Company(input);
      // Save the new company to the database
      return await newCompany.save();
    },
    // Resolver for updating a company by ID
    updateCompany: async (_, { _id, input }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Check if the user is authorized to update the company
      isAuthorized(context.user, null, _id, true);
      // Validate the input data for updating a company
      await CompanyValidator.validateUpdateCompany(_id, input);
      // Find and update the company by ID in the database
      const company = await Company.findById(_id);
      // If company doesn't exist, throw an error
      if (!company) {
        throw new ApolloError(`Company with id ${_id} does not exist.`, 'GET_COMPANY_ERROR');
      }       
      // Update the user with the new input data
      Object.assign(company, input);
      // Save the updated user to trigger the pre-save middleware
      await company.save();
      // Return the updated user, excluding the password field
      return await Company.findById(_id)
    },
    // Resolver for deleting a company by ID
    deleteCompany: async (_, { _id }, context) => {
      // Check if the user is authenticated
      isAuthenticated(context);
      // Check if the user is authorized
      isAuthorized(context.user, null, _id, true);
      // Find and remove the company by ID from the database
      const deletedCompany = await Company.findByIdAndRemove(_id);
      if (!deletedCompany) {
        // If company doesn't exist, throw an error
        throw new ApolloError(`Company with id ${_id} does not exist.`, 'GET_COMPANY_ERROR');
      }
      // Return the deleted company
      return deletedCompany;
    },
  },
};

module.exports = resolvers; // Export the resolvers
