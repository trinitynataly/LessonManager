/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Mutations for the clients GraphQL API
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL mutation for creating a client
export const CREATE_CLIENT = gql`
    mutation CreateClient($ClientInput: ClientInput!) { 
        createClient(input: $ClientInput) {
            _id
            company {
                _id
                companyName
            }
            firstName
            lastName
            email
            phone
            address
            city
            state
            postalCode
            country
        }
    }
`;

// Define the GraphQL mutation for updating a client
export const UPDATE_CLIENT = gql`
    mutation UpdateClient($clientID: ID!, $ClientInput: ClientInput!) {
        updateClient(_id: $clientID, input: $ClientInput) {
            _id
            company {
                _id
                companyName
            }
            firstName
            lastName
            email
            phone
            address
            city
            state
            postalCode
            country
        }
    }
`;

// Define the GraphQL mutation for deleting a client
export const DELETE_CLIENT = gql`
    mutation DeleteClient($clientID: ID!) {
        deleteClient(_id: $clientID) {
            _id
            company {
                _id
                companyName
            }
            firstName
            lastName
            email
            phone
            address
            city
            state
            postalCode
            country
        }
    }
`;