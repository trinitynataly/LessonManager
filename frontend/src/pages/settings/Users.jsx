/*
Version: 1.7
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Users page
*/

import { useContext, useState } from 'react'; // Add useContext and useState hooks from React
import { useQuery, useMutation } from '@apollo/client'; // Add useQuery and useMutation hooks from Apollo Client
import { GET_USERS } from '../../graphql/users/queries';  // Import GET_USERS query
import { GET_COMPANIES } from '../../graphql/companies/queries'; // Import GET_COMPANIES and GET_COMPANY queries
import { useForm } from 'react-hook-form';  // Import useForm and Controller from react-hook-form
import { joiResolver } from '@hookform/resolvers/joi';  // Import joiResolver for form validation
import { userSchema } from '../../validators/users';  // Import your validation schema
import { CREATE_USER, UPDATE_USER, DELETE_USER } from '../../graphql/users/mutations'; // Import CREATE_USER, UPDATE_USER and DELETE_USER mutations
import { StoreContext } from '../../Store';  // Import your StoreContext for user level check
import Container from 'react-bootstrap/Container'; // Add Container component from react-bootstrap
import Table from 'react-bootstrap/Table'; // Add Table component from react-bootstrap
import Alert from 'react-bootstrap/Alert'; // Add Alert component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Add Button component from react-bootstrap
import Modal from 'react-bootstrap/Modal'; // Add Modal component from react-bootstrap
import Title from '../../components/Title';  // Import your Title component
import FormInput from '../../components/FormInput'; // Add FormInput component 
import FormSwitch from '../../components/FormSwitch'; // Add FormSwitch component
import FormSubmit from '../../components/FormSubmit'; // Add FormSubmit component
import { FaUserPlus, FaUserEdit, FaUserTimes } from 'react-icons/fa'; // Add FaUserPlus, FaUserEdit and FaUserTimes icons from react-icons/fa
import { getUserFromSessionStorage } from '../../helpers/auth'; // Add getUserFromSessionStorage helper function
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Create a function to get the user level as text
function getLevel(level) {
    switch (level) { // Switch the level
        case 0: // If level is 0 - user
        return 'User';
        case 1: // If level is 1 - company admin
        return 'Admin';
        case 2: // If level is 2 - super admin
        return 'Super Admin';
        default: // default - user
        return 'User';
    }
}

// Create a function to get the user status as text
function getStatus(status) {
    switch (status) { // Switch the status
        case 1: // If status is 1 - active
        return 'Active';
        case 0: // If status is 0 - inactive
        return 'Inactive';
        default: // default - active
        return 'Active';
    }
}

// Create a function to get the user level options
function getLevelOptions(level) {
    // Create an empty array for the options
    let options = [];
    options.push({ value: 0, label: 'User' }); // Add the user option
    options.push({ value: 1, label: 'Admin' }); // Add the admin option
    if (level === 2) { // option 2 is only available for super admin
        options.push({ value: 2, label: 'Super Admin' }); // Add the super admin option
    }
    return options; // Return the options
}

// Create a function to get the user status options
function getStatusOptions() {
    let options = []; // Create an empty array for the options
    options.push({ value: 1, label: 'Active' }); // Add the active option
    options.push({ value: 0, label: 'Inactive' }); // Add the inactive option
    return options; // Return the options
}

// Create Users component
function Users() {
  // Get the user, setUser, setErrorMessage and setConfirmMessage from the StoreContext
  const {user, setUser, setErrorMessage, setConfirmMessage} = useContext(StoreContext);
  // Create the user state
  const [users, setUsers] = useState([]);
  // Create the company state
  const [company, setCompany] = useState({ _id: user.company._id, name: user.company.companyName });
  // Create the companies state
  const [companies, setCompanies] = useState([]);
  // Create the showModal state
  const [showModal, setShowModal] = useState(false);
  // Create the editingUserId state
  const [editingUserId, setEditingUserId] = useState(null);
  
  // initiate the GET_COMPANIES query and get the data, loading and refetch properties
  const { loading: companyLoading } = useQuery(GET_COMPANIES, {
    skip: user.level < 2, // Skip this query if the user level is less than 2
    onCompleted: (data) => setCompanies(data.getAllCompanies), // Set the companies state on completed
    onError: (error) => setErrorMessage('Data Load', error.message), // Set the error message on error
  });

  // initiate the GET_USERS query and get the data, loading and refetch properties
  const { loading: userLoading } = useQuery(GET_USERS, {
    variables: { companyID: company._id }, // Pass the company id as a variable
    onCompleted: (data) => setUsers(data.getAllUsers), // Set the users state on completed
    onError: (error) => setErrorMessage('Data Load', error.message), // Set the error message on error
  });

  // initiate the CREATE_USER mutation and get the create and loading properties
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: (data) => { // Handle successful creation
      const updatedUsers = [...users, data.createUser]; // Add the new user to the users array
      setUsers(updatedUsers); // Set the users state
    },
  });

  // initiate the UPDATE_USER mutation and get the update and loading properties
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: (data) => { // Handle successful creation
      // Find the user in the users array and replace it with the updated user
      const updatedUsers = users.map(user => user._id === data.updateUser._id ? data.updateUser : user);
      // Set the users state
      setUsers(updatedUsers);
    },
  });

  // initiate the DELETE_USER mutation and get the delete and loading properties
  const [deleteUser] = useMutation(DELETE_USER, {
    // Handle successful deletion
    onCompleted: (data) => {
      // Filter the deleted user from the users array
      const updatedUsers = users.filter(user => user._id !== data.deleteUser._id); 
      // Set the users state
      setUsers(updatedUsers);
      // Show the confirmation message
      setConfirmMessage('Delete User', `User ${data.deleteUser.first_name} ${data.deleteUser.last_name} had been successfully deleted.`);
    },
    // Handle error
    onError: (error) => setErrorMessage('Delete User', error.message),
  });

  // Destructure the handleSubmit function and errors object from the useForm hook
  const { handleSubmit, control, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: joiResolver(userSchema(!!editingUserId)), // Use joi as the resolver and pass the userSchema
    defaultValues: { // Set default values for the form fields
      first_name: '', // Default first_name is empty
      last_name: '', // Default last_name is empty
      password: '', // Default password is empty
      repeat_password: '', // Default repeat_password is empty
      email: '', // Default email is empty
      level:0, // Default level is 0
      status: 1, // Default status is 1
    },
  });

  // Functon to handle the company dropdown change
  const handleCompanyChange = (event) => {
    // Get the selected company id from the event
    const selectedCompanyId = event.target.value;
    // Find the selected company from the companies array
    const selectedCompany = companies.find(company => company._id === selectedCompanyId);
    // Set the company state if found
    if (selectedCompany) {
        setCompany({ _id: selectedCompany._id, name: selectedCompany.companyName });
    }
  };

  // Function to handle the delete user
  const handleDeleteUser = (userId) => {
    // Find the user in the users array
    const userObject = users.find(user => user._id === userId);
    // Check if the user exists
    if (!userObject) {
      // Show the error message if the user does not exist
      setErrorMessage('User Update', 'Cannot load user data!');
    } else if (userObject.level > user.level) { // Check if the user level is higher than the current user
      // Show the error message if the user level is higher than the current user
      setErrorMessage('User Update', 'You do not have permission to delete this user!');
    } else {
      // Show the confirmation message
      const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone!');
      if (confirmDelete) { // If the user confirms the deletion
        deleteUser({ variables: { id: userId } }); // Delete the user
      }
    }
  };

  // Function to handle the edit user
  const handleEditUser = (userId) => {
    // Find the user in the users array
    const userObject = userId?users.find(user => user._id === userId):null;
    // Check if the user exists
    if (userId && !userObject) {
      // Show the error message if the user does not exist
      setErrorMessage('User Update', 'Cannot load user data!');
    } else if (userObject && userObject.level > user.level) { // Check if the user level is higher than the current user
      // Show the error message if the user level is higher than the current user
      setErrorMessage('User Update', 'You do not have permission to edit this user!');
    } else { // If the user exists and the user level is lower than the current user
      setEditingUserId(userId); // Set the editingUserId state
      setValue('first_name', userObject?userObject.first_name:""); // Set the first_name value
      setValue('last_name', userObject?userObject.last_name:""); // Set the last_name value
      setValue('password', ''); // Clear the password value
      setValue('repeat_password', ''); // Clear the repeat_password value
      setValue('email', userObject?userObject.email:""); // Set the email value
      setValue('level', userObject?userObject.level:0); // Set the level value
      setValue('status', userObject?userObject.status:1); // Set the status value
      // Show the modal
      setShowModal(true);
    }
  }

  // Create the onSubmit function
  const onSubmit = async (data, event) => {
    // Prevent the default form submit event
    event.preventDefault();
    // Destructure the email, first_name and last_name from the data object
    const { email, first_name, last_name, password, level, status } = data;
    // Create the userInput object
    const userInput = {
      email,
      first_name,
      last_name,
      level,
      status,
    };
    // Only include the password field in userInput if it's not empty
    if (password || !editingUserId) {
      userInput.password = password;
    }
    // Try catch block for updating the user
    try {
      // if editing user - await the update mutation
      if (editingUserId) {
        await updateUser({
          variables: { // Pass the variables
            id: editingUserId, // Pass the user id
            UserInput: userInput, // Pass the user input
          },
        });
        // Show the confirmation message
        setConfirmMessage('User Update', `User account for ${first_name} ${last_name} had been successfully updated.`);
        // Update the user in the session storage if the user is the current user
        if (editingUserId === user._id) {
          const sessionUser = getUserFromSessionStorage();
          sessionUser.first_name = first_name;
          sessionUser.last_name = last_name;
          sessionUser.email = email;
          sessionUser.level = level;
          sessionUser.status = status;
          setUser(sessionUser);
        }
      } else {
        // if creating user - await the create mutation
        userInput.company = company._id;
        // Create the user
        await createUser({
          variables: { // Pass the variables
            UserInput: userInput
          },
        });
        // Show the confirmation message
        setConfirmMessage('User Create', `New user account for ${first_name} ${last_name} had been successfully created.`);
      }
      // Hide the form
      setShowModal(false);
    } catch (error) {
      // Handle error here if not using the Apollo's useMutation error
      setErrorMessage(editingUserId?'User Update':'User Create', error.message); // Show the error message toast
    }
  };

  // Create the renderCompanyDropdown function
  const renderCompanyDropdown = () => {
    // Check if the user level is 2 and the companies exist
    if (user.level === 2 && companies) {
      return (
        <>
          {/* Create the company dropdown */}
          <Form.Select 
            value={company._id}  // Set the value to the company id
            onChange={handleCompanyChange}  // Set the onChange event to the handleCompanyChange function
            style={{ width: 'auto', maxWidth: '100%', marginLeft: 'auto' }} // Set the style
          >
            {/* Map through the companies and return the options */}
            {companies.map((company) => (
              <option key={company._id} value={company._id}>{company.companyName}</option>
            ))}
          </Form.Select>
        </>
      );
    }
    // Return null if the user level is not 2 or the companies do not exist
    return null;
  };
    
  // Create the renderUsersTable function
  const renderUsersTable = () => (
    <>
      {/* Render the user button */}
      <Button variant="primary" size="lg" className="mb-3"  onClick={() => {handleEditUser(null)}}>
        <FaUserPlus /> New User
      </Button>
      {/* Render the users table */}
      <Table striped bordered hover>
        {/* Render the table head */}
        <thead>
          <tr>
            {/* Render the table head cells */}
            <th>Name</th> 
            <th>Email</th>
            <th>Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through the users and render the table rows */}
          {users && users.length > 0 ? (
            users.map((userObject) => (
              <tr key={userObject._id}> {/* Add the key for the loop */}
                <td>{userObject.first_name} {userObject.last_name}</td> {/* Render the user name */}
                <td>{userObject.email}</td> {/* Render the user email */}
                <td>{getLevel(userObject.level)}</td> {/* Render the user level */}
                <td>{getStatus(userObject.status)}</td> {/* Render the user status */}
                <td className="table-tools"> {/* Render the table tools */}
                  {userObject.level <= user.level && ( // Only show the edit and delete buttons if the user level is lower than the current user
                    <>
                      {/* Render the edit button and link the onClick event to the handleEditUser function */}
                      <Button variant="primary" className="mr-2" size="sm" title="Edit User" onClick={() => { handleEditUser(userObject._id); }}>
                        <FaUserEdit /> <span className="d-none d-lg-inline">Edit User</span>
                      </Button>
                      {/* Render the delete button and link the onClick event to the handleDeleteUser function */}
                      <Button variant="danger" size="sm" title="Delete User" onClick={() => handleDeleteUser(userObject._id)}>
                        <FaUserTimes /> <span className="d-none d-lg-inline">Delete User</span>
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            // Render the empty table row if there are no users
            <tr>
              <td colSpan="5" className="text-center">There are no users in this company</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );

  // Create the renderUserModal function
  const renderUserModal = () => (
    <>
      {/* Render the modal popup */}
      <Modal show={showModal} onHide={() => setShowModal(false)}> {/* Set the show property to the showModal state and set the onHide event to hide the modal */}
        {/* Render the modal header */}
        <Modal.Header closeButton> {/* Add the close button */}
          {/* Render the modal conditional title */}
          <Modal.Title>{editingUserId ? "Update User Account" : "Create New User Account"}</Modal.Title>
        </Modal.Header>
        {/* Render the modal body */}
        <Modal.Body>
          {/* Render the form and link the onSubmit event to the handleSubmit function */}
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* Render the form inputs */}
            <FormInput name="email" control={control} type="email" label="Email" placeholder="Email" error={errors.email} /> {/* Add the email input */}
            <FormInput name="password" control={control} type="password" label="Password" placeholder="Password" error={errors.password} /> {/* Add the password input */}
            <FormInput name="repeat_password" control={control} type="password" label="Confirm password" placeholder="Confirm Password" error={errors.repeat_password} /> {/* Add the repeat_password input */}
            <hr />
            <FormInput name="first_name" control={control} type="text" label="First Name" placeholder="First Name" error={errors.first_name} /> {/* Add the first_name input */}
            <FormInput name="last_name" control={control} type="text" label="Last Name" placeholder="Last Name" error={errors.last_name} /> {/* Add the last_name input */}
            <FormSwitch name="level" control={control} label="User Level" options={getLevelOptions(user.level)} error={errors.level} />  {/* Add the level input */}
            <FormSwitch name="status" control={control} label="User Status" options={getStatusOptions()} error={errors.status} /> {/* Add the status input */}
            <hr />
            {/* Render the form submit button */}
            <FormSubmit 
              loading={isSubmitting} // Set the loading property to the isSubmitting state
              label={editingUserId ? "Update User Account" : "Create New User Account"}  // Set the label to the conditional text
              icon={editingUserId ? <FaUserEdit /> : <FaUserPlus />}  // Set the icon to the conditional icon
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );

  // Check if the user level is 0
  if (user && user.level <= 0) {
    // Show the error message if the user level is 0
    return (
      <Container>
        <Alert variant="danger">You do not have permission to view this page.</Alert>
      </Container>
    );
  }

  // Return the Users component
  return (
    <>
      {/* Render the main container */}
      <Container fluid>
        {/* Render the page title */}
        <Title title={"Users of " + company.name} filter={renderCompanyDropdown()} />
        {/* Render the helmet */}
        <Helmet>
          {/* Add the page title to the head section */}
          <title>Users of {company.name} - Settings - Lesson Manager</title>
          {/* Add the page description to the head section */}
          <meta name="description" content="Section for managing your company user list" />
        </Helmet>
        {/* Render the users table */}
        {userLoading || companyLoading ? <p>Loading...</p> : renderUsersTable()}
        {/* Render the user modal */}
        {renderUserModal()}
      </Container>
    </>
  );
}

// Export the Users component
export default Users;
