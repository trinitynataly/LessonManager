/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
Login layout
*/

import { Outlet } from 'react-router-dom'; // Import Outlet component from react-router-dom
import './style.scss';  // Importing a CSS file for styling

// LoginLayout component
function LoginLayout() {
  return (
    <>
      {/* Create full-screen layout */}
      <div className="login-layout">
        {/* Create full-screen container */}
        <div className="login-card-container">
          {/* Outlet child component */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

// Export the LoginLayout component
export default LoginLayout;
