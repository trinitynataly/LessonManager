/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Clients Page
*/

import { useContext, useState } from 'react'; // Import the useContext and useState hooks
import { useQuery, useMutation } from '@apollo/client'; // Import the useQuery and useMutation hooks
import { GET_CLIENTS, GET_CLIENT } from '../graphql/clients/queries'; // Import GET_CLIENTS and GET_CLIENT queries
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../graphql/clients/mutations';  // Import CREATE_CLIENT, UPDATE_CLIENT and DELETE_CLIENT mutations  
import { useForm } from 'react-hook-form';  // Import useForm and Controller from react-hook-form
import { joiResolver } from '@hookform/resolvers/joi';  // Import joiResolver for form validation
import { clientSchema } from '../validators/clients'; // Import clientSchema for client validation
import { StoreContext } from '../Store';  // Import your StoreContext for user level check
import Container from 'react-bootstrap/Container'; // Import Container component from react-bootstrap
import Table from 'react-bootstrap/Table'; // Import Table component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Add Button component from react-bootstrap
import Modal from 'react-bootstrap/Modal'; // Add Modal component from react-bootstrap
import Title from '../components/Title';  // Import your Title component
import FormInput from '../components/FormInput'; // Add FormInput component 
import FormSubmit from '../components/FormSubmit'; // Add FormSubmit component
import { FaUserPlus, FaUserEdit, FaUserTimes } from 'react-icons/fa'; // Add the FaUserPlus, FaUserEdit and FaUserTimes icons
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Clients component
function Clients() {
  const {user, setErrorMessage, setConfirmMessage} = useContext(StoreContext);  // Get the user from the StoreContext
  const [clients, setClients] = useState([]);  // Create the clients array
  const [clientID, setClientID] = useState(null);  // Create the client edit ID
  const [showModal, setShowModal] = useState(false);  // Create the showModal state

  // Destructure the useForm hook
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: joiResolver(clientSchema), // Use joi as the resolver and pass the clientSchema
    defaultValues: { // Set default values for the form fields
      firstName: "", // Default firstName is empty
      lastName: "", // Default lastName is empty
      email: "", // Default email is empty
      phone: "", // Default phone is empty
      address: "", // Default address is empty
      city: "", // Default city is empty
      state: "", // Default state is empty
      postalCode: "", // Default postalCode is empty
      country: "", // Default country is empty
    }
  });

  // Set the client values
  const setValues = (client) => {
    setValue('firstName', client.firstName); // Set the firstName value
    setValue('lastName', client.lastName); // Set the lastName value
    setValue('email', client.email); // Set the email value
    setValue('phone', client.phone); // Set the phone value
    setValue('address', client.address); // Set the address value
    setValue('city', client.city); // Set the city value
    setValue('state', client.state); // Set the state value
    setValue('postalCode', client.postalCode); // Set the postalCode value
    setValue('country', client.country); // Set the country value
  }

  // Get the client data
  const { loading: clientsLoading } = useQuery(GET_CLIENTS, { // Use the useQuery hook to create the GET_CLIENTS query
    variables: { // Pass the variables
      companyID: user.company._id, // pass the companyID
    },
    onCompleted: (data) => setClients(data.getAllClients), // Set the clients state
    onError: (error) => setErrorMessage('Data Load', error.message), // Set the error message state
  });

  // Get the client data
  const { loading: clientLoading } = useQuery(GET_CLIENT, { // Use the useQuery hook to create the GET_CLIENT query
    skip: !clientID, // Skip the query if there is no clientID
    variables: { // Pass the variables
      id: clientID, // pass the clientID
    },
    // Set the client values on completed
    onCompleted: (data) => {
      setValues(data.getClient);
    },
    // Set the error message state on error
    onError: (error) => setErrorMessage('Data Load', error.message),
  });

  // Create the client
  const [create, { loading: createLoading }] = useMutation(CREATE_CLIENT, { // Use the useMutation hook to create the CREATE_CLIENT mutation
    onCompleted: (data) => { // Set the client values on completed
      setClientID(null); // Reset the clientID
      setShowModal(false); // Close the modal
      setConfirmMessage('Client Create', 'Client created successfully'); // Set confirmation message state
      setClients([...clients, data.createClient]); // Add the new client to the clients array
    },
    // Set the error message state on error
    onError: (error) => setErrorMessage('Client Create', error.message),
  });

  // Update the client
  const [update, { loading: updateLoading }] = useMutation(UPDATE_CLIENT, { // Use the useMutation hook to create the UPDATE_CLIENT mutation
    onCompleted: (data) => { // Set the client values on completed
      setClientID(null); // Reset the clientID
      setShowModal(false); // Close the modal
      setConfirmMessage('Client Update', 'Client updated successfully'); // Set confirmation message state
      setClients(clients.map(client => client._id === data.updateClient._id ? data.updateClient : client)); // Update the client in the clients array
    },
    onError: (error) => setErrorMessage('Client Update', error.message), // Set the error message state on error
  });

  // Delete the client
  const [deleteClient] = useMutation(DELETE_CLIENT, { // Use the useMutation hook to create the DELETE_CLIENT mutation
    onCompleted: (data) => { // Set the client values on completed
      setConfirmMessage('Client Delete', 'Client deleted successfully'); // Set confirmation message state
      setClients(clients.filter(client => client._id !== data.deleteClient._id)); // Remove the client from the clients array
    },
    onError: (error) => setErrorMessage('Client Delete', error.message), // Set the error message state on error
  });

  // Handle the edit client
  const handleEditClient = async (clientID) => { // Create the handleEditClient function
    if (clientID) { // If there is a clientID
      setClientID(clientID); // Set the clientID
    } else { // If there is no clientID
      setClientID(null); // Reset the clientID
      reset(); // Reset the form
    }
    setShowModal(true); // Show the modal
  }

  // Handle the delete client
  const handleDeleteClient = async (clientID) => { // Create the handleDeleteClient function
    if (!window.confirm('Are you sure you want to delete this client?')) return; // If the user does not confirm the delete, return
    try {
      // Await the deleteClient mutation
      await deleteClient({
        variables: { // Pass the variables
          clientID: clientID // Pass the clientID
        }
      });
    } catch (error) { // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Client Delete', error.message);
    }
  }

  // Handle the save client
  const handleSaveClient = async (data, event) => {
    // Prevent the default form submit function
    event.preventDefault();
    try { // Try the mutation
      if(clientID) { // If there is a clientID
        await update({ // Await the update mutation
          variables: { // Pass the variables
            clientID: clientID, // Pass the clientID
            ClientInput: data // Pass the client data
          }
        });
      } else { // If there is no clientID
        const clientData = { // Create the client data
          ...data, // Spread the data
          company: user.company._id // Add the company ID
        }
        // Await the create mutation
        await create({
          variables: { // Pass the variables
            ClientInput: clientData // Pass the client data
          }
        });
      }
    } catch (error) { // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Client Save', error.message);
    }
  }

  // Render the client table
  const renderClientTable = () => (
    <>
      {/* Add the new client button */}
      <Button variant="primary" size="lg" className="mb-3"  onClick={() => {handleEditClient(null)}}> {/* Add the onClick handler to show form */}
        <FaUserPlus /> New Client
      </Button>
      {/* Create the client table */}
      <Table striped bordered hover>
        {/* Create the table header */}
        <thead>
          {/* Create the table header row */}
          <tr>
            <th>Name</th> {/* Add the name column */}
            <th>Email</th> {/* Add the email column */}
            <th>Phone</th> {/* Add the phone column */}
            <th>Actions</th> {/* Add the actions column */}
          </tr>
        </thead>
        {/* Create the table body */}
        <tbody>
        {/* check if clients exists */}
        {clients && clients.length > 0 ? (
          // Loop through the clients array
          clients.map((client) => (
            // Create the table row
            <tr key={client._id}>
              <td>{client.firstName} {client.lastName}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              {/* Add the edit and delete buttons */}
              <td className="table-tools">
                {/* Add the edit button and link it to form popup */}
                <Button variant="primary" className="mr-2" size="sm" title="Edit User" onClick={() => { handleEditClient(client._id); }}>
                  <FaUserEdit /> <span className="d-none d-lg-inline">Edit Client</span>
                </Button>
                {/* Add the delete button and link it to delete function */}
                <Button variant="danger" size="sm" title="Delete User" onClick={() => handleDeleteClient(client._id)}>
                  <FaUserTimes /> <span className="d-none d-lg-inline">Delete Client</span>
                </Button>
              </td>
            </tr>
          ))
        ) : (
          // If there are no clients - show the empty message
          <tr>
            <td colSpan="4" className="text-center">There are no clients in {user.company.companyName}</td>
          </tr>
        )}
        </tbody>
      </Table>
    </>
  );

  // Render the client modal form
  const renderClientModal = () => (
    <>
      {/* Create the modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}> {/* Add the onHide handler to close the modal */}
        {/* Add the modal header */}
        <Modal.Header closeButton> {/* Add the close button */}
          {/* Add the conditional modal title */}
          <Modal.Title>{clientID ? "Update Client" : "Create New Client"}</Modal.Title>
        </Modal.Header>
        {/* Add the modal body */}
        <Modal.Body>
          {/* Create the form */}
          <Form noValidate onSubmit={handleSubmit(handleSaveClient)}>
            {/* Create the form inputs */}
            <FormInput name="firstName" control={control} type="text" label="First Name" placeholder="First Name" error={errors.firstName} /> {/* Add the firstName input */}
            <FormInput name="lastName" control={control} type="text" label="Last Name" placeholder="Last Name" error={errors.lastName} /> {/* Add the lastName input */}
            <FormInput name="email" control={control} type="email" label="Email" placeholder="Email" error={errors.email} /> {/* Add the email input */}
            <FormInput name="phone" control={control} type="text" label="Phone" placeholder="Phone" error={errors.phone} /> {/* Add the phone input */}
            <FormInput name="address" control={control} type="text" label="Address" placeholder="Street Address" error={errors.address} /> {/* Add the address input */}
            <FormInput name="city" control={control} type="text" label="City" placeholder="City" error={errors.city} />  {/* Add the city input */}
            <FormInput name="state" control={control} type="text" label="State" placeholder="State" error={errors.state} /> {/* Add the state input */}
            <FormInput name="postalCode" control={control} type="text" label="Postal Code" placeholder="Postal Code" error={errors.postalCode} /> {/* Add the postalCode input */}
            <FormInput name="country" control={control} type="text" label="Country" placeholder="Country" error={errors.country} /> {/* Add the country input */}
            {/* Add the horizontal line */}
            <hr />
            {/* Add the submit button */}
            <FormSubmit 
              loading={clientLoading||createLoading||updateLoading||isSubmitting} // Add the loading indicator
              label={clientID ? "Update Client" : "Create New Client"}  // Add the label
              icon={clientID ? <FaUserEdit /> : <FaUserPlus />} // Add the icon
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );

  // Return the Clients component
  return (
    <>
      {/* Add the main container vlock */}
      <Container fluid>
        {/* Add the page title */}
        <Title title={`Clients of ${user.company.companyName}`} />
        {/* Add the helmet vlock */}
        <Helmet>
          {/* Add the page title to the head section */}
          <title>Clients of {user.company.companyName} - Lesson Manager</title>
          {/* Add the page description to the head section */}
          <meta name="description" content="Section for managing you company's clients" />
        </Helmet>
        {/* Render the client table */}
        {clientsLoading ? <p>Loading...</p> : renderClientTable()}
        {/* Render the client modal form */}
        {renderClientModal()}
      </Container>
    </>
  );

}

// Export the Clients component
export default Clients;
  