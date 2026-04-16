import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const AppNavbar = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/welcome';
  };

  // Natively hide navbar on welcome screen to allow hero banner to breathe
  if (!token || location.pathname === '/welcome') return null;

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 fixed-top z-index-1000">
      <Container>
        <Navbar.Brand as={Link} to={user.role === 'ADMIN' ? '/' : '/profile'} className="fw-bold text-primary d-flex align-items-center gap-2">
          <div style={{ width: '30px', height: '30px', backgroundColor: '#0d6efd', borderRadius: '8px' }} />
          GymManager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-1">
            {user.role === 'ADMIN' && (
              <>
                <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active bg-light rounded' : ''}>Overview</Nav.Link>
                <Nav.Link as={Link} to="/members" className={location.pathname === '/members' ? 'active bg-light rounded' : ''}>Members</Nav.Link>
                <Nav.Link as={Link} to="/payments" className={location.pathname === '/payments' ? 'active bg-light rounded' : ''}>Payments</Nav.Link>
                <Nav.Link as={Link} to="/email" className={location.pathname === '/email' ? 'active bg-light rounded' : ''}>Broadcasts</Nav.Link>
              </>
            )}
            {user.role === 'MEMBER' && (
              <Nav.Link as={Link} to="/profile" className={location.pathname === '/profile' ? 'active bg-light rounded' : ''}>My Profile</Nav.Link>
            )}
          </Nav>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-lg-block">
              <span className="d-block fw-bold" style={{ fontSize: '0.9rem', lineHeight: '1' }}>{user.name}</span>
              <Badge bg={user.role === 'ADMIN' ? 'danger' : 'secondary'} style={{ fontSize: '0.65rem' }}>{user.role}</Badge>
            </div>
            <Button variant="outline-dark" size="sm" onClick={handleLogout} className="rounded-pill px-4 fw-bold">Sign Out</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
