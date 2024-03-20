/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 18/03/2024
Vite configuration file.
*/

import { defineConfig } from 'vite'; // Import the defineConfig function
import react from '@vitejs/plugin-react'; // Import the Vite React plugin

// Export the Vite configuration
export default defineConfig({
  // Define the plugins used by Vite (in this case, the React plugin)
  plugins: [react()]
});
