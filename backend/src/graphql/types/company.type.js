/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/08/2023
GraphQL type definitions for the Company entity.
Defines the structure of the Company type and input type.
*/


// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the Company type
const companyType = gql`
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
`;

// Export the Company type to be used in the schema
module.exports = companyType;
