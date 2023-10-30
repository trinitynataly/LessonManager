/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
GraphQL type definitions for the Client entity.
Defines the structure of the Client type and input type.
*/

const { gql } = require('apollo-server'); // Import the gql function from Apollo Server

// Define the GraphQL type definitions for the Client entity
const clientType = gql`
    # Client type definition
    type Client {
        _id: ID! # Client's unique identifier
        company: Company # Company associated with the client
        firstName: String! # Client's first name
        lastName: String! # Client's last name
        email: String! # Client's email
        phone: String! # Client's phone number
        address: String # Client's address
        city: String # Client's city
        state: String # Client's state
        postalCode: String # Client's postal code
        country: String # Client's country
    }

    # Input type for creating or updating a client
    input ClientInput {
        company: ID # ID of the associated company
        firstName: String! # Client's first name
        lastName: String! # Client's last name
        email: String! # Client's email
        phone: String! # Client's phone number
        address: String # Client's address
        city: String # Client's city
        state: String # Client's state
        postalCode: String # Client's postal code
        country: String # Client's country
    }
`;

// Export the client type definitions
module.exports = clientType;
