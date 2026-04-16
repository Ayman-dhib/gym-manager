import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCreditCard, FiActivity, FiMail } from 'react-icons/fi';

const Welcome = () => {
  const token = localStorage.getItem('token');
  
  // Natively block users trying to hit Welcome while authenticated
  if (token) return <Navigate to="/" />;

  const features = [
    { title: "Member Management", text: "Effortlessly track member lifecycles, plans, and detailed profiles.", icon: <FiUsers size={32} className="text-primary" /> },
    { title: "Subscription Engine", text: "Automated tracking handles membership expirations dynamically.", icon: <FiActivity size={32} className="text-success" /> },
    { title: "Seamless Payments", text: "Auto-extend memberships when logging real-world payments instantly.", icon: <FiCreditCard size={32} className="text-warning" /> },
    { title: "Email Automations", text: "Dispatch manual and automated HTML emails directly through SMTP.", icon: <FiMail size={32} className="text-danger" /> }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Minimalist */}
      <nav className="p-4 d-flex justify-content-between align-items-center shadow-sm bg-white fixed-top">
        <h4 className="fw-bold text-primary mb-0 mx-4">GymManager Pro</h4>
        <div className="mx-4">
          <Button variant="outline-primary" as={Link} to="/login" className="me-2">Sign In</Button>
          <Button variant="primary" as={Link} to="/login">Register</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow-1 d-flex align-items-center bg-light" style={{ marginTop: '80px', padding: '100px 0' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="display-3 fw-bold mb-3">Manage your gym <span className="text-primary">smarter</span></h1>
                <p className="lead text-muted mb-5 px-md-5">The complete SaaS solution to track your members, handle resilient payments asynchronously, and automatically evaluate retention pipelines natively.</p>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="primary" size="lg" as={Link} to="/login" className="px-5 shadow border-0 rounded-pill py-3">Get Started</Button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Feature Section */}
      <div className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Everything you need</h2>
            <p className="text-muted">A powerful stack for administrators and members alike.</p>
          </div>
          <Row className="g-4">
            {features.map((item, idx) => (
              <Col md={6} lg={3} key={idx}>
                <motion.div whileHover={{ translateY: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="h-100 border-0 bg-light p-3 text-center rounded-xl shadow-sm card-hover">
                    <Card.Body>
                      <div className="mb-4 d-inline-block p-3 bg-white shadow-sm rounded-circle">{item.icon}</div>
                      <Card.Title className="fw-bold">{item.title}</Card.Title>
                      <Card.Text className="text-muted">{item.text}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Role Explanation */}
      <div className="py-5 bg-primary text-white text-center">
        <Container>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4 mb-md-0">
              <h3 className="fw-bold">Admins</h3>
              <p>Orchestrate global gym functions, modify internal parameters, dispatch mass mails and govern user bases dynamically.</p>
            </Col>
            <Col md={2} className="d-flex justify-content-center align-items-center">
              <div style={{ height: '100%', width: '2px', backgroundColor: 'rgba(255,255,255,0.3)' }} className="d-none d-md-block"></div>
            </Col>
            <Col md={5}>
              <h3 className="fw-bold">Members</h3>
              <p>Experience an isolated portal determining Days Remaining, generating authenticated Check-Ins, and viewing valid receipts natively.</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <small>&copy; {new Date().getFullYear()} GymManager Pro. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default Welcome;
