/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Authentication helper functions
*/

// Saves user to Session Storage
function saveTokenToSessionStorage(user) {
    // Convert user to a string
    const userString = JSON.stringify(user);
    // Save user to session storage as a string
    sessionStorage.setItem("user", userString); 
}

// Removes user from Session Storage
function removeTokenfromSessionStorage() {
    // Remove user item from session storage
    sessionStorage.removeItem("user");
}

// Gets user from Session Storage
function getUserFromSessionStorage() {
    // Try the following
    try {
        // Get user from session storage
        const userString = sessionStorage.getItem("user");
        // Parse user to JSON
        const user = JSON.parse(userString);
        // Return user
        return user;
    } catch (error) { // Catch any errors
        // Clear session storage
        removeTokenfromSessionStorage();
        // Return null
        return null;
    }
}

// Handle logout without hook
function handleLogoutWithoutHook() {
    // Remove user from session storage
    removeTokenfromSessionStorage();
    // Redirect to login page
    window.location.href = '/login';
    
};

// Export the saveTokenToSessionStorage and getUserFromSessionStorage functions
export { saveTokenToSessionStorage, removeTokenfromSessionStorage, getUserFromSessionStorage, handleLogoutWithoutHook }; 