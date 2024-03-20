/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 05/03/2024
Hook to get users
*/

import { useQuery } from '@apollo/client'; // Import the useQuery hook
import { GET_USERS } from '../graphql/users/queries'; // Import the query

// Define the useUsers hook
export const useUsers = (companyId) => {
    // Use the useQuery hook to get users
    const { loading, error, data } = useQuery(GET_USERS, {
        variables: { companyID: companyId }, // Pass the companyId as a variable
    });

    // Extract the data
    const users = data ? data.getAllUsers.map(user => ({
        // Map the data to the format required by the select component
        label: `${user.first_name} ${user.last_name}`,
        // Set the label to the user's full name
        value: user._id,
    })) : []; // If there is no data, set users to an empty array

    // Return the loading, error, and users
    return { loading, error, users };
};