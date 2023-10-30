/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Sidebar component for react-pro-sidebar
*/

import { useContext, useState } from 'react'; // Import useContext hook
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"; // Import Sidebar, Menu, MenuItem, SubMenu components from react-pro-sidebar
import { FaHome, FaCalendarAlt, FaCalendarCheck, FaCog, FaUsers, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons
import { StoreContext } from '../Store'; // Import StoreContext from Store
import SidebarMenuItem from './SidebarMenuItem'; // Import SidebarMenuItem component
import { useLocation } from 'react-router-dom'; // Import useLocation hook

// SidebarMenu component
const SidebarMenu = () => {
  // Destructure user, setUser, isMenuCollapsed, isMenuToggled, setIsMenuToggled from StoreContext
  const {user, setUser, isMenuCollapsed, isMenuToggled, setIsMenuToggled } = useContext(StoreContext);
  // Destructure pathname from useLocation
  const location = useLocation();
  // Check if the current page is settings
  const isSettings = location.pathname.includes('/settings');
  // Set the isSettingsOpened state to isSettings
  const [ isSettingsOpened, setIsSettingsOpened ] = useState(isSettings);
 
  // Return the SidebarMenu component
  return (
    <>
      {/* Sidebar component from react-pro-sidebar */}
      <Sidebar 
        className="sidebar" // Add the sidebar class
        breakPoint="md" // Set the breakpoint to md
        backgroundColor='#033133' // Set the background color
        collapsed={isMenuCollapsed} // Set the collapsed state
        toggled={isMenuToggled} // Set the toggled state
        onBackdropClick={() => {setIsMenuToggled(false)}} // Close the sidebar on backdrop click
        closeOnClick={true} // Close the sidebar on menu item click
      >
        {/* Menu component from react-pro-sidebar */}
        <Menu 
        // Set the menu styles
        menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0) {
                return {
                  color: disabled ? '#999999' : '#FFFFFF', // Set the color to white if the menu item is not disabled
                  backgroundColor: (active) ? '#2DC7CC' : undefined, // Set the background color to #2DC7CC if the menu item is active
                };
              } else { // Set the styles for the submenu items
                return {
                  color: disabled ? '#999999' : '#FFFFFF', // Set the color to white if the menu item is not disabled
                  backgroundColor: (active) ? '#2DC7CC' : '#022324', // Set the background color to #2DC7CC if the menu item is active
                };
              }
            },
        }}
        // Set the menu root styles
        rootStyles={{
          '.ps-menu-button': { // Set the menu button styles
            '&:hover': { // Set the hover styles
              backgroundColor: '#045255',
              color: '#FFFFFF',
            },
            '&.ps-active:hover': { // Set the hover styles for the active menu button
              backgroundColor: '#045255',
              color: '#FFFFFF',
            },
          },
          '#logo': { // Set the logo styles
            fontSize: '120%',
            fontWeight: 'bold',
            backgroundColor: '#012021',
            height: '56px',
            '&:hover': {
              backgroundColor: '#012021',
              color: '#FFFFFF',
              cursor: 'default'
            },
          },
          '.ps-submenu-root.ps-open': { // Set the styles for the open submenu
            backgroundColor: '#022324',
          }
        }}
        >
          {/* Render the logo block */}
          <MenuItem id="logo" icon={<FaCalendarCheck/>}>
            Lesson Manager
          </MenuItem>
          {/* Render the menu items */}
          <SidebarMenuItem title="Home" to="/" icon={<FaHome/>} /> {/* Link to home */}
          <SidebarMenuItem title="Appointments" to="/appointments" icon={<FaCalendarAlt/>} /> {/* Link to appointments */}
          <SidebarMenuItem title="Clients" to="/clients" icon={<FaUsers/>} /> {/* Link to clients */}
          <SubMenu label="Settings" icon={<FaCog/>} open={isSettingsOpened} onOpenChange={() => {setIsSettingsOpened(!isSettingsOpened)}}> {/* Settings submenu */}
            <SidebarMenuItem title="Profile" to="/settings/profile" /> {/* Link to profile */}
            <SidebarMenuItem title="Security" to="/settings/security" /> {/* Link to security */}
            {user && user.level > 0 && <SidebarMenuItem title="Users" to="/settings/users" />} {/* Link to users */}
            {user && user.level > 0 && <SidebarMenuItem title="Company" to="/settings/company" />} {/* Link to company */}
          </SubMenu>
          <MenuItem icon={<FaSignOutAlt/>} onClick={() => {setUser(null)}}> Logout </MenuItem> {/* Logout menu item */}
        </Menu>
      </Sidebar>
    </>
  );
};

// Export the SidebarMenu component
export default SidebarMenu;
