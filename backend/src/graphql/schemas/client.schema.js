/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
GraphQL schema for the Client entity.
Defines the queries and mutations related to the client.
*/

// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the Client type and related input
const clientSchema = gql`
  # Extend the Query type with new client-related queries
  extend type Query {
    getAllClients(companyID: ID): [Client]! # Get a list of all clients
    getClient(_id: ID!): Client # Get a client by ID
  }

  # Extend the Mutation type with new client-related mutations
  extend type Mutation {
    createClient(input: ClientInput!):Client! # Create a new client
    updateClient(_id: ID!, input: ClientInput!): Client! # Update an existing client
    deleteClient(_id: ID!): Client! # Delete a client
  }
`;

// Export the Client schema to be used in the application
module.exports = clientSchema;