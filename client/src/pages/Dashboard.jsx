import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { FiUsers, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiPlusCircle, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    revenue: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: ['Active', 'Expired', 'Total Members'],
    datasets: [{
      label: 'Membership Analytics',
      data: [stats.activeSubscriptions, stats.expiredSubscriptions, stats.totalMembers],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(59, 130, 246, 0.8)'],
      borderWidth: 0,
      borderRadius: 4
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { family: "'Poppins', sans-serif" } } },
    },
    scales: {
      y: { grid: { display: true, color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container style={{ paddingTop: '30px' }}>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-1">Overview Dashboard</h2>
            <p className="text-muted mb-0">Track memberships, revenue, and system health.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="primary" as={Link} to="/members" className="d-flex align-items-center gap-2"><FiPlusCircle /> Add Member</Button>
            <Button variant="outline-dark" as={Link} to="/email" className="d-flex align-items-center gap-2"><FiMail /> Blast Email</Button>
          </div>
        </div>

        <Row className="mb-4 g-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100 card-hover rounded-xl">
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="text-muted mb-1 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Total Members</p>
                  <h3 className="fw-bold mb-0">{stats.totalMembers}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <FiUsers size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100 card-hover rounded-xl">
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="text-muted mb-1 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Active Subs</p>
                  <h3 className="fw-bold mb-0 text-success">{stats.activeSubscriptions}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                  <FiCheckCircle size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100 card-hover rounded-xl">
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="text-muted mb-1 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Expired Subs</p>
                  <h3 className="fw-bold mb-0 text-danger">{stats.expiredSubscriptions}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                  <FiAlertTriangle size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100 card-hover rounded-xl">
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="text-muted mb-1 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>YTD Revenue</p>
                  <h3 className="fw-bold mb-0 text-dark">${parseFloat(stats.revenue).toFixed(2)}</h3>
                </div>
                <div className="bg-warning bg-opacity-25 p-3 rounded-circle text-warning">
                  <FiDollarSign size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={8}>
            <Card className="shadow-sm border-0 rounded-xl p-4 h-100">
              <h5 className="fw-bold mb-4">Membership Composition</h5>
              <div style={{ height: '300px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0 h-100 rounded-xl">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="fw-bold mb-0">Recent Activity Feed</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ul className="list-group list-group-flush px-2">
                  {stats.recentActivity && stats.recentActivity.map((activity, idx) => (
                    <li key={activity.id} className={`list-group-item px-3 py-3 border-0 ${idx !== stats.recentActivity.length -1 ? 'border-bottom border-light' : ''}`}>
                      <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>{activity.action}</span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(activity.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>{activity.details}</p>
                    </li>
                  ))}
                  {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                    <div className="text-center p-5 text-muted">No recent events logged.</div>
                  )}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
