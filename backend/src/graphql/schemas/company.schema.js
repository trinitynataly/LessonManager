/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
GraphQL schema for the Company entity.
Defines the queries and mutations related to the company.
*/

// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the Company schema
const companySchema = gql`
  type Company {
    # Unique identifier for the company
    id: ID!
    # The name of the company
    companyName: String!
    # The description of the company
    description: String
    # The address of the company
    address: String
    # The contact email of the company
    contactEmail: String
    # The contact phone number of the company
    contactPhone: String
    # The URL of the company's logo
    logoUrl: String
    # The timezone of the company
    timezone: String
  }

  # Input type for creating or updating a Company
  input CompanyInput {
    # The name of the company (required)
    companyName: String!
    # The description of the company
    description: String
    # The address of the company
    address: String
    # The contact email of the company
    contactEmail: String
    # The contact phone number of the company
    contactPhone: String
    # The URL of the company's logo
    logoUrl: String
    # The timezone of the company
    timezone: String
  }

  # Extend the Query type with company-related queries
  extend type Query {
    # Get a list of all companies
    getAllCompanies: [Company]!
    # Get a specific company by ID
    getCompany(id: ID!): Company
  }

  # Extend the Mutation type with company-related mutations
  extend type Mutation {
    # Create a new company
    createCompany(input: CompanyInput!): Company!
    # Update an existing company
    updateCompany(input: CompanyInput!): Company!
    # Delete a company by ID
    deleteCompany(id: ID!): Company!
  }
`;

// Export the Company schema to be used in the application
module.exports = companySchema;

