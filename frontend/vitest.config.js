/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 18/03/2024
Setup file for Jest tests.
*/

import { defineConfig } from 'vitest/config'; // Import the defineConfig function
import react from '@vitejs/plugin-react'; // Import the Vite React plugin

// Export the Vite configuration
export default defineConfig({
  // Define the plugins used by Vite (in this case, the React plugin)
  plugins: [react()],
  // Define the environment for the tests
  test: {
    globals: true, // Use the globalThis object
    environment: 'jsdom',  // Use the JSDOM environment
    setupFiles: ['./setupTests.js'], // Use the setupTests.js file and define its path
  },
});
