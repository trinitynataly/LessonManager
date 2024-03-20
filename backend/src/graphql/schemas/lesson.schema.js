/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 20/02/2024
Defines the lesson query and mutation schema for GraphQL API.
*/

// Import the gql function from Apollo Server
const { gql } = require('apollo-server');

// Define the Lesson type and related input
const lessonSchema = gql`
    # Extend the Query type with new lesson-related queries
    extend type Query {
        # Get list of all lessons for a user and a given date range (optional)
        getUserLessons(user: ID, start: String, end: String): [Lesson]!
        # Get list of all lessons for a client and a given date range (optional)
        getClientLessons(client: ID!, start: String, end: String): [Lesson]!
        # Get a lesson by ID
        getLesson(_id: ID!): Lesson
    }

    # Extend the Mutation type with new lesson-related mutations
    extend type Mutation {
        createLesson(input: LessonInput!): Lesson! # Create a new lesson
        updateLesson(_id: ID!, input: LessonInput!): Lesson! # Update an existing lesson
        deleteLesson(_id: ID!): Lesson! # Delete a lesson
    }
`;

// Export the Lesson schema to be used in the application
module.exports = lessonSchema;