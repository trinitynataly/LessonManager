/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 29/10/2023
Security Page
*/

import { useContext } from 'react'; // Add useEffect and useContext hooks from React
import { useMutation } from '@apollo/client'; // Add useQuery and useMutation hooks from Apollo Client
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
import { CHANGE_USER_PASSWORD } from '../../graphql/users/mutations'; // Add CHANGE_USER_PASSWORD mutation
import { joiResolver } from "@hookform/resolvers/joi"; // Add joiResolver from react-hook-form
import { updatePasswordSchema } from '../../validators/users'; // Add updateSchema from validators for user update validation
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Create Security component
function Security() {
  // Get the user, setConfirmMessage and setErrorMessage from the StoreContext
  const { setConfirmMessage, setErrorMessage } = useContext(StoreContext); // Get the user from the StoreContext
  
  // initiate the UPDATE_USER mutation and get the update and loading properties
  const [update, { loading: userUpdateLoading }] = useMutation(CHANGE_USER_PASSWORD);

  // Destructure the handleSubmit function and errors object from the useForm hook
  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    // Set the resolver to the updateSchema
    resolver: joiResolver(updatePasswordSchema),
    // Set the default values for the form fields
    defaultValues: {
      // User email
      current_password: "",
      // User first name
      new_password: "",
      // User last name
      repeat_password: ""
    }
  });

  // Create the onSubmit function
  const onSubmit = async (data, event) => {
    // Prevent the default form submit event
    event.preventDefault();
    // Destructure the email, first_name and last_name from the data object
    const { current_password, new_password } = data;
    // Try catch block for updating the user
    try {
      // Await the update mutation
      await update({
        // Pass the variables
        variables: {
          // Pass the user input
          input: {
            // User email
            current_password,
            // User first name
            new_password,
            
          }
        }
      });
      reset();
      setConfirmMessage('Password Change', 'Your password had been changed successfully'); // Set confirmation message state
      // Get the user from the session storage to ensure the tokens are valid
      // Catch any errors
    } catch (error) {
      // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Password Update', error.message); // Show the error message toast
    }
  };
  
  // Use the useEffect hook to set the form values when the data changes
  return (
    <Container fluid>
      <Helmet>
        <title>Change Your Password - Settings - Lesson Manager</title>
        <meta name="description" content="Section for updating your account password" />
      </Helmet>
      {/* Show the block title */}
      <Title title="Change Your Password" />
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
                <FormInput name="current_password" control={control} type="password" label="Type in your current password" placeholder="Current Password" error={errors.current_password} />
                {/* Create the form field for the first_name */}
                <FormInput name="new_password" control={control} type="password" label="Type in the new password" placeholder="New Password" error={errors.new_password} />
                {/* Create the form field for the last_name */}
                <FormInput name="repeat_password" control={control} type="password" label="Confirm the new password" placeholder="Confirm New Password" error={errors.repeat_password} />
                {/* Create the form submit button */}
                <FormSubmit loading={userUpdateLoading} label="Set New password" icon={<FaUserEdit />} />
              </Form>  
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    );
}

// Export the Security component
export default Security;
  