/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
GraphQL type definitions for the Lesson entity.
Defines the structure of the Lesson type and input type.
*/

const { gql } = require('apollo-server'); // Import the gql function from Apollo Server

// Define the GraphQL type definitions for the Lesson entity
const lessonType = gql`
    # Lesson type definition
    type Lesson {
        _id: ID! # Lesson's unique identifier
        lessonName: String! # Lesson name
        description: String # Lesson description
        client: Client! # Client associated with the lesson
        user: User! # User associated with the lesson
        start: String! # Lesson start date and time
        duration: Int! # Lesson duration in minutes
    }

    # Input type for creating or updating a lesson
    input LessonInput {
        lessonName: String! # Lesson name
        description: String # Lesson description
        client: ID! # ID of the associated client
        user: ID! # ID of the associated user
        start: String! # Lesson start date and time
        duration: Int! # Lesson duration in minutes
    }
`;

// Export the lesson type definitions
module.exports = lessonType;