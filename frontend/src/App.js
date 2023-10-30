/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 30/10/2023
Frontend application main component.
*/

import { useContext } from 'react'; // import the useContext hook from React
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // import router components from React Router
import MainLayout from './layouts/Main'; // import the MainLayout component
import LoginLayout from './layouts/Login'; // import the LoginLayout component
import ErrorLayout from './layouts/Error'; // import the ErrorLayout component
import Home from './pages/Home'; // import the Home Page component
import Appointments from './pages/Appointments'; // import the Appointments Page component
import Clients from './pages/Clients'; // import the Clients Page component
import Profile from './pages/settings/Profile'; // import the Settings Page component
import Security from './pages/settings/Security'; // import the Settings Page component
import Company from './pages/settings/Company'; // import the Settings Page component
import Users from './pages/settings/Users'; // import the Settings Page component
import Login from './pages/auth/Login'; // import the Login Page component
import Register from './pages/auth/Register'; // import the Register Page component
import Error404 from './pages/error/Error404'; // import the Error404 Page component
import Error500 from './pages/error/Error500'; // import the Error500 Page component
import { StoreContext } from './Store'; // Import the StoreContext component for data storage
import { client } from './apolloClient'; // Import the Apollo Client instance
import { ApolloProvider } from '@apollo/client'; // Import the Apollo Provider component
import ToastMessage from './components/ToastMessage'; // Import the ToastMessage component
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import the Helmet and HelmetProvider components
import './App.scss'; // Import the App CSS file

// Define the App function
function App() {
  function ProtectedRoute({ component: Component, ...rest }) { // Destructure the component and user props
    const { user } = useContext(StoreContext); // Get the user from the StoreContext
    // If user is not logged in, redirect to the login page
    if (!user) { // If user is not logged in
      return <Navigate to="/login" replace />; // Redirect to the login page
    }
    return <Component {...rest} />; // Render the protected component
  }

  const helmetContext = {}; // Define the helmetContext object

  return (
    <>
      {/* Define the HelmetProvider component to set the page title */}
      <HelmetProvider context={helmetContext}>
        {/* Define the Helmet component */}
        <Helmet>
          {/* Set the page title and description */ }
          <title>Lesson Manager</title>
          <meta name="description" content="Lesson Manager project is a system to mange your lessons and clients" />
        </Helmet>
        {/* Define the ApolloProvider component to provide the Apollo Client instance to the app */}
        <ApolloProvider client={client}>
          {/* Define the BrowserRouter component to provide the router to the app */}
          <BrowserRouter>
            {/* Define the Routes component to define the routes */}         
            <Routes>
              {/* Load main layout */}
              <Route path="/" element={<MainLayout />}>
                {/* Load home page */}
                <Route index element={<ProtectedRoute component={Home} />} />
                {/* Load appointments page */}
                <Route path="appointments" element={<ProtectedRoute component={Appointments} />} />
                {/* Load clients page */}
                <Route path="clients" element={<ProtectedRoute component={Clients} />} />
                {/* Settings URL should reditect to profile */}
                <Route path="settings" element={<Navigate to="/settings/profile" />} />
                {/* Load settings profile page */}
                <Route path="settings/profile" element={<ProtectedRoute component={Profile} />} />
                {/* Load settings security page */}
                <Route path="settings/security" element={<ProtectedRoute component={Security} />} />
                {/* Load settings users page */}
                <Route path="settings/users" element={<ProtectedRoute component={Users} />} />
                {/* Load settings company page */}
                <Route path="settings/company" element={<ProtectedRoute component={Company} />} />
              </Route>
              {/* Load login layout */}
              <Route path="/login" element={<LoginLayout />}>
                {/* Load login page */}
                <Route index element={<Login />} />
              </Route>
              {/* Load login layout */}
              <Route path="/register" element={<LoginLayout />}>
                {/* Load login page */}
                <Route index element={<Register />} />
              </Route>
              {/* Load error layout */}
              <Route path="/500" element={<ErrorLayout/>}>
                {/* Load error 500 page */}
                <Route index element={<Error500 />} />
              </Route>
              {/* Load error layout */}
              <Route path="*" element={<ErrorLayout />}>
                {/* Load error 404 page */}
                <Route path="*" element={<Error404 />} />
              </Route>
            </Routes>
          </BrowserRouter>
          {/* Define the ToastMessage component to display confirm messages */}
          <ToastMessage toastType="confirm" />
          {/* Define the ToastMessage component to display error messages */}
          <ToastMessage toastType="error" />
        </ApolloProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
