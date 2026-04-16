import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Pagination, Card, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiList, FiClock } from 'react-icons/fi';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ userId: '', amount: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, memRes] = await Promise.all([
        api.get('/payments'),
        api.get('/members')
      ]);
      setPayments(payRes.data);
      setMembers(memRes.data);
    } catch (err) {
      toast.error('Failed to load records from the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/payments', formData);
      toast.success('Payment recorded successfully! Membership extended +30 Days.');
      setShow(false);
      setFormData({ userId: '', amount: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing payment');
    } finally {
      setActionLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container style={{ paddingTop: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Financial Ledgers</h2>
            <p className="text-muted mb-0">Record physical payments and extrapolate memberships dynamically.</p>
          </div>
          <Button variant="success" size="lg" className="d-flex align-items-center gap-2 rounded-pill shadow-sm" onClick={() => setShow(true)}>
            <FiPlusCircle size={20}/> Log Payment
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
            <Card.Header className="bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiList className="text-muted" /> <span className="fw-bold text-muted text-uppercase" style={{ fontSize: '0.85rem' }}>Transaction History</span>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0 text-center align-middle">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="text-start ps-4">Member Name</th>
                    <th>Email Address</th>
                    <th>Date Collected</th>
                    <th>Amount Due</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(p => (
                    <tr key={p.id}>
                      <td className="text-start ps-4 fw-bold">{p.user?.name}</td>
                      <td className="text-muted">{p.user?.email}</td>
                      <td className="text-muted"><FiClock className="me-2" />{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="fw-bold text-dark fs-5">${parseFloat(p.amount).toFixed(2)}</td>
                      <td><Badge bg="success" className="px-3 py-2 rounded-pill">PAID</Badge></td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">No financial records exist in the ledger.</td></tr>}
                </tbody>
              </Table>
            </Card.Body>
            {totalPages > 1 && (
              <Card.Footer className="bg-white d-flex justify-content-center py-3 border-top-0">
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
            <Modal.Title className="fw-bold">Log New Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pb-4">
            <p className="text-muted small mb-4">Registering this payment will automatically grant the user 30 extra days of membership access.</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Member Account</Form.Label>
                <Form.Select className="bg-light" value={formData.userId} required onChange={e => setFormData({...formData, userId: e.target.value})}>
                  <option value="">-- Choose Account --</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Amount Rendered (USD)</Form.Label>
                <Form.Control className="bg-light fs-5" value={formData.amount} type="number" step="0.01" required placeholder="0.00" onChange={e => setFormData({...formData, amount: e.target.value})} />
              </Form.Group>
              <div className="d-grid mt-4">
                <Button variant="primary" type="submit" size="lg" className="rounded-8" disabled={actionLoading}>
                  {actionLoading ? <Spinner size="sm" animation="border" /> : 'Confirm & Extend Plan'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default Payments;
