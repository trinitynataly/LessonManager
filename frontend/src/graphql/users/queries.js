/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Queries for the users GraphQL API
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL query to load user data by ID
export const GET_USER = gql`
    query GetUser($id: ID!) {
        getUser(_id: $id) {
            _id
            email
            level
            first_name
            last_name
            company {
                _id
                companyName
            }
            lastAccess
            lastUpdate
        }
    }
`;

// Define the GraphQL query to load all users
export const GET_USERS = gql`
    query GetAllUsers($companyID: ID!) {
        getAllUsers(companyID: $companyID) {
            _id
            first_name
            last_name
            email
            level
            status
        }
    }
`;
