/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 26/10/2023
Form Select component for react-hook-form
*/

import { Controller } from "react-hook-form"; // Add Controller from react-hook-form
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import Alert from 'react-bootstrap/Alert'; // Add Alert component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes

// FormSelect component
const FormSelect = ({ name, control, label, options, error }) => {
  // Return the FormSelect component
  return (
    <>
      {/* Controller component from react-hook-form */}
      <Controller
        name={name} // Name of the input
        control={control} // Control object from react-hook-form
        render={({ field }) => ( 
          <Form.Group controlId={name} className="mb-3">
            {/* Form.Label component from react-bootstrap */}
            <Form.Label className="mb-1">{label}:</Form.Label>
            {/* Form.Select component from react-bootstrap */}
            <Form.Select {...field} size="lg" className="form-shadow">
              {/* Render the options */}
              <option value="" disabled>Please select...</option>
              {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
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
};

// PropTypes for the FormSelect component
FormSelect.propTypes = {
  name: PropTypes.string.isRequired, // Name of the input
  control: PropTypes.object.isRequired, // Control object from react-hook-form
  label: PropTypes.string.isRequired, // Label text
  options: PropTypes.arrayOf(PropTypes.shape({ // Array of options
    value: PropTypes.oneOfType([ // Value of the option can be one of the following types
        PropTypes.string, // String
        PropTypes.number // Number
      ]).isRequired, // Required
    label: PropTypes.string.isRequired, // Label text
  })).isRequired, // Required
  error: PropTypes.object, // Error object
};

// Default props for the FormSelect component
FormSelect.defaultProps = {
  error: null, // Error is null
};

// Export the FormSelect component
export default FormSelect;