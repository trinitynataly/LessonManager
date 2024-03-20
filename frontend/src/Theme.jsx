/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 15/03/2024
Theme context and provider for the application.
*/

// Import the createContext and useContext and other hooks from React
import { createContext, useContext, useState, useEffect } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Define the useTheme hook
export const useTheme = () => useContext(ThemeContext);

// Define the ThemeProvider component
export const ThemeProvider = ({ children }) => {
    // Define the themeMode state variable and setThemeMode function
    const [themeMode, setThemeMode] = useState(() => {
        // Get the theme mode from local storage or set it to default
        const localSetting = localStorage.getItem('themeMode');
        // Return the local setting or default
        return localSetting !== null ? localSetting : 'default';
    });

    // Define the useEffect hook to set the theme mode when it changes
    useEffect(() => {
        // Save the theme mode to local storage
        localStorage.setItem('themeMode', themeMode);

        // Function to apply theme based on current or system preference
        const applyTheme = (prefersDark) => {
            // Update the data-theme attribute of the document root
            const currentThemeMode = themeMode === 'default' ? (prefersDark ? 'dark' : 'light') : themeMode;
            // Update the body class
            document.documentElement.setAttribute('data-bs-theme', currentThemeMode);
            // Remove the old theme class
            document.body.classList.remove('theme-dark-mode', 'theme-light-mode');
            // Add the new theme class
            document.body.classList.add(`theme-${currentThemeMode}-mode`);
        };

        // Check if matchMedia is supported
        if (window.matchMedia) {
            // Create a media query to check the system preference
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            // Function to apply theme based on current preference
            const applySystemTheme = (e) => {
                // Call the applyTheme function
                applyTheme(e.matches);
            };

            // Set theme based on current preference
            applyTheme(mediaQuery.matches);

            // Listen for changes
            mediaQuery.addEventListener('change', applySystemTheme);

            // Cleanup function to remove listener
            return () => mediaQuery.removeEventListener('change', applySystemTheme);
        } else {
            // Fallback if matchMedia is not supported
            applyTheme(false);
        }
    }, [themeMode]);

    // Return the ThemeContext.Provider with the themeMode and setThemeMode
    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
