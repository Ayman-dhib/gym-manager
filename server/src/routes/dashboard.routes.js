const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

router.get('/stats', getDashboardStats);

module.exports = router;
