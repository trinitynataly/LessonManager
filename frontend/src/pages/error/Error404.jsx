/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
404 Error Page
*/

import { Link } from 'react-router-dom'; // Import Link component from react-router-dom
import { Row, Col, Button } from 'react-bootstrap'; // Import Row, Col and Button components from react-bootstrap
import { FaHome } from 'react-icons/fa'; // Import FaHome component from react-icons/fa

// Error404 component
const Error404 = () => {
    return (
        <>
            {/* main row */}
            <Row className="justify-content-center">
                {/* main column */}
                <Col className="text-center">
                    {/* 404 error title */}
                    <h1 className="mb-5">404 - Page Not Found</h1>
                    {/* 404 error message */}
                    <p className="mb-5">The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                    {/* Home button */}
                    <Button as={Link} to="/" variant="outline-primary" className="mt-3 btn-lg submitButton">
                        <FaHome/> 
                        Go to Home
                    </Button>
                </Col>
            </Row>
        </>
    );
}

// Export the Error404 component
export default Error404;