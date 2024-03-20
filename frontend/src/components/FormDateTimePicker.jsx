/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
FormDateTimePicker component for react forms
*/

import { Controller } from 'react-hook-form'; // Import the Controller component from react-hook-form
import Form from 'react-bootstrap/Form'; // Import the Form component from React Bootstrap
import Alert from 'react-bootstrap/Alert'; // Import the Alert component from React Bootstrap
import PropTypes from 'prop-types'; // Import the PropTypes library from prop-types
import DatePicker from 'react-datepicker'; // Import DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import default styles for the datepicker
import './FormDateTimePicker.scss'; // Import custom styles for the datepicker

// FormDateTimePicker component
const FormDateTimePicker = ({ name, control, label, placeholder, error }) => {
  return (
    <>
      {/* Use the Controller component to wrap the DatePicker component */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Form.Group controlId={name} className="mb-3">
            {/* Render the label and the DatePicker component */}
            <Form.Label className="mb-1">{label}:</Form.Label>
            <div className="custom-datepicker">
              {/* Use the DatePicker component from react-datepicker */}
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText={placeholder}
                className="form-control form-shadow" // Use Bootstrap and custom classes for styling
              />
            </div>
            {error && (
              <Alert variant="danger" className="pt-1 pb-1 mt-2 mb-0">
                {/* Render the error message */}
                {error.message}
              </Alert>
            )}
          </Form.Group>
        )}
      />
    </>
  );
};

// PropTypes for FormDateTimePicker
FormDateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.object,
};

// Default props for FormDateTimePicker
FormDateTimePicker.defaultProps = {
  placeholder: '',
  error: null,
};

// Export the FormDateTimePicker component
export default FormDateTimePicker;
