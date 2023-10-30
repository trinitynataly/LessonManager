/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Mutations for the companies GraphQL API
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL mutation for updating a company profile
export const UPDATE_COMPANY = gql`
    mutation UpdateCompany($companyID: ID!, $CompanyInput: CompanyInput!) {
        updateCompany(_id: $companyID, input: $CompanyInput) {
        _id
        companyName
        description
        address
        contactEmail
        contactPhone
        }
    }
`;