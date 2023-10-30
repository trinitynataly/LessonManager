/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
500 Error Page
*/

import { Link } from 'react-router-dom'; // Import Link component from react-router-dom
import { Row, Col, Button } from 'react-bootstrap'; // Import Row, Col and Button components from react-bootstrap
import { FaHome } from 'react-icons/fa'; // Import FaHome component from react-icons/fa

// Error500 component
const Error500 = () => {
    return (
        <>
            {/* main row */}
            <Row className="justify-content-center">
                {/* main column */}
                <Col className="text-center">
                    {/* 500 error title */}
                    <h1 className="mb-5">500 - Internal Server Error</h1>
                    {/* 500 error message */}
                    <p className="mb-5">There is a problem with the resource you are looking for, and it cannot be displayed.</p>
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

// Export the Error500 component
export default Error500;