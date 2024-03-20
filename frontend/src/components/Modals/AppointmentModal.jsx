/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 18/03/2024
This component is used to create and edit appointments. It uses the useForm hook to create a form with validation.
*/

import React, { useEffect, useContext, useState } from 'react'; // Import the useEffect and useState hooks from React
import Modal from 'react-bootstrap/Modal'; // Add Modal component from react-bootstrap
import { joiResolver } from '@hookform/resolvers/joi';  // Import joiResolver for form validation
import { lessonSchema } from '../../validators/lessons'; // Import the lessonSchema
import { useForm } from 'react-hook-form';  // Import the useForm hook
import { StoreContext } from '../../Store'; // Import the StoreContext
import Form from 'react-bootstrap/Form'; // Add Form component from react-bootstrap
import FormInput from '../FormInput'; // Add FormInput component 
import FormTextarea from '../FormTextarea'; // Add FormTextarea component
import FormDateTimePicker from '../FormDateTimePicker'; // Add FormDateTimePicker component
import FormSelect from '../FormSelect'; // Add FormSelect component
import FormSubmit from '../FormSubmit'; // Add FormSubmit component
import { FaCalendarCheck } from 'react-icons/fa'; // Add the FaUserPlus, FaUserEdit and FaUserTimes icons
import { useClients } from '../../hooks/useClients'; // Import the useClients hook
import { useUsers } from '../../hooks/useUsers'; // Import the useUsers hook
import { useSaveLesson } from '../../hooks/useSaveLesson'; // Import the useSaveLesson hook

// Define options for the duration, importance, and mood fields
const durationOptions = [ // Define the duration options
    { label: "30 minutes", value: 30 },
    { label: "60 minutes", value: 60 },
    { label: "90 minutes", value: 90 },
    { label: "120 minutes", value: 120 },
];

const importanceOptions = [ // Define the importance options
    { label: "☆☆☆☆☆ (0)", value: 0 },
    { label: "★☆☆☆☆ (1)", value: 1 },
    { label: "★★☆☆☆ (2)", value: 2 },
    { label: "★★★☆☆ (3)", value: 3 },
    { label: "★★★★☆ (4)", value: 4 },
    { label: "★★★★★ (5)", value: 5 },
];

const moodOptions = [ // Define the mood options
    { label: "Neutral 🙂", value: "neutral" },
    { label: "Happy 😊", value: "happy" },
    { label: "Sad 😔", value: "sad" },
    { label: "Interested 🤔", value: "interested" },
    { label: "Tired 😴", value: "tired" },
    { label: "Frustrated 😤", value: "frustrated" },
    { label: "Angry 😠", value: "angry" },
    { label: "Surprised 😮", value: "surprised" },
    { label: "Confident 😎", value: "confident" },
    { label: "Nervous 😬", value: "nervous" },
    { label: "Indifferent 😐", value: "indifferent" },
];

const typeOptions = [ // Define the lesson type options
    { label: "Lesson", value: "lesson" },
    { label: "Training Session", value: "training" },
    { label: "Meeting", value: "meeting" },
    { label: "Event", value: "event" },
    { label: "Other", value: "other" },
];

// Create the AppointmentModal component
/*
Props:
- showDialog: boolean - show or hide the dialog
- hideDialog: function - trigger to hide the dialog    
- appointment: object - the appointment to add/edit
*/
export default function AppointmentModal({ showDialog, hideDialog, appointment }) {
    const [appointmentID, setAppointmentID] = useState(appointment?._id || "");  // Create the lessonID state
    const {user, setErrorMessage, setConfirmMessage} = useContext(StoreContext); // Destructure the user and setErrorMessage from StoreContext
    const companyId = user?.company._id || ""; // Get the company ID from the user
    const { loading: clientsLoading, clients } = useClients(companyId); // Use the useClients hook to get the clients
    const { loading: usersLoading, users } = useUsers(companyId); // Use the useUsers hook to get the users

    // Define the onSuccess function to call when the save is successful
    const onSuccess = (data, operation) => {
        hideDialog(); // Hide the dialog
        const message = operation === 'create' ? 'New Appointment created successfully' : 'Appointment updated successfully'; // Set the success message
        const title = operation === 'create' ? 'Appointment Create' : 'Appointment Update'; // Set the success title
        setConfirmMessage(title, message); // Show the success message
    };

    // Define the onError function to call when the save fails
    const onError = (error, operation) => {
        const title = operation === 'create' ? 'Appointment Create' : 'Appointment Update'; // Set the error message
        setErrorMessage(title, error.message); // Show the error message
    };

    // Use the useSaveLesson hook to save the lesson
    const { saveLesson, loading } = useSaveLesson(onSuccess, onError);

    // Function to initialize the appointment data
    const initAppointmentData = (appointment) => {
        // Get the start date from the appointment and convert it to a Date object
        const appointmentStart = appointment?.start ? new Date(parseInt(appointment.start)) : new Date();
        // Return the appointment data
        return { 
            lessonName: appointment?.lessonName || "", // Set the lessonName
            description: appointment?.description || "", // Set the description
            client: appointment?.client?._id || "", // Set the client
            user: appointment?.user?._id || user?._id || "", // Set the user
            start: appointmentStart, // Set the start
            duration: appointment?.duration || 60, // Set the duration
            lessonType: appointment?.lessonType || "lesson", // Set the lessonType
            importance: appointment?.importance || 0, // Set the importance
            mood: appointment?.mood || "neutral", // Set the mood
        };
    }

    // Function to update the appointment data
    const updateAppointmentData = async (data) => {
        const newData = initAppointmentData(data); // Initialize the appointment data
        setAppointmentID(appointment?._id || ""); // Set the appointmentID
        reset(newData); // Reset the form with the new data
    }

    // Use the useEffect hook to update the appointment data when the appointment changes
    useEffect(() => {
        // Check if showDialog is true
        if (showDialog) {
            // Update the appointment data
            updateAppointmentData(appointment);
        }
    }, [appointment, showDialog]); // Add appointment and showDialog as dependencies
            

    // Destructure the useForm hook
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: joiResolver(lessonSchema), // Use joi as the resolver and pass the clientSchema
        defaultValues: { // Set default values for the form fields
            lessonName: "", // Set the lessonName
            description: "", // Set the description
            client: "", // Set the client
            user: user?._id, // Set the user
            start: new Date(), // Set the start
            duration: 60, // Set the duration
            lessonType: "lesson", // Set the lessonType
            importance: 0, // Set the importance
            mood: "neutral", // Set the mood
        }
    });

    // Function to handle the save appointment
    const handleSaveAppointment = async (data, event) => {
        // Prevent the default form submission action
        event.preventDefault();
        // Execute the saveLesson function to save the lesson
        saveLesson(data, appointmentID); // Pass the data and the lessonID
    }

    // Check if any data are loading
    if (loading || usersLoading || clientsLoading) return <p>Loading...</p>; // Add a loading indicator
    return (
        <>
            {/* Create the modal */}
            <Modal show={showDialog} onHide={() => hideDialog()}> {/* Add the onHide handler to close the modal */}
                {/* Add the modal header */}
                <Modal.Header closeButton> {/* Add the close button */}
                {/* Add the conditional modal title */}
                    <Modal.Title>{appointmentID ? "Edit Appointment" : "Create New Appointment"}</Modal.Title> {/* Add the title */}
                </Modal.Header>
                {/* Add the modal body */}
                <Modal.Body>
                {/* Create the form */}
                <Form noValidate onSubmit={handleSubmit(handleSaveAppointment)}>
                    {/* Add the form inputs */}
                    <FormDateTimePicker name="start" control={control} label="Start Date and Time" placeholder="Select start date and time" error={errors.start} />
                    <FormSelect name="client" control={control} label="Client" options={clients} placeholder="Select a client" error={errors.client} />
                    <FormSelect name="user" control={control} label="User" options={users} placeholder="Select a user" error={errors.user} />                   
                    <FormInput name="lessonName" control={control} type="text" label="Lesson Name" placeholder="Enter the lesson name" error={errors.lessonName} />
                    <FormSelect name="lessonType" control={control} label="Lesson Type" options={typeOptions} placeholder="Select lesson type" error={errors.lessonType} />
                    <FormTextarea name="description" control={control} label="Description" placeholder="Enter a description" error={errors.description} />
                    <FormSelect name="duration" control={control} label="Duration" options={durationOptions} placeholder="Select duration" error={errors.duration} />
                    <FormSelect name="importance" control={control} label="Importance" options={importanceOptions} placeholder="Select importance level" error={errors.importance} />
                    <FormSelect name="mood" control={control} label="Mood" options={moodOptions} placeholder="Select mood" error={errors.mood} />                        
                    <hr />
                    {/* Add the submit button */}
                    <FormSubmit 
                    loading={isSubmitting} // Add the loading indicator
                    label={appointmentID ? "Update Appointment" : "Create New Appointment"}  // Add the label
                    icon={<FaCalendarCheck />} // Add the icon
                    />
                </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
