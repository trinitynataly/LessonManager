/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
Error layout
*/

import { Outlet } from 'react-router-dom'; // Import Outlet component from react-router-dom
import './style.scss';  // Importing a CSS file for styling

// ErrorLayout component
function ErrorLayout() {
  return (
    <>
      {/* Create full-screen layout */}
      <div className="error-layout">
        {/* Create full-screen container */}
        <div className="error-card-container">
          {/* Outlet child component */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

// Export the ErrorLayout component
export default ErrorLayout;
