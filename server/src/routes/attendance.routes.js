const express = require('express');
const { checkIn, getMyAttendance } = require('../controllers/attendance.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
router.post('/', authorizeRoles('ADMIN', 'MEMBER'), checkIn);
router.get('/me', authorizeRoles('MEMBER', 'ADMIN'), getMyAttendance);

module.exports = router;
