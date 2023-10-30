/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 25/10/2023
Toast Message component
*/

import { useContext } from 'react'; // Import useContext hook
import { StoreContext } from '../Store'; // Import StoreContext
import Toast from 'react-bootstrap/Toast'; // Import Toast component from react-bootstrap
import ToastContainer from 'react-bootstrap/ToastContainer'; // Import ToastContainer component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes

// ToastMessage component
const ToastMessage = ({ toastType }) => { // ToastMessage component style will be set based on the toast type
    // Destructure confirmMessage, hideConfirmMessage, errorMessage, hideErrorMessage from StoreContext
    const { confirmMessage, hideConfirmMessage, errorMessage, hideErrorMessage } = useContext(StoreContext);
    // Set the toast class and toast message based on the toast type
    const toastClass = toastType === 'error' ? 'red-toast' : 'green-toast';
    // Set the toast message based on the toast type
    const toast = toastType === 'error' ? errorMessage : confirmMessage;
    // Set the toast hide function based on the toast type
    const toastHide = toastType === 'error' ? hideErrorMessage : hideConfirmMessage;
    // Return the ToastMessage component
    return (
        <>
            {/* ToastContainer component from react-bootstrap */}
            <ToastContainer position="bottom-start" className="p-3">
                {/* Toast component from react-bootstrap */}
                <Toast show={toast.show} onClose={toastHide} delay={3000} autohide className={toastClass}>
                    {/* Toast.Header component from react-bootstrap */}
                    <Toast.Header>
                        {/* Toast title */}
                        <strong className="me-auto">{toast.title}</strong>
                    </Toast.Header>
                    {/* Toast.Body component from react-bootstrap */}
                    <Toast.Body>{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

// PropTypes for the ToastMessage component
ToastMessage.propTypes = {
    toastType: PropTypes.string.isRequired, // Toast type
};

// Default props for the ToastMessage component
ToastMessage.defaultProps = {
    toastType: 'confirm', // Confirm toast style by default
};

// Export the ToastMessage component
export default ToastMessage;
