/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
FormTextarea component for react forms
*/

import { useState } from "react"; // Add useState hook
import { Controller } from "react-hook-form"; // Add Controller from react-hook-form
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import Alert from 'react-bootstrap/Alert'; // Add Alert component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes

// FormTextarea component
const FormTextarea = ({ name, control, label, placeholder, error, rows }) => {

  // Return the FormTextarea component
  return (
    <>
    {/* Controller component from react-hook-form */}
      <Controller
        name={name} // Name of the textarea
        control={control} // Control object from react-hook-form
        // Render field component
        render={({ field }) => (
          <Form.Group controlId={name} className="mb-3">
            <Form.Label className="mb-1">{label}:</Form.Label>
            {/* Form.Control component from react-bootstrap for textarea */}
            <Form.Control
              {...field} // Spread all properties from field
              as="textarea" // Set component as textarea
              rows={rows} // Number of rows
              placeholder={placeholder} // Placeholder text
              size="lg" // Set the size to large
              className="form-shadow"  // Custom class for styling
            />
            {error && (
              // Alert component from react-bootstrap
              <Alert variant="danger" className="pt-1 pb-1 mt-2 mb-0">
                {error.message}
              </Alert>
            )}
          </Form.Group>
        )}
      />
    </>
  );
}

// PropTypes for FormTextarea
FormTextarea.propTypes = {
  name: PropTypes.string.isRequired, // Name of the textarea
  control: PropTypes.object.isRequired, // Control object from react-hook-form
  label: PropTypes.string.isRequired, // Label for the textarea
  placeholder: PropTypes.string, // Placeholder text
  error: PropTypes.object, // Error object from react-hook-form
  rows: PropTypes.number, // Number of rows in textarea
};

// Default props for FormTextarea
FormTextarea.defaultProps = {
  placeholder: '', // Default placeholder is empty string
  error: null, // Default error is null
  rows: 3, // Default number of rows
};

// Export the FormTextarea component
export default FormTextarea;
