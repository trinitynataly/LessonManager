/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 12/03/2024
GraphQL queries for lessons
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL query to load lesson by ID
export const GET_LESSON = gql`
    query GetLesson($companyID: ID!) {
        getLesson(_id: $companyID) {
            _id
            lessonName
            description
            client {
                _id
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
            start
            duration
            lessonType
            importance
            mood
        }
    }
`;

// Define the GraphQL query to load all companies
export const GET_USER_LESSONS = gql`
    query GetUserLessons($user: ID, $start: String, $end: String) {
        getUserLessons(user:$user, start:$start, end:$end) {
            _id
            lessonName
            description
            client {
                _id
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
            user {
                _id
                email
                first_name
                last_name
            }
            start
            duration
            lessonType
            importance
            mood
        }
    }
`;