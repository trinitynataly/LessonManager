/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Clients Page
*/

import { useEffect, useContext, useState } from 'react'; // Add useEffect and useContext hooks from React
import { useQuery, useMutation } from '@apollo/client'; // Add useQuery and useMutation hooks from Apollo Client
import { useForm } from 'react-hook-form'; // Add useForm hook from react-hook-form
import Container from 'react-bootstrap/Container'; // Add Container component from react-bootstrap
import Row from 'react-bootstrap/Row';  // Add Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Add Col component from react-bootstrap
import Card from 'react-bootstrap/Card'; // Add Card component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import Alert from 'react-bootstrap/Alert'; // Add Alert component from react-bootstrap
import FormInput from '../../components/FormInput'; // Add FormInput component 
import FormSubmit from '../../components/FormSubmit'; // Add FormSubmit component
import Title from '../../components/Title'; // Add Title component
import { StoreContext } from '../../Store'; // Add StoreContext from Store for user state management
import { FaBuilding } from 'react-icons/fa'; // Add FaUserEdit icon from react-icons/fa
import { GET_COMPANY, GET_COMPANIES } from '../../graphql/companies/queries'; // Add GET_COMPANY query
import { UPDATE_COMPANY } from '../../graphql/companies/mutations'; // Add UPDATE_COMPANY mutation
import { joiResolver } from "@hookform/resolvers/joi"; // Add joiResolver from react-hook-form
import { companySchema } from '../../validators/companies'; // Add profileSchema from validators for user update validation
import { Helmet } from 'react-helmet-async'; // Add Helmet component from react-helmet

// Create Company component
function Company() {
  // Get the user, setConfirmMessage and setErrorMessage from the StoreContext
  const { user, setConfirmMessage, setErrorMessage } = useContext(StoreContext); // Get the user from the StoreContext
  // Create the company state
  const [companyID, setCompanyID] = useState(user?user.company._id:'');
  // Create the companies state
  const [companies, setCompanies] = useState([]);
  // Create the company state
  const [company, setCompany] = useState({
    // Set the default values for the company
    companyName: "", // Default companyName is empty
    description: "", // Default description is empty
    address: "", // Default address is empty
    contactEmail: "", // Default contactEmail is empty
    contactPhone: "", // Default contactPhone is empty
  }); // Create the company state

  // initiate the GET_COMPANIES query and get the data, loading and refetch properties
  const { loading: companyLoading, refetch: refetchCompanies } = useQuery(GET_COMPANIES, {
    skip: user.level < 2, // Skip this query if the user level is less than 2
    onCompleted: (data) => setCompanies(data.getAllCompanies), // Set the companies state on completed
    onError: (error) => setErrorMessage('Data Load', error.message), // Set the error message on error
  });
  
  // initiate the GET_COMPANY query and get the data, loading and refetch properties
  const { loading: companyGetLoading } = useQuery(GET_COMPANY, {
    // Pass the user id as a variable
    variables: {
      // Get the user id from the user object
      companyID: companyID,
    },
    // Set the onCompleted and onError properties
    onCompleted: (data) => setCompany(data.getCompany),
    // Set the error message on error
    onError: (error) => setErrorMessage('Data Load', error.message),
  });

  // initiate the UPDATE_COMPANY mutation and get the update and loading properties
  const [update, { loading: companyUpdateLoading }] = useMutation(UPDATE_COMPANY, {
    // Set the onCompleted and onError properties
    onCompleted: (data) => { // Set the onCompleted property
      setConfirmMessage('Company Update', 'Company profile updated successfully'); // Set confirmation message state
      refetchCompanies(); // Refetch the companies
    },
    // Set the error message on error
    onError: (error) => setErrorMessage('Company Update', error.message),
  });

  // Destructure the handleSubmit function and errors object from the useForm hook
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    // Set the resolver to the updateSchema
    resolver: joiResolver(companySchema),
    // Set the default values for the form fields
    defaultValues: company
  });

  // Create the handleCompanyChange function to set the companyID state when the company dropdown changes
  const handleCompanyChange = (event) => {
    setCompanyID(event.target.value);
  };

  // Create the onSubmit function
  const onSubmit = async (data, event) => {
    // Prevent the default form submit event
    event.preventDefault();
    // Destructure the email, first_name and last_name from the data object
    const { companyName, description, address, contactEmail, contactPhone } = data;
    // Try catch block for updating the user
    try {
      // Await the update mutation
      await update({
        // Pass the variables
        variables: {
          // Get the user id from the user object
          companyID: companyID,
          // Pass the user input
          CompanyInput: {
            companyName, // Pass the companyName
            description, // Pass the description
            address, // Pass the address
            contactEmail, // Pass the contactEmail
            contactPhone, // Pass the contactPhone 
          }
        }
      });
    // Catch any errors
    } catch (error) {
      // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Company Update', error.message); // Show the error message toast
    }
  };
  
  // Use the useEffect hook to set the form values when the data changes
  useEffect(() => {
    // Check if the data and data.getUser exist
    if (company) {
      // Set the form values
      setValue('companyName', company.companyName); // Set the companyName
      setValue('description', company.description||""); // Set the description
      setValue('address', company.address||""); // Set the address
      setValue('contactEmail', company.contactEmail||""); // Set the contactEmail
      setValue('contactPhone', company.contactPhone||""); // Set the contactPhone
    }
  }, [company, setValue]); // Add the company and setValue as dependencies

  // Create the renderCompanyDropdown function to render the company dropdown
  const renderCompanyDropdown = () => {
    // Check if the user level is 2 and the companies exist
    if (user.level === 2 && companies) {
      // Return the company dropdown
      return (
        <>
          {/* Create the company dropdown */  }
          <Form.Select 
            value={companyID}  // Set the value to the companyID state
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

  // Check if the user level is 0
  if (user && user.level <= 0) {
    // Show the error message if the user level is 0
    return (
      <Container>
        <Alert variant="danger">You do not have permission to view this page.</Alert>
      </Container>
    );
  }

  // Check if the userGetLoading is true
  if (companyLoading||companyGetLoading) return <p>Loading...</p>; // If the userGetLoading is true, show the loading message
  
  // Return the Profile component
  return (
    <Container fluid>
      {/* Add the helmet vlock */}
      <Helmet>
        {/* Add the page title to the head section */}
        <title>Update Company Details - Settings - Lesson Manager</title>
        {/* Add the page description to the head section */}
        <meta name="description" content="Section for managing your company details" />
      </Helmet>
      {/* Show the block title */}
      <Title title="Edit Your Company" filter={renderCompanyDropdown()} />
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
                {/* Create the form inputs */}
                <FormInput name="companyName" control={control} type="text" label="Company Name" placeholder="Company Name" error={errors.companyName} /> {/* Add the companyName input */}
                <FormInput name="description" control={control} type="text" label="Description" placeholder="Description" error={errors.description} /> {/* Add the description input */}
                <FormInput name="address" control={control} type="text" label="Address" placeholder="Address" error={errors.address} /> {/* Add the address input */}
                <FormInput name="contactEmail" control={control} type="text" label="Contact Email" placeholder="Contact Email" error={errors.contactEmail} /> {/* Add the contactEmail input */}
                <FormInput name="contactPhone" control={control} type="text" label="Contact Phone" placeholder="Contact Phone" error={errors.contactPhone} /> {/* Add the contactPhone input */}
                {/* Create the form submit button */}   
                <FormSubmit loading={companyUpdateLoading} label="Update Company Profile" icon={<FaBuilding />} />
              </Form>  
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    );
}

// Export the Company component
export default Company;
  