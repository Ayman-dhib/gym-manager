import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Row, Col, Badge, Button, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiAlertCircle, FiAward } from 'react-icons/fi';
import api from '../services/api';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchProfileData = async () => {
    try {
      const [profileRes, announcementsRes] = await Promise.all([
        api.get('/profile/me'),
        api.get('/announcements')
      ]);
      setProfile(profileRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (err) {
      toast.error('Error hydrating your dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await api.post('/attendance');
      toast.success('Successfully Authenticated into the facility!');
      fetchProfileData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access Denied');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  if (!profile) return null;

  let daysRemaining = 0;
  let progressPercentage = 0;
  if (profile.membership && profile.membership.status === 'ACTIVE') {
    const end = new Date(profile.membership.endDate);
    const start = new Date(profile.membership.startDate);
    const now = new Date();
    
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    progressPercentage = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Container style={{ paddingTop: '30px' }}>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
              Welcome aboard, {profile.name.split(' ')[0]} <FiAward className="text-warning" />
            </h2>
            <p className="text-muted mb-0">Control your access levels and review authenticated logs.</p>
          </div>
          <Button 
            variant={profile.membership?.status === 'ACTIVE' ? 'primary' : 'secondary'} 
            size="lg" 
            disabled={checkingIn || profile.membership?.status !== 'ACTIVE'}
            onClick={handleCheckIn}
            className="shadow-sm px-4 rounded-pill fw-bold d-flex align-items-center gap-2"
          >
            {checkingIn ? <Spinner size="sm" animation="border" /> : <><FiCheckCircle /> Validate Entry</>}
          </Button>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-4 rounded-xl overflow-hidden">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="fw-bold mb-0">Subscription Physics</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {profile.membership ? (
                  <>
                    <Row className="mb-4 g-4 text-center text-md-start">
                      <Col xs={6} md={4}>
                        <p className="text-muted mb-1 small fw-bold text-uppercase">Current Health</p>
                        <h5>
                          <Badge bg={profile.membership.status === 'ACTIVE' ? 'success' : 'danger'} className="px-3 py-2 rounded-8">
                            {profile.membership.status}
                          </Badge>
                        </h5>
                      </Col>
                      <Col xs={6} md={4}>
                        <p className="text-muted mb-1 small fw-bold text-uppercase">Tier Assignment</p>
                        <h5 className="fw-bold text-dark">{profile.membership.planType} Access</h5>
                      </Col>
                      <Col xs={12} md={4}>
                        <p className="text-muted mb-1 small fw-bold text-uppercase">Timeline Integrity</p>
                        <h4 className={`fw-bold mb-0 ${daysRemaining < 5 ? 'text-danger' : 'text-primary'}`}>
                          {daysRemaining} <span className="fs-6 text-muted fw-normal">Days Active</span>
                        </h4>
                      </Col>
                    </Row>
                    
                    <div className="bg-light p-4 rounded-8">
                      <div className="mb-3 d-flex justify-content-between small fw-bold text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>
                        <span>Provisioned: {new Date(profile.membership.startDate).toLocaleDateString()}</span>
                        <span>Expiration: {new Date(profile.membership.endDate).toLocaleDateString()}</span>
                      </div>
                      <ProgressBar 
                        variant={daysRemaining < 5 ? 'danger' : 'primary'} 
                        now={progressPercentage} 
                        style={{ height: '8px', borderRadius: '4px' }} 
                        className="bg-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-5 bg-light rounded-lg">
                    <FiAlertCircle size={40} className="text-muted mb-3" />
                    <h5 className="fw-bold text-dark">No Active Plan Discovered</h5>
                    <p className="text-muted mb-0 small">Please associate a legacy payment or secure an administrator to provision access.</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 rounded-xl">
              <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4 d-flex align-items-center gap-2">
                <FiClock className="text-muted" /> <h5 className="fw-bold mb-0">Financial Logs</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {profile.payments && profile.payments.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {profile.payments.map((p, index) => (
                      <li key={p.id} className={`list-group-item px-4 py-3 border-0 ${index !== profile.payments.length - 1 ? 'border-bottom border-light' : ''} d-flex justify-content-between align-items-center`}>
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">Subscription Credit Extrapolated</h6>
                          <small className="text-muted">{new Date(p.paymentDate).toLocaleDateString()}</small>
                        </div>
                        <strong className="text-success fs-5 bg-success bg-opacity-10 px-3 py-1 rounded-8">${parseFloat(p.amount).toFixed(2)}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center p-5 text-muted small">No verified payment matrices currently resolve to this account.</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 bg-primary text-white h-100 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
              <Card.Header className="border-bottom-0 pt-4 pb-2 bg-transparent px-4">
                <h5 className="fw-bold mb-0">Global Memos</h5>
                <p className="small text-white-50 mt-1 mb-0">Broadcasts distributed globally via administration relays.</p>
              </Card.Header>
              <Card.Body className="px-4 pb-4">
                {announcements.length > 0 ? (
                  <div className="d-flex flex-column gap-3 mt-3">
                    {announcements.map(ann => (
                      <div key={ann.id} className="bg-white text-dark rounded-8 p-3 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold mb-0 text-primary">{ann.title}</h6>
                          {ann.priority === 'HIGH' && <Badge bg="danger" className="rounded-pill">CRITICAL</Badge>}
                        </div>
                        <p className="small mb-2 text-muted lh-sm">{ann.content}</p>
                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                          Released: {new Date(ann.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center mt-5 text-white-50 p-4 border border-white border-opacity-25 rounded-lg">
                    <FiAlertCircle size={30} className="mb-2" />
                    <p className="mb-0 small">No active announcements propagating across the network currently.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default MyProfile;
