/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Sidebar Menu Item component for react-pro-sidebar
*/

import { useLocation } from "react-router-dom"; // Import useLocation hook
import { Link } from "react-router-dom"; // Import Link component from react-router-dom
import { MenuItem } from "react-pro-sidebar"; // Import MenuItem component from react-pro-sidebar
import PropTypes from 'prop-types'; // Import PropTypes

// SidebarMenuItem component
const SidebarMenuItem = ({ title, to, icon }) => {
  const location = useLocation(); // Destructure location from useLocation
  const isActive = location.pathname === to; // Check if the current page is the same as the menu item
  
  // Return the SidebarMenuItem component
  return (
    <MenuItem
      active={isActive} // Set the active state
      icon={icon} // Set the icon
      component={<Link to={to} />} // Set the component to Link
    >
      {/* Render the title */}
      {title}
    </MenuItem>

  );
};

/// PropTypes for the SidebarMenuItem component
SidebarMenuItem.propTypes = {
    title: PropTypes.string.isRequired, // Title text
    to: PropTypes.string.isRequired, // Link to
    icon: PropTypes.object, // Icon
};

// Default props for the SidebarMenuItem component
SidebarMenuItem.defaultProps = {
    icon: null, // No icon by default
};

// Export the SidebarMenuItem component
export default SidebarMenuItem;
