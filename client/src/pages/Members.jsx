import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Modal, Form, Spinner, InputGroup, Pagination, Card, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiMail, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import api from '../services/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal State
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Email Modal State
  const [showEmail, setShowEmail] = useState(false);
  const [emailData, setEmailData] = useState({ userId: null, subject: '', message: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', planType: 'Monthly', startDate: '', endDate: ''
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/members');
      setMembers(data);
    } catch (err) {
      toast.error('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setFormData({ name: '', email: '', planType: 'Monthly', startDate: '', endDate: '' });
    setShow(true);
  };

  const openEditModal = (member) => {
    setEditMode(true);
    setCurrentId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      planType: member.membership?.planType || 'Monthly',
      startDate: member.membership?.startDate ? new Date(member.membership.startDate).toISOString().split('T')[0] : '',
      endDate: member.membership?.endDate ? new Date(member.membership.endDate).toISOString().split('T')[0] : ''
    });
    setShow(true);
  };

  const openEmailModal = (member) => {
    setEmailData({ userId: member.id, subject: '', message: '' });
    setShowEmail(true);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      await api.post('/email/send', emailData);
      toast.success(`Broadcase securely sent.`);
      setShowEmail(false);
    } catch (error) {
      toast.error('Failed to send email. Check SMTP relays.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editMode) {
        await api.put(`/members/${currentId}`, formData);
        toast.success('Member updated successfully');
      } else {
        await api.post('/members', formData);
        toast.success('Member provisioned successfully');
      }
      setShow(false);
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member? Access tracking will be halted.')) {
      try {
        await api.delete(`/members/${id}`);
        toast.success('Member soft-deleted securely');
        fetchMembers();
      } catch (err) {
        toast.error('Error modifying member object');
      }
    }
  };

  // Search & Status Filter
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || (m.membership?.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Container style={{ paddingTop: '30px' }}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Members Base</h2>
            <p className="text-muted mb-0">Administer plans, configure access, and review member pipelines.</p>
          </div>
          <Button variant="primary" size="lg" className="rounded-pill px-4 shadow-sm d-flex align-items-center gap-2" onClick={openAddModal}>
            <FiPlus /> Register Member
          </Button>
        </div>

        <Card className="shadow-sm border-0 rounded-xl mb-4">
          <Card.Body className="p-3">
            <div className="d-flex gap-3 align-items-center">
              <InputGroup className="w-50 shadow-sm rounded-lg overflow-hidden">
                <InputGroup.Text className="bg-white border-end-0 text-muted"><FiSearch /></InputGroup.Text>
                <Form.Control
                  className="border-start-0 ps-0 bg-white"
                  style={{ boxShadow: 'none' }}
                  placeholder="Query member names or email handles..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </InputGroup>

              <InputGroup className="w-25 shadow-sm rounded-lg overflow-hidden">
                <InputGroup.Text className="bg-white border-end-0 text-muted"><FiFilter /></InputGroup.Text>
                <Form.Select
                  className="border-start-0 ps-0 bg-white"
                  style={{ boxShadow: 'none', cursor: 'pointer' }}
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">All Accounts</option>
                  <option value="ACTIVE">Active Users</option>
                  <option value="EXPIRED">Expired Users</option>
                  <option value="PENDING">Pending Setup</option>
                </Form.Select>
              </InputGroup>
            </div>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="text-center py-5 my-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
            <Card.Header className="bg-white border-bottom py-3">
              <div className="d-flex align-items-center gap-2 text-muted fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>
                <FiUsers /> System Directory
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0 text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-start ps-4">Member Name</th>
                    <th>Email Address</th>
                    <th>Assigned Plan</th>
                    <th>Lifecycle State</th>
                    <th>Operation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(m => (
                    <tr key={m.id}>
                      <td className="text-start ps-4 fw-bold text-dark">{m.name}</td>
                      <td className="text-muted">{m.email}</td>
                      <td>
                        <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill">
                          {m.membership?.planType || 'None Assigned'}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={m.membership?.status === 'ACTIVE' ? 'success' : m.membership?.status === 'EXPIRED' ? 'danger' : 'secondary'}
                          className="px-3 py-2 rounded-pill"
                        >
                          {m.membership?.status || 'NO PLAN'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="light" size="sm" className="text-primary rounded-circle p-2 shadow-sm" title="Email User" onClick={() => openEmailModal(m)}><FiMail /></Button>
                          <Button variant="light" size="sm" className="text-warning rounded-circle p-2 shadow-sm" title="Edit Profile" onClick={() => openEditModal(m)}><FiEdit2 /></Button>
                          <Button variant="light" size="sm" className="text-danger rounded-circle p-2 shadow-sm" title="Terminate" onClick={() => handleDelete(m.id)}><FiTrash2 /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">No member accounts matching database criteria.</td></tr>}
                </tbody>
              </Table>
            </Card.Body>
            {totalPages > 1 && (
              <Card.Footer className="bg-white border-top-0 py-3 d-flex justify-content-center">
                <Pagination className="mb-0">
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Card.Footer>
            )}
          </Card>
        )}

        <Modal show={show} onHide={() => !actionLoading && setShow(false)} centered>
          <Modal.Header closeButton={!actionLoading} className="border-0 pb-0">
            <Modal.Title className="fw-bold">{editMode ? 'Modify Member Profile' : 'Provision User Account'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pb-4">
            <p className="text-muted small mb-4">Complete the fields below to apply structural changes to this member's logical assignment block.</p>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3 g-3">
                <Col md={12}>
                  <Form.Label className="fw-bold small">Full Name</Form.Label>
                  <Form.Control className="bg-light" value={formData.name} required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </Col>
                <Col md={12}>
                  <Form.Label className="fw-bold small">Email Identity</Form.Label>
                  <Form.Control className="bg-light" value={formData.email} type="email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </Col>
              </Row>
              <Row className="mb-4 g-3">
                <Col md={4}>
                  <Form.Label className="fw-bold small">Plan Strategy</Form.Label>
                  <Form.Select className="bg-light" value={formData.planType} onChange={e => setFormData({ ...formData, planType: e.target.value })}>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label className="fw-bold small">Activation</Form.Label>
                  <Form.Control className="bg-light" value={formData.startDate} type="date" required onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </Col>
                <Col md={4}>
                  <Form.Label className="fw-bold small">Deprecation</Form.Label>
                  <Form.Control className="bg-light" value={formData.endDate} type="date" required onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" animation="border" /> : (editMode ? 'Apply Database Write' : 'Generate Instance')}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Email Modal */}
        <Modal show={showEmail} onHide={() => !sendingEmail && setShowEmail(false)} centered>
          <Modal.Header closeButton={!sendingEmail} className="border-0 pb-0">
            <Modal.Title className="fw-bold text-primary">Targeted Direct Mail</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pb-4">
            <Form onSubmit={handleSendEmail}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Email Subject Line</Form.Label>
                <Form.Control className="bg-light" required value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} placeholder="e.g., Immediate Server Action Required" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small">Rich Text Base</Form.Label>
                <Form.Control className="bg-light" as="textarea" rows={5} required value={emailData.message} onChange={e => setEmailData({ ...emailData, message: e.target.value })} />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100 fw-bold py-2" disabled={sendingEmail}>
                {sendingEmail ? <Spinner size="sm" animation="border" /> : 'Dispatch Relay'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default Members;
