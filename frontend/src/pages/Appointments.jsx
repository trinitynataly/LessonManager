/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 14/03/2024
Appointments page
*/
import React, { useState, useContext } from 'react'; // Import the useState and useContext hooks
import { StoreContext } from '../Store'; // Import the StoreContext
import { useQuery, useMutation } from '@apollo/client'; // Import the useQuery and useMutation hooks
import { GET_USER_LESSONS } from '../graphql/lessons/queries'; // Import the GET_LESSONS query
import { DELETE_LESSON } from '../graphql/lessons/mutations'; // Import the CREATE_LESSON, DELETE_LESSON, and UPDATE_LESSON mutations
import Calendar from "../components/Calendar"; // Import the Calendar component
import AppointmentModal from "../components/Modals/AppointmentModal"; // Import the AppointmentModal component
import "./../components/Calendar.scss"; // Import the Calendar component styles

// Format dates as strings in 'YYYY-MM-DD' format
const formatDate = (date) => {
  const year = date.getFullYear(); // Get the year
  const month = date.getMonth() + 1; // Get the month, note that JavaScript months are 0-indexed.
  const day = date.getDate(); // Get the day
  // Pad single digit months and days with leading zeros
  const formattedMonth = month < 10 ? `0${month}` : month.toString(); // Format the month
  const formattedDay = day < 10 ? `0${day}` : day.toString(); // Format the day
  return `${year}-${formattedMonth}-${formattedDay}`; // Return the formatted date
};

// appointments component
function Appointments() {
  const {setErrorMessage, setConfirmMessage} = useContext(StoreContext);  // Get the user from the StoreContext
  const today = new Date(); // Get the current date
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of the current month
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Get the first day of the next month
  const [showDialog, setShowDialog] = useState(false); // Set the showDialog state
  const [appointment, setAppointment] = useState(null); // Set the appointment state
  const [dateRange, setDateRange] = useState({ // Set the dateRange state
    start: formatDate(startOfMonth), // Set the start date to the first day of the current month
    end: formatDate(endOfMonth), // Set the end date to the first day of the next month
   });

  // Use the useQuery hook to get the user's lessons
  const { data, refetch } = useQuery(GET_USER_LESSONS, {
    // Pass the variables to the query: start and end dates
    variables: { start: dateRange.start, end: dateRange.end },
  });

  // Use the useMutation hook to create the DELETE_CLIENT mutation
  const [deleteLesson] = useMutation(DELETE_LESSON, {
    onCompleted: (data) => { // Set the client values on completed
      setConfirmMessage('Appointment Delete', 'Appointment data removed successfully'); // Set the confirm message state on completed
      refetch(); // Refetch the appointments
    },
    onError: (error) => setErrorMessage('Appointment Delete', error.message), // Set the error message state on error
  });

  // Create the handleDeleteClient function
  const handleDeleteLesson = async (lesson) => { // Create the handleDeleteClient function
    if (!window.confirm('Are you sure you want to delete this appointment?')) return; // If the user does not confirm the delete, return
    try {
      // Await the deleteClient mutation
      await deleteLesson({
        variables: { // Pass the variables
          LessonID: lesson._id // Pass the clientID
        }
      });
    } catch (error) { // Handle error here if not using the Apollo's useMutation error
      setErrorMessage('Appointment Delete', error.message);
    }
  }

  // Extract the lessons from the data
  const lessons = data ? data.getUserLessons : [];

  // Create the hideDialog function
  const hideDialog = () => {
    setShowDialog(false); // Set the showDialog state to false
    setAppointment(null); // Set the appointment state to null
    refetch(); // Refetch the appointments
  }

  // Create the showDialogForm function
  const showDialogForm = (appointment) => {
    setAppointment(appointment); // Set the appointment and showDialog states
    setShowDialog(true); // Set the showDialog state to true
  }

  // Create the handleDateRangeChange function
  const handleDateRangeChange = ({ start, end }) => { // Receive the start and end dates
    setDateRange({ start, end }); // Set the dateRange state
    refetch({ start, end }); // Refetch the appointments
  };

  // Return the Appointments component
  return (
    <div className="mb-3">
      {/* Render the Calendar component with the lessons, onDateRangeChange, onEdit, and onDelete props */}
      <Calendar data={lessons} onDateRangeChange={handleDateRangeChange} onEdit={showDialogForm} onDelete={handleDeleteLesson} />
      {/* Render the AppointmentModal component with the showDialog and hideDialog props */}
      <AppointmentModal showDialog={showDialog} hideDialog={hideDialog} appointment={appointment} />
    </div>
  );
}

// Export the Appointments component
export default Appointments;
  