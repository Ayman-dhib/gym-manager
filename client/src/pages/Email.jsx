import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiSend, FiMail } from 'react-icons/fi';
import api from '../services/api';

const Email = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ userId: '', subject: '', message: '' });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get('/members');
        setMembers(data);
      } catch (err) {
        toast.error('Failed to load user list');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/email/send', form);
      toast.success('Email successfully dispatched!');
      setForm({ ...form, subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'SMTP Engine Error');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow border-0 rounded-xl">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <FiMail className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="fw-bold mb-0">Dispatch Email</h4>
                  <p className="text-muted mb-0 small">Send manual HTML broadcasts directly through the SMTP relay.</p>
                </div>
              </Card.Header>
              <Card.Body className="p-4 mt-2">
                {loading ? (
                  <div className="text-center py-5"><Spinner animation="border" /></div>
                ) : (
                  <Form onSubmit={handleSend}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Select Target Member</Form.Label>
                      <Form.Select 
                        required 
                        value={form.userId} 
                        onChange={e => setForm({...form, userId: e.target.value})}
                        className="bg-light"
                      >
                        <option value="">-- Click to choose user --</option>
                        {members.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Email Subject</Form.Label>
                      <Form.Control 
                        required 
                        value={form.subject} 
                        maxLength={100}
                        onChange={e => setForm({...form, subject: e.target.value})} 
                        placeholder="e.g. Action Required: Membership Expiry"
                        className="bg-light"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Detailed Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={6} 
                        required 
                        value={form.message} 
                        onChange={e => setForm({...form, message: e.target.value})} 
                        placeholder="Compose your message here..."
                        className="bg-light"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button variant="primary" type="submit" size="lg" className="px-5 d-flex align-items-center gap-2" disabled={sending}>
                        {sending ? <Spinner size="sm" animation="border" /> : <><FiSend /> Send Message</>}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Email;
