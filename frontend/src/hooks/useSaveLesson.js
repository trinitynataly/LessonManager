/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 16/03/2024
Hook to save lessons
*/
import { useMutation } from '@apollo/client'; // Import the useMutation hook
import { CREATE_LESSON, UPDATE_LESSON } from '../graphql/lessons/mutations'; // Import the mutations

// Define the useSaveLesson hook
export const useSaveLesson = (onSuccess, onError) => {
    // Use the useMutation hook to create and update lessons
    const [createLesson, { loading: creating }] = useMutation(CREATE_LESSON, {
        // Define the onCompleted callback
        onCompleted: (data) => {
            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess(data, 'create');
            }
        },
        // Define the onError callback
        onError: (error) => {
            // Call the onError callback if provided
            if (onError) {
                onError(error, 'create');
            }
        }
    });

    // Use the useMutation hook to update lessons
    const [updateLesson, { loading: updating }] = useMutation(UPDATE_LESSON, {
        // Define the onCompleted callback
        onCompleted: (data) => {
            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess(data, 'update');
            }
        },
        // Define the onError callback
        onError: (error) => {
            // Call the onError callback if provided
            if (onError) {
                onError(error, 'update');
            }
        }
    });

    // Define the saveLesson function to conditionally call the correct mutation
    const saveLesson = async (data, lessonId = null) => {
        try {
            // Clone the data object to avoid mutating the original data
            const lessonData = { ...data };
                // Check if 'start' is a Date instance and convert to ISO string if true
            if (lessonData.start instanceof Date) {
                lessonData.start = lessonData.start.toISOString();
            }
                // Conditionally call the correct mutation based on whether a lessonId is provided
            if (lessonId) { 
                // If lessonId is provided, call the updateLesson mutation
                await updateLesson({ variables: { lessonId, lesson: lessonData } });
            } else {
                // If lessonId is not provided, call the createLesson mutation
                await createLesson({ variables: { lesson: lessonData } });
            }
        } catch (error) { // Catch any errors
            console.error('Error saving lesson:', error);
            throw error; // Rethrow the error after logging it
        }
    };
    

    // Return the saveLesson function and the loading state
    return {
        saveLesson,
        loading: creating || updating,
    };
};
