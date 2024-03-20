/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
Footer component
*/

import { Row, Col, Navbar } from 'react-bootstrap'; // Importing elements from react bootstrap

const Footer = () => { // Footer component
  const currentYear = new Date().getFullYear();
  return (
    <>
      {/* Footer row */}
      <Row className="footer">
          {/* Footer column */}
          <Col>
              {/* Footer text */}
              <Navbar>
                  {/* Copyright Message */}
                  <Navbar.Text>&copy; 2023-{currentYear} Natalia Pakhomova</Navbar.Text>
              </Navbar>
          </Col>
      </Row>
    </>
  );
};

export default Footer;