require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
// We will add more routes here
// const memberRoutes = require('./src/routes/member.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', require('./src/routes/member.routes'));
app.use('/api/payments', require('./src/routes/payment.routes'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes'));
app.use('/api/profile', require('./src/routes/profile.routes'));
app.use('/api/email', require('./src/routes/email.routes'));
app.use('/api/announcements', require('./src/routes/announcement.routes'));
app.use('/api/attendance', require('./src/routes/attendance.routes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
