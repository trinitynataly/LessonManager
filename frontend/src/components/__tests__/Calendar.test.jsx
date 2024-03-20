/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 20/03/2024
Unit tests for Calendar component
*/

// Essential imports from Testing Library and Vitest for rendering and testing React components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StoreContext } from '../../Store'; // Import your custom StoreContext for context state management
import { describe, it, expect, vi } from 'vitest'; // Import testing utilities from Vitest
import Calendar from '../Calendar';  // Import the Calendar component you are testing
import '@testing-library/jest-dom'; // Import custom matchers for Testing Library to use with Jest

// Prepare mock data to be used in the tests, simulating real calendar events
const mockData = [
  {
    lessonName: "Test Lesson",
    start: new Date().getTime(), // Current timestamp
    duration: 60, // Event duration in minutes
    client: { firstName: "John", lastName: "Doe" }, // Client info
    user: { first_name: "Jane", last_name: "Doe" }, // User info
    importance: 3, // Arbitrary importance rating
    mood: "happy", // Mood associated with the event
    lessonType: "event", // Type of the lesson
    description: "Test Description" // Event description
  }
  // Additional mock events can be added here
];

// Mock context values to simulate global state or props passed through context
const mockContextValue = {
  onDateRangeChange: vi.fn(), // Mock function for date range change
  onEdit: vi.fn(), // Mock function for editing events
  onDelete: vi.fn(), // Mock function for deleting events
};

// Start of the test suite for the Calendar component
describe('Calendar Component', () => {
  // Individual test for rendering with event data
  it('renders correctly with provided events data', async () => {
    render(
      // Provide mock context and data to the Calendar component
      <StoreContext.Provider value={mockContextValue}>
        <Calendar
          data={mockData}
          onDateRangeChange={mockContextValue.onDateRangeChange}
          onEdit={mockContextValue.onEdit}
          onDelete={mockContextValue.onDelete}
        />
      </StoreContext.Provider>
    );

    // Basic checks to ensure calendar days (Sunday and Saturday) are rendered
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();

    // Wait for the asynchronous elements to appear, checking for rendered event details
    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
      expect(screen.getByText(/Rating:/i)).toBeInTheDocument(); // Check for dynamic content based on importance
      expect(screen.getByText(/John Doe -/i)).toBeInTheDocument(); // Check for client info rendering
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument(); // Check for user info rendering
    });
    
    // Confirm the presence and properties of the edit button
    const editButton = screen.getByRole('button', { name: 'Edit Appointment' });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass('edit-btn');

    // Confirm the presence and properties of the delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete Appointment' });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass('delete-btn');
  });

  // Test for the behavior when changing date ranges, such as navigating months
  it('triggers onDateRangeChange when date range changes', async () => {
    render(
      // Provide mock context and data to the Calendar component
      <StoreContext.Provider value={mockContextValue}>
        <Calendar
          data={mockData}
          onDateRangeChange={mockContextValue.onDateRangeChange}
          onEdit={mockContextValue.onEdit}
          onDelete={mockContextValue.onDelete}
        />
      </StoreContext.Provider>
    );
    fireEvent.click(screen.getByTitle('Next month')); // Simulate clicking 'Next month' to change the calendar's date range
    await waitFor(() => expect(mockContextValue.onDateRangeChange).toHaveBeenCalled()); // Check that the mock function was called as a result
  });

  // Test for editing functionality when an event (e.g., appointment) is clicked
  it('calls onEdit when an event is clicked for editing', async () => {
    render(
      // Provide mock context and data to the Calendar component
      <StoreContext.Provider value={mockContextValue}>
        <Calendar
          data={mockData}
          onDateRangeChange={mockContextValue.onDateRangeChange}
          onEdit={mockContextValue.onEdit}
          onDelete={mockContextValue.onDelete}
        />
      </StoreContext.Provider>
    );
    fireEvent.click(screen.getByTitle('Edit Appointment')); // Simulate clicking an event to edit
    await waitFor(() => expect(mockContextValue.onEdit).toHaveBeenCalled()); // Check that the edit callback was triggered
  });

  // Test for deletion functionality when a delete action is triggered on an event
  it('calls onDelete when an event is clicked for deletion', async () => {
    render(

      <StoreContext.Provider value={mockContextValue}>
        <Calendar
          data={mockData}
          onDateRangeChange={mockContextValue.onDateRangeChange}
          onEdit={mockContextValue.onEdit}
          onDelete={mockContextValue.onDelete}
        />
      </StoreContext.Provider>
    );
    fireEvent.click(screen.getByTitle('Delete Appointment')); // Simulate clicking the delete button for an event
    await waitFor(() => expect(mockContextValue.onDelete).toHaveBeenCalled()); // Check that the delete callback was triggered
  });
});