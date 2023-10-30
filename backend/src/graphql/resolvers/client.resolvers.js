/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Resolvers for Client GraphQL operations.
Contains resolvers for querying, creating, updating, and deleting clients.
*/

const { ApolloError, ForbiddenError } = require('apollo-server'); // Import the ApolloError and ForbiddenError classes
const { Client, Company } = require('../../models'); // Import the Client model
const { ClientValidator } = require('../../validators'); // Import the client validators
const { isAuthenticated, isAuthorized } = require('../../helpers/auth'); // Import the auth helpers

// Define the resolvers for client-related queries and mutations
const resolvers = {
  // Define the resolver for the Client type
    Client: {
        // Resolver for fetching the associated company for a client
        company: async (client) => {
            try {
                // Fetch the associated company based on the company ID in the client
                const company = await Company.findById(client.company);
                // Return the found company
                return company;
            } catch (error) {
                // If the company doesn't exist, throw an error
                throw new ApolloError(`Failed to get company data: ${error.message}`, 'GET_COMPANY_ERROR');
            }
        },
    },
    Query: {
        // Resolver for fetching all clients
        getAllClients: async (_, { companyID }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Fetch the companyID and level from the authenticated client
            const userCompanyID = context.user.company;
            const userLevel = context.user.level;
            // Define the filter based on the client's level
            let filter = {};
            // If the client is a super admin, allow to specify company ID
            if (userLevel === 2) {
                // If company ID is specified, check if it exists
                if (companyID) {
                    // Check if the company exists in the database
                    const company = await Company.findById(companyID);
                    // If the company doesn't exist, throw an error
                    if (!company) {
                        throw new ApolloError(`Company with id ${companyID} does not exist.`, 'GET_COMPANY_ERROR');
                    }
                }
                // If company ID is specified, use it as a filter, otherwise use the client's company ID
                filter.company = companyID? companyID : userCompanyID;
            } else {
                // If the client is not a super admin, they can only list clients of their company
                filter.company = userCompanyID;
            }
            // Fetch clients based on the defined filter
            const clients = await Client.find(filter)
            // Return the fetched clients
            return clients;
        },
        // Resolver for fetching a client by ID
        getClient: async (_, { _id }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Fetch a client by ID from the database
            const client = await Client.findById(_id)
            // If the client doesn't exist, throw an error
            if (!client) {
                throw new ApolloError(`Client with id ${_id} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to read the client
            isAuthorized(context.user, null, client.company._id, false);
            // Return the fetched client
            return client;
        },
    },
    Mutation: {
        // Resolver for creating a new client
        createClient: async (_, { input }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Validate the input data
            await ClientValidator.validateNewClient(input);
            // Check if the user is authorized to create a new client in the specified company
            isAuthorized(context.user, null, input.company, false);
            // Create a new Client instance with the provided input data
            const client = new Client(input);
            // Save the new client to the database
            await client.save();
            // Return the new client
            return client;
        },
        // Resolver for updating a client
        updateClient: async (_, { _id, input }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Validate the input data
            await ClientValidator.validateUpdateClient(_id, input);
            // Find the client by ID
            const client = await Client.findById(_id);
            // If the client doesn't exist, throw an error
            if (!client) {
                throw new ApolloError(`Client with id ${_id} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to update this client
            isAuthorized(context.user, null, client.company, false);
            // If the user is not a super admin, they can only update clients of their company
            if (context.user.level < 2) {
                // Check if client is trying to change the company
                if (input.company && input.company != client.company) {
                    // Throw an error if the client is trying to change the company
                    throw new ForbiddenError(`You have no permission to change company for this client`);
                }
            }
            // Update the client with the new input data
            Object.assign(client, input);
            // Save the updated client to trigger the pre-save middleware
            await client.save();
            // Return the updated client
            return await Client.findById(_id)
        },
        // Resolver for deleting a client
        deleteClient: async (_, { _id }, context) => {
            // Check if the client is authenticated
            isAuthenticated(context);
            // Find the client by ID
            const client = await Client.findById(_id);
            // If the client doesn't exist, throw an error
            if (!client) {
                throw new ApolloError(`Client with id ${_id} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Check if the user is authorized to update a new client in the specified company
            isAuthorized(context.user, null, client.company, false);
            // Delete the client from the database and return the deleted client
            const deletedClient = await Client.findByIdAndRemove(_id);
            // If the client doesn't exist, throw an error
            if (!deletedClient) {
                throw new ApolloError(`Client with id ${_id} does not exist`, 'GET_CLIENT_ERROR');
            }
            // Return the deleted client
            return deletedClient;
        },
    },
};

module.exports = resolvers; // Export the resolvers