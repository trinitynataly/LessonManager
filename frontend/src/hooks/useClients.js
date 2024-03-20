/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 16/03/2024
Hook to get clients
*/

import { useQuery } from '@apollo/client'; // Import the useQuery hook
import { GET_CLIENTS } from '../graphql/clients/queries'; // Import the query

export const useClients = (companyId) => { // Define the useClients hook
    const { loading, error, data } = useQuery(GET_CLIENTS, { // Use the useQuery hook
        variables: { companyID: companyId }, // Pass the companyId as a variable
    });

    // Extract the data
    const clients = data ? data.getAllClients.map(client => ({
        // Map the data to the format required by the select component
        label: `${client.firstName} ${client.lastName}`,
        // Set the label to the client's full name
        value: client._id,
    })) : []; // If there is no data, set clients to an empty array

    // Return the loading, error, and clients
    return { loading, error, clients };
};
