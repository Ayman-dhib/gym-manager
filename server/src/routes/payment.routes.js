const express = require('express');
const { getPayments, processPayment } = require('../controllers/payment.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

router.get('/', getPayments);
router.post('/', processPayment);

module.exports = router;
