/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 31/08/2023
GraphQL type definitions for the Company entity.
Defines the structure of the Company type and input type.
*/


// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the Company type
const companyType = gql`
  # Company type definition
  type Company {
    _id: ID! # Company's unique identifier
    companyName: String! # Company's name
    description: String # Company's description
    address: String # Company's address
    contactEmail: String # Company's contact email
    contactPhone: String # Company's contact phone
    logoUrl: String # Company's logo URL
    timezone: String # Company's timezone
  }

  # Input type for creating or updating a company
  input CompanyInput {
    companyName: String! # Company's name
    description: String # Company's description
    address: String # Company's address
    contactEmail: String # Company's contact email
    contactPhone: String # Company's contact phone
    logoUrl: String # Company's logo URL
    timezone: String # Company's timezone
  }
`;

// Export the Company type to be used in the schema
module.exports = companyType;
