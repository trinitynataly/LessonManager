/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 18/03/2024
Unit tests for AppointmentModal component
*/

import { describe, it, expect, vi } from 'vitest'; // Import the describe, it, expect, and vi functions from vitest
import { render, screen, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react'; // Import render, screen, fireEvent, waitForElementToBeRemoved, and waitFor functions from @testing-library/react
import { StoreContext } from '../../../Store'; // Import StoreContext from Store
import AppointmentModal from '../AppointmentModal'; // Import AppointmentModal component
import { MockedProvider } from '@apollo/client/testing'; // Import MockedProvider from @apollo/client/testing
import { GET_USERS } from '../../../graphql/users/queries'; // Import GET_USERS query
import { GET_CLIENTS } from '../../../graphql/clients/queries'; // Import GET_CLIENTS query
import { CREATE_LESSON } from '../../../graphql/lessons/mutations'; // Import CREATE_LESSON mutation

// Mock data for users and clients queries
const mocks = [
    {
        // Mock the GET_USERS query
        request: {
            query: GET_USERS,
            variables: { companyID: 'company-id' },
        },
        result: {
            data: {
                getAllUsers: [
                    { _id: 'user1', first_name: 'John', last_name: 'Doe', email: 'john@gmail.com', level: 1, status: 1 },
                    { _id: 'user2', first_name: 'Peter', last_name: 'Doe', email: 'peter@gmail.com', level: 1, status: 1 },

                ],
            },
        },
    },
    {
        // Mock the GET_CLIENTS query
        request: {
            query: GET_CLIENTS,
            variables: { companyID: 'company-id' },
        },
        result: {
            data: {
                getAllClients: [
                    { _id: 'client1', firstName: 'Jane', lastName: 'Doe', email: 'jame@gmail.com', phone: '1234567890', address: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'Australia', company: { _id: 'company-id', companyName: 'Company Name' } },
                    { _id: 'client2', firstName: 'Alice', lastName: 'Doe', email: 'alice@gmail.com', phone: '1234567890', address: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'Australia', company: { _id: 'company-id', companyName: 'Company Name' } },
                ],
            },
        },
    },
    {
        // Mock the CREATE_LESSON mutation
        request: {
            query: CREATE_LESSON,
            variables: {
                lesson: {
                    lessonName: "Test Lesson",
                    description: "Test Description",
                    client: "client1",
                    user: "user1",
                    start: "2024-03-30T04:00:00.000Z",
                    duration: 60,
                    lessonType: "lesson",
                    importance: 3,
                    mood: "happy"
                }
            },
        },
        result: {
            data: {
                createLesson: {
                    _id: 'anyLessonId',
                    lessonName: "Test Lesson",
                    description: "Test Description",
                    client: {
                        _id: "client1",
                        firstName: "Client",
                        lastName: "One",
                        email: "client@example.com",
                        phone: "1234567890",
                        address: "123 Client St",
                        city: "Client City",
                        state: "CS",
                        postalCode: "12345",
                        country: "Client Country",
                        __typename: "Client"
                    },
                    user: {
                        _id: "user1",
                        email: "user@example.com",
                        first_name: "User",
                        last_name: "One",
                        __typename: "User"
                    },
                    start: "2024-03-30T04:00:00.000Z",
                    duration: 60,
                    lessonType: "lesson",
                    importance: 3,
                    mood: "happy",
                    __typename: "Lesson"
                }
            }
        }
    },
];

// Mock StoreContext values to provide the required context values
const mockContextValue = {
    user: { _id: 'user-id', company: { _id: 'company-id' } }, // Mock user object
    setErrorMessage: vi.fn(), // Mock setErrorMessage function
    setConfirmMessage: vi.fn(), // Mock setConfirmMessage function
    hideDialog: vi.fn(), // Mock hideDialog function
};

// Define the test suite for the AppointmentModal component
describe('AppointmentModal Component', () => {
    // Define the test for rendering the component correctly
    it('renders correctly with required elements', async () => {
        // Render the component with MockedProvider and StoreContext
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <StoreContext.Provider value={mockContextValue}>
                    <AppointmentModal showDialog={true} hideDialog={mockContextValue.hideDialog} appointment={{}} />
                </StoreContext.Provider>
            </MockedProvider>
        );

        // Use findByRole which is asynchronous
        const dialog = await screen.findByRole('dialog');
        // Check if the dialog is rendered
        expect(dialog).toBeInTheDocument();
        // Check if the dialog is visible
        expect(screen.getByRole('button', { name: /Create New Appointment/i })).toBeInTheDocument();
        // Ensure all form fields are rendered
        expect(await screen.findByPlaceholderText(/Select start date and time/i)).toBeInTheDocument(); // Use findByPlaceholderText as DateTimePicker does not have a proper label\
        expect(await screen.findByLabelText(/Client/i)).toBeInTheDocument(); // Use findByLabelText for all other form fields
        expect(await screen.findByLabelText(/User/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Lesson Name/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Lesson Type/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Description/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Duration/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Importance/i)).toBeInTheDocument();
        expect(await screen.findByLabelText(/Mood/i)).toBeInTheDocument();
        // Check for the presence of option elements
        expect(await screen.findByText(/30 minutes/i)).toBeInTheDocument();
        expect(await screen.findByText(/60 minutes/i)).toBeInTheDocument();
        expect(await screen.findByText(/90 minutes/i)).toBeInTheDocument();
        expect(await screen.findByText(/120 minutes/i)).toBeInTheDocument();
        expect(await screen.findByText(/☆☆☆☆☆ \(0\)/i)).toBeInTheDocument();
        expect(await screen.findByText(/★★★★★ \(5\)/i)).toBeInTheDocument();
        expect(await screen.findByText(/Neutral 🙂/i)).toBeInTheDocument();
        expect(await screen.findByText(/Happy 😊/i)).toBeInTheDocument();
        // All required elements are rendered - test passed
    });

    // Define the test for closing the dialog when the close button is clicked
    it('closes the dialog when the close button is clicked', async () => {

        // Render the component with MockedProvider and StoreContext
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <StoreContext.Provider value={mockContextValue}>
                    <AppointmentModal showDialog={true} hideDialog={mockContextValue.hideDialog} appointment={{}} />
                </StoreContext.Provider>
            </MockedProvider>
        );

        // Wait for the close button to be present and clickable
        const closeButton = await screen.findByRole('button', { name: /close/i });
        // Simulate a user clicking the close button
        fireEvent.click(closeButton);
        // Check if hideDialog was called
        await waitFor(() => expect(mockContextValue.hideDialog).toHaveBeenCalled());
        // hideDialog was called - test passed
    });

    // Define the test for displaying validation errors and not submitting with incomplete form
    it('displays validation errors and does not submit with incomplete form', async () => {
        // Render the component with MockedProvider and StoreContext
        render(
            <MockedProvider mocks={mocks}>
                <StoreContext.Provider value={mockContextValue}>
                    <AppointmentModal showDialog={true} hideDialog={mockContextValue.hideDialog} appointment={{}} />
                </StoreContext.Provider>
            </MockedProvider>
        );

        // Attempt to submit the form without filling required fields
        const submitButton = await screen.findByRole('button', { name: /Create New Appointment/i });
        // Simulate a user clicking the submit button
        fireEvent.click(submitButton);
        // Check if the validation errors are displayed
        expect(await screen.findByText(/Lesson Name is required/i)).toBeInTheDocument();
        // All validation errors are displayed - test passed
    });

    // Define the test for submitting the form successfully when all fields are filled in correctly
    it('submits the form successfully when all fields are filled in correctly', async () => {
        // Render the component with MockedProvider and StoreContext
        render(
            <MockedProvider mocks={mocks}>
                <StoreContext.Provider value={mockContextValue}>
                    <AppointmentModal showDialog={true} hideDialog={mockContextValue.hideDialog} appointment={{}} />
                </StoreContext.Provider>
            </MockedProvider>
        );
    
        // Wait for the loading spinner to be removed
        await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));
        // Fill in the form fields with valid data
        fireEvent.change(screen.getByPlaceholderText(/Select start date and time/i), { target: { value: new Date('2024-03-30T15:00').toISOString() }});
        fireEvent.change(screen.getByLabelText(/Lesson Name/i), { target: { value: 'Test Lesson' }});
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' }});
        fireEvent.change(screen.getByLabelText(/Client/i), { target: { value: 'client1' }});
        fireEvent.change(screen.getByLabelText(/User/i), { target: { value: 'user1' }});
        fireEvent.change(screen.getByLabelText(/Lesson Type/i), { target: { value: 'lesson' }});
        fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: 60 }});
        fireEvent.change(screen.getByLabelText(/Importance/i), { target: { value: 3 }});
        fireEvent.change(screen.getByLabelText(/Mood/i), { target: { value: 'happy' }});
            // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Create New Appointment/i }));
        // Check if hideDialog function was called indicating the form was submitted successfully
        await waitFor(() => expect(mockContextValue.hideDialog).toHaveBeenCalled());
        // hideDialog was called - test passed
    });    
});


