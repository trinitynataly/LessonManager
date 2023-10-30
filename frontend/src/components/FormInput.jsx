/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Form Input component for react-hook-form
*/

import { useState } from "react"; // Add useState hook
import { Controller } from "react-hook-form"; // Add Controller from react-hook-form
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import Alert from 'react-bootstrap/Alert'; // Add Alert component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes
import { PiEyeClosed, PiEye } from 'react-icons/pi'; // Add PiEyeClosed and PiEye icons from react-icons/pi

// FormInput component
const FormInput = ({name, control, type, label, placeholder, error}) => {
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility

  // Return the FormInput component
  return (
    <>
    {/* Controller component from react-hook-form */}
      <Controller
        name={name} // Name of the input
        control={control} // Control object from react-hook-form
        // Render field component
        render={({ field }) => (
          <Form.Group controlId={name} className="mb-3">
            <Form.Label className="mb-1">{label}:</Form.Label>
            <div style={{ position: 'relative' }}>  {/* Wrap Form.Control and the icon button in a div */}
              {/* Form.Control component from react-bootstrap */}
              <Form.Control
                {...field} // Spread all properties from field
                type={type === 'password' ? (showPassword ? 'text' : 'password') : type}  // Conditionally set the type
                placeholder={placeholder} // Placeholder text
                size="lg" // Set the size to large
                className="form-shadow flex-grow-1"  // Set flex-grow-1 to take up available space
              />
              {type === 'password' && (  // Conditionally render the icon button for password fields
                <button 
                  type="button"  // Set the type to button
                  onMouseDown={() => setShowPassword(true)} // Toggle password visibility on mouse down
                  onMouseUp={() => setShowPassword(false)} // Toggle password visibility on mouse up
                  style={{  background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)' }}  // Icon style
                >
                  {/* Conditionally render the icon */}
                  {showPassword ? <PiEye /> : <PiEyeClosed />}
                </button>
              )}
            </div>
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

// PropTypes for FormInput
FormInput.propTypes = { 
  name: PropTypes.string.isRequired, // Name of the input
  control: PropTypes.object.isRequired, // Control object from react-hook-form
  type: PropTypes.string.isRequired, // Type of the input
  label: PropTypes.string.isRequired, // Label for the input
  placeholder: PropTypes.string, // Placeholder text
  error: PropTypes.object, // Error object from react-hook-form
};

// Default props for FormInput
FormInput.defaultProps = {
  placeholder: '', // Placeholder is empty string
  error: null, // Error is null
};

// Export the FormInput component
export default FormInput;