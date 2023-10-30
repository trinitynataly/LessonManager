/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Title component
*/

import Row from 'react-bootstrap/Row'; // Import Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import Col component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes

// Title component
const Title = ({ title, filter }) => {
  return (
    <>
    {/* Title row */}
    <Row className="align-items-center">
      {/* Title column */}
      <Col>
        {/* Title text */}
        <h1 className="m-0">{title}</h1>
      </Col>    
        {/* Conditional filter column */}
        {filter && (
        <Col className="text-end">
          {/* Filter component */}
          {filter}
        </Col>
        )}
    </Row>
    {/* Horizontal line */}
    <hr />
    </>
  );
};

// PropTypes for the Title component
Title.propTypes = {
    title: PropTypes.string.isRequired, // Title text
    filter: PropTypes.element // Filter element
};

Title.defaultProps = {
    filter: null, // No filter by default
};

// Default props for the Title component
export default Title;
