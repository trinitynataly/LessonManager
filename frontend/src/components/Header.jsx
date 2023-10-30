/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 26/10/2023
Header component
*/

import { useContext } from 'react'; // Import useContext hook
import { Row, Col, Navbar } from 'react-bootstrap'; // Importing elements from react bootstrap
import { FaBars, FaUser } from 'react-icons/fa'; // Importing icons from react icons
import { StoreContext } from '../Store'; // Import StoreContext from Store

// Header component
const Header = () => {
    // Destructure user, isMenuCollapsed, setIsMenuCollapsed, setIsMenuToggled from StoreContext
    const { user, isMenuCollapsed, setIsMenuCollapsed, setIsMenuToggled } = useContext(StoreContext);
    // Return the Header component
    return (
        <>
            {/* Header row */}
            <Row className="header">
                {/* Header column */}
                <Col>
                    {/* Header navigation */}
                    <Navbar>
                        {/* Navbar.Brand component from react-bootstrap collapse menu on desktop */}
                        <Navbar.Brand href="#" onClick={() => {setIsMenuCollapsed(!isMenuCollapsed)}} className="d-none d-md-block">
                            {/* Conditionally render the menu icon */}
                            <FaBars size={20} />
                        </Navbar.Brand>
                        {/* Navbar.Brand component from react-bootstrap toggle menu on mobile */}
                        <Navbar.Brand href="#" onClick={() => {setIsMenuToggled(true)}} className="d-md-none">
                            {/* Conditionally render the menu icon */}
                            <FaBars size={24} />
                        </Navbar.Brand>
                        {/* column for user infomation */}
                        <div style={{marginLeft:'auto'}}>
                            {/* User block */}
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {/* User icon */}
                                <div style={{borderRadius: '50%', overflow: 'hidden', marginRight: '0.5rem'}}>
                                    <FaUser size={20} />
                                </div>
                                {/* User name */}
                                Hello, {user && user.first_name}
                            </div>
                        </div>
                    </Navbar>
                </Col>
            </Row>
        </>
    );
};

// Export the Header component
export default Header;
