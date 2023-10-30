/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Login page
*/

import { useContext } from 'react'; // Import the useContext hook
import { useForm } from "react-hook-form"; // Import the useForm hook
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { useMutation } from '@apollo/client'; // Import the useMutation hook
import { joiResolver } from "@hookform/resolvers/joi"; // Import the joiResolver function
import { registerSchema } from '../../validators/users'; // Import the registerSchema
import { REGISTER_USER } from '../../graphql/users/mutations'; // Import the REGISTER_USER mutation
import { StoreContext } from '../../Store'; // Import the StoreContext
import Card from 'react-bootstrap/Card'; // Import the Card component
import Form from 'react-bootstrap/Form'; // Import the Form component
import FormInput from '../../components/FormInput'; // Import the FormInput component
import FormSubmit from '../../components/FormSubmit'; // Import the FormSubmit component
import { FaPen } from 'react-icons/fa'; // Import the FaPen icon
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Register component
const Register = () => {
  // Destructure the setUser, setConfirmMessage and setErrorMessage from StoreContext
  const { setUser, setConfirmMessage, setErrorMessage } = useContext(StoreContext); // Get the user from the StoreContext
  // Destructure the useNavigate hook
  const navigate = useNavigate();
  // Destructure the useForm hook
  const {
    control, // The control function
    handleSubmit, // The handleSubmit function
    formState: { errors }, // The errors object
    reset, // The reset function
 } = useForm({
    resolver: joiResolver(registerSchema), // Use joi as the resolver and pass the registerSchema
    defaultValues: { // Set default values for the form fields
      email: "", // Default email is empty
      password: "", // Default password is empty
      confirm_password: "", // Default confirm_password is empty
      first_name: "", // Default first_name is empty
      last_name: "", // Default last_name is empty
      companyName: "", // Default companyName is empty
    }
  });

  // Use the useMutation hook to create the registerUser mutation
  const [register, { loading }] = useMutation(REGISTER_USER);
  
  // Create the onSubmit function
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevent the default form submit function
    const { email, password, first_name, last_name, companyName } = data; // Destructure the email and password from data
    try { // Try the mutation
      const result = await register({ // Await the register mutation
        variables: { // Pass the variables
          registerInput: { // Pass the registerInput object
            email, // Pass the email
            password, // Pass the password
            first_name, // Pass the first_name
            last_name, // Pass the last_name
            companyName // Pass the companyName
          }
        }
      });
      setUser(result.data.registerUser); // set the user in context
      setConfirmMessage('Registration', 'Registration successful'); // Set confirmation message state
      navigate("/"); // Navigate to the home page
    } catch (error) {
      // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Registration Error', error.message); // Set error message state
      reset(); // Reset the form
    }
  };
  
  // Return the Register component
  return (
    <>
      {/* Add the helmet vlock */}
      <Helmet>
        {/* Add the page title to the head section */}
        <title>New Account Registration - Lesson Manager</title>
        {/* Add the page description to the head section */}
        <meta name="description" content="New Account Registration page for Lesson Manger" />
      </Helmet>
      {/* Create the card */}
      <Card className="login">
        {/* Create the card header */}
        <Card.Header>
          {/* Create the card title */}
          <Card.Title className="mt-1 mb-1">Register New Account</Card.Title>
        </Card.Header>
        {/* Create the card body */}
        <Card.Body>
          {/* Create the form */}
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>         
            {/* Create the FormInput components */}
            <FormInput name="email" control={control} type="email" label="Your Email" placeholder="Email" error={errors.email} /> {/* Add the email input */}
            <FormInput name="password" control={control} type="password" label="Choose a password" placeholder="Password" error={errors.password} /> {/* Add the password input */}
            <FormInput name="confirm_password" control={control} type="password" label="Confirm your password" placeholder="Confirm Password" error={errors.confirm_password} /> {/* Add the confirm_password input */}
            <FormInput name="first_name" control={control} type="text" label="First Name" placeholder="First Name" error={errors.first_name} /> {/* Add the first_name input */}
            <FormInput name="last_name" control={control} type="text" label="Last Name" placeholder="Last Name" error={errors.last_name} /> {/* Add the last_name input */}
            <FormInput name="companyName" control={control} type="text" label="Company Name" placeholder="Company Name" error={errors.companyName} /> {/* Add the companyName input */}
            <FormSubmit loading={loading} label="Register" icon={<FaPen />} /> {/* Add the submit button */}
          </Form>
        </Card.Body>
        {/* Create the card footer */}
        <Card.Footer>
            {/* Create the register link */}
            <a href="/login">Already have an account? Login here.</a>
        </Card.Footer>
      </Card>
    </>
  );
}

// Export the Register component
export default Register;