/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Queries for the clients GraphQL API
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL query to load user data by ID
export const GET_CLIENT = gql`
    query GetClient($id: ID!) {
        getClient(_id: $id) {
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

// Define the GraphQL query to load all clients
export const GET_CLIENTS = gql`
    query GetAllClients($companyID: ID!) {
        getAllClients(companyID: $companyID) {
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
