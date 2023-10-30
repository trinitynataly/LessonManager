/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Login page
*/

import { useContext } from 'react'; // Import the useContext hook
import { useForm } from "react-hook-form"; // Import the useForm hook
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { useMutation } from '@apollo/client'; // Import the useMutation hook
import { joiResolver } from "@hookform/resolvers/joi"; // Import the joiResolver function
import { loginSchema } from '../../validators/users'; // Import the loginSchema
import { LOGIN_USER } from '../../graphql/users/mutations'; // Import the LOGIN_USER mutation
import { StoreContext } from '../../Store'; // Import the StoreContext
import Card from 'react-bootstrap/Card'; // Import the Card component
import Form from 'react-bootstrap/Form'; // Import the Form component
import FormInput from '../../components/FormInput'; // Import the FormInput component
import FormSubmit from '../../components/FormSubmit'; // Import the FormSubmit component
import { FaLockOpen } from 'react-icons/fa'; // Import the FaLockOpen icon
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Login component
const Login = () => {
  // Destructure the setUser, setConfirmMessage and setErrorMessage from StoreContext
  const { setUser, setConfirmMessage, setErrorMessage } = useContext(StoreContext);
  // Destructure the useNavigate hook
  const navigate = useNavigate();

  // Destructure the useForm hook
  const {
    control, // The control function
    handleSubmit, // The handleSubmit function
    formState: { errors }, // The errors object
    reset, // The reset function
 } = useForm({
    resolver: joiResolver(loginSchema), // Use joi as the resolver and pass the loginSchema
    defaultValues: { // Set default values for the form fields
      email: "", // Default email is empty
      password: "" // Default password is empty
    }
  });

  // Use the useMutation hook to create the loginUser mutation
  const [login, { loading }] = useMutation(LOGIN_USER);
  // Create the onSubmit function
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevent the default form submit function
    const { email, password } = data; // Destructure the email and password from data
    try { // Try the mutation
      const result = await login({ // Await the login mutation
        variables: { // Pass the variables
          loginInput: { // Pass the loginInput object
            email, // Pass the email
            password // Pass the password
          }
        }
      });
      setUser(result.data.loginUser); // set the user in context
      setConfirmMessage('Login', 'Login successful'); // Set confirmation message state
      navigate("/"); // Navigate to the home page
    } catch (error) {
      // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Sing In Error', error.message); // Set error message state
      reset(); // Reset the form
    }
  };

  // Return the Login component
  return (
    <>
      {/* Add the helmet vlock */}
      <Helmet>
        {/* Add the page title to the head section */}
        <title>Please Sign In - Lesson Manager</title>
        {/* Add the page description to the head section */}
        <meta name="description" content="Sing in page for Lesson Manger" />
      </Helmet>
      {/* Create the card */}
      <Card>
        {/* Create the card header */}
        <Card.Header>
          {/* Create the card title */}
          <Card.Title className="mt-1 mb-1">Please Sign In</Card.Title>
        </Card.Header>
        {/* Create the card body */}
        <Card.Body>
          {/* Create the form */}
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* Create the form inputs */}
            <FormInput name="email" control={control} type="email" label="Email" placeholder="Email" error={errors.email} /> {/* Add the email input */}
            <FormInput name="password" control={control} type="password" label="Password" placeholder="Password" error={errors.password} /> {/* Add the password input */}
            <FormSubmit loading={loading} label="Login" icon={<FaLockOpen />} /> {/* Add the submit button */}
          </Form>
          {/* Create the register link */}
          <div className="mt-2">
            <a href="/register">Don't have an account? Register here.</a>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

// Export the Login component
export default Login;