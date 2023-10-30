/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Profile Page
*/

import { useEffect, useContext } from 'react'; // Add useEffect and useContext hooks from React
import { useQuery, useMutation } from '@apollo/client'; // Add useQuery and useMutation hooks from Apollo Client
import { useForm } from 'react-hook-form'; // Add useForm hook from react-hook-form
import Container from 'react-bootstrap/Container'; // Add Container component from react-bootstrap
import Row from 'react-bootstrap/Row';  // Add Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Add Col component from react-bootstrap
import Card from 'react-bootstrap/Card'; // Add Card component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import FormInput from '../../components/FormInput'; // Add FormInput component 
import FormSubmit from '../../components/FormSubmit'; // Add FormSubmit component
import Title from '../../components/Title'; // Add Title component
import { StoreContext } from '../../Store'; // Add StoreContext from Store for user state management
import { FaUserEdit } from 'react-icons/fa'; // Add FaUserEdit icon from react-icons/fa
import { GET_USER } from '../../graphql/users/queries'; // Add GET_USER query
import { UPDATE_USER } from '../../graphql/users/mutations'; // Add UPDATE_USER mutation
import { joiResolver } from "@hookform/resolvers/joi"; // Add joiResolver from react-hook-form
import { profileSchema } from '../../validators/users'; // Add profileSchema from validators for user update validation
import { getUserFromSessionStorage } from '../../helpers/auth'; // Add getUserFromSessionStorage helper function
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Create Profile component
function Profile() {
  // Get the user, setConfirmMessage and setErrorMessage from the StoreContext
  const { user, setUser, setConfirmMessage, setErrorMessage } = useContext(StoreContext); // Get the user from the StoreContext
  
  // initiate the GET_USER query and get the data, loading and refetch properties
  const { data, loading: userGetLoading } = useQuery(GET_USER, {
    // Pass the user id as a variable
    variables: {
      // Get the user id from the user object
      id: user?user._id:'',
    },
  });

  // initiate the UPDATE_USER mutation and get the update and loading properties
  const [update, { loading: userUpdateLoading }] = useMutation(UPDATE_USER);

  // Destructure the handleSubmit function and errors object from the useForm hook
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    // Set the resolver to the updateSchema
    resolver: joiResolver(profileSchema),
    // Set the default values for the form fields
    defaultValues: {
      // User email
      email: "",
      // User first name
      first_name: "",
      // User last name
      last_name: ""
    }
  });

  // Create the onSubmit function
  const onSubmit = async (data, event) => {
    // Prevent the default form submit event
    event.preventDefault();
    // Destructure the email, first_name and last_name from the data object
    const { email, first_name, last_name } = data;
    // Try catch block for updating the user
    try {
      // Await the update mutation
      await update({
        // Pass the variables
        variables: {
          // Get the user id from the user object
          id: user?user._id:'',
          // Pass the user input
          UserInput: {
            // User email
            email,
            // User first name
            first_name,
            // User last name
            last_name,
          }
        }
      });
      setConfirmMessage('Profile Update', 'Profile updated successfully'); // Set confirmation message state
      // Get the user from the session storage to ensure the tokens are valid
      const sessionUser = getUserFromSessionStorage();
      sessionUser.email = email; // Set the email
      sessionUser.first_name = first_name; // Set the first_name
      sessionUser.last_name = last_name; // Set the last_name
      // Set the user in the context and to the session storage
      setUser(sessionUser);
    // Catch any errors
    } catch (error) {
      // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Profile Update', error.message); // Show the error message toast
    }
  };
  
  // Use the useEffect hook to set the form values when the data changes
  useEffect(() => {
    // Check if the data and data.getUser exist
    if (data && data.getUser) {
      // Set the form values
      setValue('email', data.getUser.email); // Set the email value
      setValue('first_name', data.getUser.first_name); // Set the first_name value
      setValue('last_name', data.getUser.last_name); // Set the last_name value
    }
  }, [data, setValue]); // Add data and setValue as dependencies

  if (userGetLoading) return <p>Loading...</p>; // If the userGetLoading is true, show the loading message
  // Return the Profile component
  return (
    <Container fluid>
      {/* Add the helmet vlock */}
      <Helmet>
        {/* Add the page title to the head section */}
        <title>Update Your Profile - Settings - Lesson Manager</title>
        {/* Add the page description to the head section */}
        <meta name="description" content="Section for managing your account details" />
      </Helmet>
      {/* Show the block title */}
      <Title title="Edit Your Profile" />
      {/* Create the form grid */}
      <Row className="justify-content-md-left">
        {/* Create the form grid column to take full width on xs breakpoint and gradually resuce width to 50% on XXL breakpoint */}
        <Col xs={12} xxl={6} xl={8} lg={10}>
          {/* Create the form card */}
          <Card>
            {/* Create the form card body */}
            <Card.Body>
              {/* Create the form and link onSubmit function */}
              <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* Create the form field for the email */}
                <FormInput name="email" control={control} type="email" label="Your Email" placeholder="Email" error={errors.email} />
                {/* Create the form field for the first_name */}
                <FormInput name="first_name" control={control} type="text" label="First Name" placeholder="First Name" error={errors.first_name} />
                {/* Create the form field for the last_name */}
                <FormInput name="last_name" control={control} type="text" label="Last Name" placeholder="Last Name" error={errors.last_name} />
                {/* Create the form submit button */}
                <FormSubmit loading={userUpdateLoading} label="Update Profile" icon={<FaUserEdit />} />
              </Form>  
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    );
}

// Export the Profile component
export default Profile;
  