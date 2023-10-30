/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 26/10/2023
Form Submit component for react-hook-form
*/

import Button from 'react-bootstrap/Button'; // Add Button component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes

// FormSubmit component
const FormSubmit = ({ loading, label, icon }) => {
    // Return the FormSubmit component
    return (
        <>
            {/* Button component from react-bootstrap */}
            <Button variant="primary" type="submit" disabled={loading} className="btn-lg submitButton">
                {/* render the icon */}
                {icon}
                {/* Conditionally render the label */}
                {loading ? "Loading..." : label}
            </Button>
        </>
    );
};

// PropTypes for the FormSubmit component
FormSubmit.propTypes = {
    loading: PropTypes.bool.isRequired, // Loading state
    label: PropTypes.string.isRequired, // Label text
    icon: PropTypes.object, // Icon
};

// Default props for the FormSubmit component
FormSubmit.defaultProps = {
    icon: null, // No icon by default
};

// Export the FormSubmit component
export default FormSubmit;