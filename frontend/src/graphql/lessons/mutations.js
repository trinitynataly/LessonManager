/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 8/02/2024
GraphQL mutations for lessons
*/

import { gql } from '@apollo/client'; // Import the gql tag

// Define the GraphQL query to create a new lesson
export const CREATE_LESSON = gql`
    mutation CreateLesson($lesson: LessonInput!) {
        createLesson(input: $lesson) {
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

// Define the GraphQL query to update a lesson
export const UPDATE_LESSON = gql`
    mutation UpdateLesson($lessonId: ID!, $lesson: LessonInput!) {
        updateLesson(_id: $lessonId, input: $lesson) {
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
                first_name
                last_name
                email
            }
            start
            duration
            lessonType
            importance
            mood
        }
    }
`;

// Define the GraphQL query to delete a lesson
export const DELETE_LESSON = gql`
    mutation DeleteLesson($LessonID: ID!) {
        deleteLesson(_id: $LessonID) {
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
                first_name
                last_name
                email
            }
            start
            duration
            lessonType
            importance
            mood
        }
    }
`;