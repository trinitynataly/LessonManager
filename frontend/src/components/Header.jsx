/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 26/10/2023
Header component
*/

import { useContext } from 'react'; // Import useContext hook
import { Row, Col, Navbar, Dropdown } from 'react-bootstrap'; // Importing additional Dropdown from react-bootstrap
import { FaBars, FaUser, FaAdjust, FaMoon, FaSun } from 'react-icons/fa'; // Importing FaAdjust for the theme icon
import { StoreContext } from '../Store'; // Import StoreContext from Store
import { useTheme } from '../Theme'; // Import useTheme from Theme
import './../layouts/Main/style.scss'; // Import styles.css file from Main folder

// Header component
const Header = () => {
    // Destructure context values used in the component
    const { user, isMenuCollapsed, setIsMenuCollapsed, setIsMenuToggled } = useContext(StoreContext);
    const { themeMode, setThemeMode } = useTheme();

    // Function to handle theme change
    const changeThemeMode = (newMode) => {
        setThemeMode(newMode); // Update the theme mode in the context
        // Here you might want to add additional logic depending on how your theme is applied
    };

    // Function to get the theme icon based on the theme mode
    const GetIcon = () => {
        // Return the theme icon based on the theme mode
        switch (themeMode) {
            case 'default': // OS Default theme
                return <FaAdjust size={20} />;
            case 'light': // Light theme
                return <FaSun size={20} />;
            case 'dark': // Dark theme
                return <FaMoon size={20} />;
            default: // Default theme
                return <FaAdjust size={20} />;
        }
    }

    
    // Return the Header component
    return (
        <>
            {/* Render the header */}
            <Row className="header">
                {/* Render the Navbar */}
                <Col>
                    {/* Render the Navbar */}
                    <Navbar>
                        {/* Render the Navbar.Brand and the Navbar.Toggle */}
                        <Navbar.Brand href="#" onClick={() => setIsMenuCollapsed(!isMenuCollapsed)} className="d-none d-md-block">
                            {/* Render the menu icon */}
                            <FaBars size={20} />
                        </Navbar.Brand>
                        {/* Render the Navbar.Brand and the Navbar.Toggle */}
                        <Navbar.Brand href="#" onClick={() => setIsMenuToggled(true)} className="d-md-none">
                            {/* Render the menu icon */}
                            <FaBars size={24} />
                        </Navbar.Brand>
                        {/* Render the user icon and the theme dropdown */}
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                            {/* Render the user icon */}
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                                {/* Render the user icon */}
                                <div style={{ borderRadius: '50%', overflow: 'hidden', marginRight: '0.5rem' }}>
                                    <FaUser size={20} />
                                </div>
                                {/* Render the user name and greeting */}
                                Hello, {user && user.first_name}
                            </div>
                            {/* Render the theme dropdown */}
                            <Dropdown align="end" className="theme-select">
                                {/* Render the current theme icon and the theme dropdown */}
                                <Dropdown.Toggle variant="secondary" id="theme-dropdown" className="modeIcon d-flex align-items-center">
                                    <GetIcon /><span style={{ marginLeft: '10px' }}>Theme</span> {/* Theme icon selected dynamically */}
                                </Dropdown.Toggle>
                                {/* Render the theme dropdown menu */}
                                <Dropdown.Menu>
                                    {/* Render the theme options */}
                                    <Dropdown.Item onClick={() => changeThemeMode('default')} className={`${themeMode === 'default' ? 'selected' : ''} d-flex align-items-center`}><FaAdjust size={14} /><span style={{ marginLeft: '10px' }}>OS Default</span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => changeThemeMode('light')} className={`${themeMode === 'light' ? 'selected' : ''} d-flex align-items-center`}><FaSun size={14} /><span style={{ marginLeft: '10px' }}>Light</span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => changeThemeMode('dark')} className={`${themeMode === 'dark' ? 'selected' : ''} d-flex align-items-center`}><FaMoon size={14} /><span style={{ marginLeft: '10px' }}>Dark</span></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Navbar>
                </Col>
            </Row>
        </>
    );
};

// Export the Header component
export default Header;
