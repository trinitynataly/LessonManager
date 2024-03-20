/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
Frontend application entry point.
*/

import React from 'react'; // Import React
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import App from './App'; // Import the App component
import reportWebVitals from './reportWebVitals'; // Import the reportWebVitals function
import StoreProvider from './Store'; // Import the StoreProvider component
import { ThemeProvider } from './Theme'; // Import the ThemeProvider component
import 'bootstrap/dist/css/bootstrap.min.css';


// Init the app
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app
root.render(
  <React.StrictMode>
      {/* Wrap the app in the StoreProvider component for accessing the shared data */}
      <StoreProvider>
        {/* Wrap the app in the ThemeProvider component for accessing the theme setting */}
        <ThemeProvider> 
          {/* Render the App component */}
          <App />
        </ThemeProvider>
      </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
