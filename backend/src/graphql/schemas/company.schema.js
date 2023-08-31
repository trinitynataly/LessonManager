/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
GraphQL schema for the Company entity.
Defines the queries and mutations related to the company.
*/

// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the Company type and related input
const companySchema = gql`
  # Extend the Query type with new company-related queries
  extend type Query {
    getAllCompanies: [Company]! # Get a list of all companies
    getCompany(_id: ID!): Company # Get a company by ID
  }

  # Extend the Mutation type with new company-related mutations
  extend type Mutation {
    createCompany(input: CompanyInput!): Company! # Create a new company
    updateCompany(_id: ID!, input: CompanyInput!): Company! # Update an existing company
    deleteCompany(_id: ID!): Company! # Delete a company
  }
`;

// Export the Company schema to be used in the application
module.exports = companySchema;