/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Queries for the companies GraphQL API
*/


import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL query to load company by ID
export const GET_COMPANY = gql`
    query GetCompany($companyID: ID!) {
        getCompany(_id: $companyID) {
            _id
            companyName
            description
            address
            contactEmail
            contactPhone
        }
    }
`;

// Define the GraphQL query to load all companies
export const GET_COMPANIES = gql`
    query GetAllCompanies {
        getAllCompanies {
            _id
            companyName
        }
    }
`;
