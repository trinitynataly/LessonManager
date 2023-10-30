/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/10/2023
Main layout
*/

import { Container } from 'react-bootstrap'; // Import Container component from react-bootstrap
import { Outlet } from 'react-router-dom'; // Import Outlet component from react-router-dom
import SidebarMenu from '../../components/SidebarMenu'; // Import SidebarMenu component
import Header from '../../components/Header'; // Import Header component
import Footer from '../../components/Footer'; // Import Footer component
import './style.scss'; // Importing a CSS file for styling

// MainLayout component
const MainLayout = () => {
  return (
    <>
      {/* Create main flex div */ }
      <div style={{ display: "flex", height: "100vh" }}>
        {/* SidebarMenu component */}
        <SidebarMenu />
        {/* Create full-width container */}
        <Container fluid className="d-flex flex-column min-vh-100 page">
          {/* Header component */}
          <Header />
          {/* Create main flex div */}
          <main className="flex-grow-1 pt-3 bp-3">
            {/* Outlet child component */}
            <Outlet />
          </main>
          {/* Footer component */}
          <Footer />
        </Container>
      </div>
    </>
  );
};

// Export the MainLayout component
export default MainLayout;
