/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 09/03/2024
Calendar Component
*/
import React, { useEffect, useState } from 'react'; // Import the useEffect and useState hooks from React
import FullCalendar from '@fullcalendar/react' // Import the FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid' // Import the dayGridPlugin
import timeGridPlugin from '@fullcalendar/timegrid' // Import the timeGridPlugin
import interactionPlugin from '@fullcalendar/interaction'; // Import the interactionPlugin
import { Button } from 'react-bootstrap'; // Import the Button component from React Bootstrap
import { FaPen, FaTimes } from 'react-icons/fa'; // Import the FaPen and FaTimes components from React Icons
import './Calendar.scss'; // Import the Calendar component styles

// appointments component
function Calendar({data, onDateRangeChange, onEdit, onDelete}) {
  // Define the events state variable and the setEvents function
  const [events, setEvents] = useState([]);

  // Define the renderEventContent function to render the event component
  function renderEventContent(eventInfo) {
    // Extract the importance, mood, client, lessonType, lesson, and user from the eventInfo
    const { importance, mood, client, lessonType, lesson, user } = eventInfo.event.extendedProps;
    const lessonTypeCapitalized = lessonType.charAt(0).toUpperCase() + lessonType.slice(1); // Capitalize the first letter of the lesson type
    const stars = '⭐️'.repeat(importance); // Creates a string of stars based on importance
    const moodIcons = { // Map mood to corresponding icon
        happy: '😊',
        sad: '😢',
        interested: '🤔',
        tired: '😴',
        frustrated: '😤',
        angry: '😡',
        surprised: '😲',
        confident: '😎',
        nervous: '😬',
        indifferent: '😐',
        neutral: '😑'
    };
  
    // Define the editLesson function to edit the lesson when the edit button is clicked
    const editLesson = () => {
      // Trigger the onEdit function with the lesson as the argument
      onEdit(lesson);
    }
  
    // Define the deleteLesson function to delete the lesson when the delete button is clicked
    const deleteLesson = () => {
      // Trigger the onDelete function with the lesson as the argument
      onDelete(lesson);
    }

    // Return the event component
    return (
        <div className="event-content">
            {/* Render the event content */}
            <span className="event-score">
              {/* Render the stars and mood */}
              {stars??<span>{stars}</span>}
              <span>{moodIcons[mood] || ''}</span>
            </span>
            {/* Render the event info */}
            <span className="event-info">
              {/* Render the time, client, and title */}
            <b>{eventInfo.timeText}</b>&nbsp;-&nbsp;
              <span>{client}&nbsp;-&nbsp;</span>
              <span>{eventInfo.event.title}</span>
            </span>
            {/* Render the expanded event that is visible on mouse over */}
            <div className="event-info-full">
              {/* Render the event toolbar */}
              <div className="event-toolbar">
                {/* Render the edit button and link it to editLesson function defined above */}
                <Button onClick={editLesson} className="edit-btn" variant="outline-primary" size="sm" title="Edit Appointment"><FaPen/></Button>
                {/* Render the delete button and link it to deleteLesson function defined above */}
                <Button onClick={deleteLesson} className="delete-btn" variant="outline-danger" size="sm" title="Delete Appointment"><FaTimes/></Button>
              </div>
              {/* Render the event details */}
              <div className="event-time-info"><strong>{eventInfo.timeText}</strong></div>
              <div className="event-title">{eventInfo.event.title} ({lessonTypeCapitalized})</div>
              <div className="event-rating">Rating: {stars || "None"} | Mood: {moodIcons[mood] || ''} | Duration {lesson.duration} min.</div>
              <div className="event-description">{lesson.description}</div>
              <div className="event-client">Client: {client}</div>
              <div className="event-attendee">Attendee: {user}</div>
            </div>
        </div>
    );
  }

  // Use the useEffect hook to update the events when the data changes
  useEffect(() => {
    // If data is not null
    if (data) {
        // Map the data to events
        const events = data.map((lesson) => {
            // Create start date&time object from the lesson start date
            const startDate = new Date(parseInt(lesson.start));
            // Create end date&time from the lesson start date plus the lesson duration
            const endDate = new Date(startDate.getTime() + lesson.duration * 60000); // duration in minutes multiplied by 60000 to convert to milliseconds
            // Return the event object
            return {
                title: lesson.lessonName, // Set the title to the lesson name
                start: startDate.toISOString(), // Set the start date&time to the lesson start date
                end: endDate.toISOString(), // Set the end date&time to the lesson end date
                extendedProps: { // Set the extended properties
                    client: `${lesson.client.firstName} ${lesson.client.lastName}`, // Set the client to the client's full name
                    user: `${lesson.user.first_name} ${lesson.user.last_name}`, // Set the user to the user's full name
                    importance: lesson.importance, // Set the importance to the lesson importance
                    mood: lesson.mood, // Set the mood to the lesson mood
                    lessonType: lesson.lessonType, // Set the lesson type to the lesson type
                    description: lesson.description, // Set the description to the lesson description
                    lesson: lesson // Store the lesson object for editing and deleting
                },
                classNames: [`fc-event-type-${lesson.lessonType}`] // Add class based on the lesson type
            };
        });
        // Set the events state variable to the events
        setEvents(events);
    } else {
        // If data is null, set the events to an empty array
        setEvents([]);
    }
}, [data]); // Re-run the effect when the data changes


  return (
    <div className="myCustomHeight">
      {/* Render the FullCalendar component */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Add the dayGridPlugin, timeGridPlugin, and interactionPlugin
        initialView='dayGridMonth' // Set the initial view to dayGridMonth
        headerToolbar={{ // Define the header toolbar
          left: 'prev,next today', // Add buttons for prev, next, and today in the left
          center: 'title', // Add the title in the center
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // Add buttons for week and day views in the right
        }}
        weekends={true} // Show weekends
        events={events} // Set the events to the events state variable
        height={"auto"} // Set the height to auto
        eventContent={renderEventContent} // Set the eventContent to the renderEventContent function
        datesSet={(dateInfo) => { // Add the datesSet event listener
          // Triggered whenever the date range displayed by the calendar changes
          const start = dateInfo.startStr; // The start of the range the calendar has just rendered
          const end = dateInfo.endStr; // The end of the range the calendar has just rendered
          onDateRangeChange({ start, end }); // Notify the parent component of the date range change
        }}
        eventTimeFormat={ // Set the eventTimeFormat
          {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: true,
            hour12: true
          }
        }
        dateClick={(arg) => { // Triggered when a date is clicked
          // Create a lesson object with the start date&time
          const lesson = {
            'start': arg.date.getTime(),
          } 
          // Trigger the onEdit function with the lesson as the argument
          onEdit(lesson);
        }}
      />
    </div>
  );
}

// Export the Appointments component
export default Calendar;
  