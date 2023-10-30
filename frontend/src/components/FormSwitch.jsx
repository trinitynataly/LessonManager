/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 26/10/2023
Form Switch component for react-hook-form
*/

import { Controller } from "react-hook-form"; // Add Controller from react-hook-form
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import ButtonGroup from 'react-bootstrap/ButtonGroup'; // Add ButtonGroup component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Add Button component from react-bootstrap
import Alert from 'react-bootstrap/Alert'; // Add Alert component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes

// FormSwitch component
const FormSwitch = ({ name, control, label, options, error }) => {
  // Return the FormSwitch component
  return (
    <>
      {/* Controller component from react-hook-form */}
      <Controller
        name={name} // Name of the input
        control={control} // Control object from react-hook-form
        render={({ field: { onChange, value } }) => ( // Destructure onChange and value from field
          <Form.Group controlId={name} className="mb-3">
            {/* Form.Label component from react-bootstrap */}
            <Form.Label className="mb-1">{label}:</Form.Label>
            {/* ButtonGroup component from react-bootstrap */}
            <ButtonGroup toggle={value.toString()} className="form-shadow w-100">
              {options.map((option, index) => ( // Render the options as buttons
                <Button
                  key={index} // Key is required
                  type="button" // Set the type to button
                  variant={value === option.value ? 'primary' : 'outline-primary'} // Set the variant to primary if the value matches the option value
                  onClick={() => onChange(option.value)} // Set the value to the option value on click
                >
                  {option.label} {/* Render the label */}
                </Button>
              ))}
            </ButtonGroup>
            {/* Render the error message if there is one */}
            {error && (
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

// PropTypes for the FormSwitch component
FormSwitch.propTypes = {
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

// Default props for the FormSwitch component
FormSwitch.defaultProps = {
  error: null, // Error is null
};

// Export the FormSwitch component
export default FormSwitch;
