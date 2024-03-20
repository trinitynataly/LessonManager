/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 05/03/2024
Implementing the lesson resolvers for fetching, creating, updating, and deleting lessons via GraphQL queries and mutations.
*/

const { ApolloError } = require('apollo-server'); // Import the ApolloError and ForbiddenError classes
const { Client, User, Lesson } = require('../../models'); // Import the Client, User, and Lesson models
const { LessonValidator } = require('../../validators'); // Import the lesson validators
const { isAuthenticated, isAuthorized } = require('../../helpers/auth'); // Import the auth helpers

// Define the resolvers for lesson-related queries and mutations
const resolvers = {
    Lesson: {
        // Resolver for fetching the associated client for a lesson
        client: async (lesson) => {
            try {
                // Fetch the associated client based on the client ID in the lesson
                const client = await Client.findById(lesson.client);
                // Return the found client
                return client;
            } catch (error) {
                // If the client doesn't exist, throw an error
                throw new ApolloError(`Failed to get client data: ${error.message}`, 'GET_CLIENT_ERROR');
            }
        },
        // Resolver for fetching the associated user for a lesson
        user: async (lesson) => {
            try {
                // Fetch the associated user based on the user ID in the lesson
                const user = await User.findById(lesson.user);
                // Return the found user
                return user;
            } catch (error) {
                // If the user doesn't exist, throw an error
                throw new ApolloError(`Failed to get user data: ${error.message}`, 'GET_USER_ERROR');
            }
        },
    },
    Query: {
        // Resolver for fetching all lessons for a user and a given date range (optional)
        getUserLessons: async (_, { user="", start="", end="" }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Fetch the user ID from the authenticated client
            const userID = context.user._id;
            // Fetch the user level from the authenticated client
            const userLevel = context.user.level;
            // Define the filter based on the client's level
            let filter = {};
            // If the client is a super admin, allow to specify user ID
            if (userLevel === 2) {
                // If user ID is specified, check if it exists
                if (user) {
                    // Fetch the user by ID from the database
                    const user = await User.findById(user);
                    // Check if the user exists
                    if (!user) {
                        // If the user doesn't exist, throw an error
                        throw new ApolloError(`User with id ${user} does not exist.`, 'GET_USER_ERROR');
                    }
                }
                // If user ID is specified, use it as a filter, otherwise show appointments from all users in the same company ID
                if (user) {
                    filter.user = user;
                } else {
                    filter.company = context.user.company;
                }
            } else {
                // If the client is not a super admin, they can only list lessons of their company
                filter.user = userID;
            }
            // If start date is specified, add it to the filter
            if (start) {
                filter.start = { $gte: start }; // Greater than or equal to the start date
            }
            // If end date is specified, add it to the filter
            if (end) {
                filter.start = { $lt: end }; // Less than the end date
            }
            // Fetch lessons based on the defined filter
            const lessons = await Lesson.find(filter)
            // Return the fetched lessons
            return lessons;
        },
        // Resolver for fetching all lessons for a client and a given date range (optional)
        getClientLessons: async (_, { client, start, end }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Fetch the companyID and level from the authenticated client
            const userCompanyID = context.user.company;
            // Fetch the user level from the authenticated client
            const userLevel = context.user.level;
            // Define the filter based on the client's level
            if (!client) {
                throw new ApolloError(`Client ID is required.`, 'GET_CLIENT_ERROR');
            }
            // load client data
            const clientData = await Client.findById(client);
            // if no client data, throw an error
            if (!clientData) {
                throw new ApolloError(`This client does not exist.`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to read the lesson
            isAuthorized(context.user, null, clientData.company._id, false);
            filter.client = client;
            // If start date is specified, add it to the filter
            if (start) {
                filter.start = { $gte: start };
            }
            // If end date is specified, add it to the filter
            if (end) {
                filter.start = { $lt: end };
            }
            // Fetch lessons based on the defined filter
            const lessons = await Lesson.find(filter)
            // Return the fetched lessons
            return lessons;
        },
        // Resolver for fetching a lesson by ID
        getLesson: async (_, { _id }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Fetch a lesson by ID from the database
            const lesson = await Lesson.findById(_id)
            // If the lesson doesn't exist, throw an error
            if (!lesson) {
                throw new ApolloError(`Lesson with id ${_id} does not exist`, 'GET_LESSON_ERROR');
            }
            // Check if the user is authorized to read the lesson
            isAuthorized(context.user, null, lesson.client.company._id, false);
            // Return the fetched lesson
            return lesson;
        },
    },
    Mutation: {
        // Resolver for creating a new lesson
        createLesson: async (_, { input }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Validate the lesson input
            await LessonValidator.validateLesson(input);       
            // Check if client exists
            const client = await Client.findById(input.client);
            if (!client) {
                throw new ApolloError(`Client with id ${input.client} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to create the lesson
            isAuthorized(context.user, null, client.company._id, false);
            // Create a new lesson in the database
            const lesson = await Lesson.create(input);
            // Return the created lesson
            return lesson;
        },
        // Resolver for updating an existing lesson
        updateLesson: async (_, { _id, input }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Validate the lesson input
            await LessonValidator.validateLesson(input);
            // Fetch the existing lesson from the database
            // Check if client exists
            const client = await Client.findById(input.client);
            if (!client) {
                throw new ApolloError(`Client with id ${input.client} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to create the lesson
            isAuthorized(context.user, null, client.company._id, false);
            // Fetch the existing lesson from the database
            const lesson = await Lesson.findById(_id);
            // If the lesson doesn't exist, throw an error
            if (!lesson) {
                throw new ApolloError(`Lesson with id ${_id} does not exist`, 'GET_LESSON_ERROR');
            }
            // Check if the user is authorized to update the lesson
            isAuthorized(context.user, null, client.company._id, false);
            // Update the lesson in the database
            Object.assign(lesson, input);
            // Save the updated lesson
            await lesson.save();
            // Return the updated lesson
            return lesson;
        },
        // Resolver for deleting a lesson
        deleteLesson: async (_, { _id }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Fetch the existing lesson from the database
            const lesson = await Lesson.findById(_id);
            // If the lesson doesn't exist, throw an error
            if (!lesson) {
                throw new ApolloError(`Appointment with id ${_id} does not exist`, 'GET_LESSON_ERROR');
            }
            // Check if client exists
            const client = await Client.findById(lesson.client);
            if (!client) {
                throw new ApolloError(`Client with id ${input.client} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to delete the lesson
            isAuthorized(context.user, null, client.company._id, false);
            // Delete the lesson from the database
            const deltedLesson = await Lesson.findByIdAndRemove(_id);
            if (!deltedLesson) {
                throw new ApolloError(`Appointment with id ${_id} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Return the deleted lesson
            return lesson;
        },
    }
};

// Export the lesson resolvers
module.exports = resolvers;
