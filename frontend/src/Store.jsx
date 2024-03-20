/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 06/03/2024
Frontend application global variables and data storage.
*/

import {useState, createContext } from 'react'; // Import the useState and createContext hooks from React
import { getUserFromSessionStorage, removeTokenfromSessionStorage, saveTokenToSessionStorage } from './helpers/auth'; // Import the auth helpers  
import PropTypes from 'prop-types'; // Import PropTypes


export const StoreContext = createContext(null); // Create the StoreContext

const StoreProvider = ({ children }) => { // Define the StoreProvider component

    const [user, setUserInternal] = useState(getUserFromSessionStorage() || null); // Define the user state variable
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false); // Define the isMenuCollapsed state variable
    const [isMenuToggled, setIsMenuToggled] = useState(false); // Define the isMenuToggled state variable
    const [confirmMessage, setConfirmMessageInternal] = useState({ show: false, title: '', message: '' }); // Define the confirmMessage state variable
    const [errorMessage, setErrorMessageInternal] = useState({ show: false, title: '', message: '' }); // Define the errorMessage state variable

    // Define the setUser function
    const setUser = (user) => {
        // check if user is null
        if (!user) {
            // if yes, remove token from session storage
            removeTokenfromSessionStorage();
        } else {
            // if not, save token to session storage
            saveTokenToSessionStorage(user);
        }
        // set the user state variable
        setUserInternal(user);
    };

    // Define the hideConfirmMessage function to hide the confirm message
    const hideConfirmMessage = () => {
        // Set the confirmMessage state variable to empty
        setConfirmMessageInternal({ show: false, title: '', message: '' });
    };

    // Define the hideErrorMessage function to hide the error message
    const hideErrorMessage = () => {
        // Set the errorMessage state variable to empty
        setErrorMessageInternal({ show: false, title: '', message: '' });
    };

    // Define the setConfirmMessage function to show the confirm message
    const setConfirmMessage = (title, message) => {
        // Set the confirmMessage state variable to the title and message
        setConfirmMessageInternal({ show: true, title, message });
        // Set a timeout to hide the confirm message after 3 seconds
        setTimeout(() => hideConfirmMessage(), 3000);
    };

    // Define the setErrorMessage function to show the error message
    const setErrorMessage = (title, message) => {
        // Set the errorMessage state variable to the title and message
        setErrorMessageInternal({ show: true, title, message });
        // Set a timeout to hide the error message after 3 seconds
        setTimeout(() => hideErrorMessage(), 3000);
    };

    // Define the store object
    const store = {
        user, setUser, // Add the user variable and set function
        isMenuCollapsed, setIsMenuCollapsed, // Add the isMenuCollapsed variable and set function
        isMenuToggled, setIsMenuToggled, // Add the isMenuToggled variable and set function
        confirmMessage, setConfirmMessage, hideConfirmMessage, // Add the confirmMessage variable and functions to set and clear it
        errorMessage, setErrorMessage, hideErrorMessage, // Add the errorMessage variable and functions to set and clear it
    }

    // Return the StoreContext.Provider component with the store object as value
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StoreProvider;