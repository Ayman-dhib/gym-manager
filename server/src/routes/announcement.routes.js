const express = require('express');
const { getAnnouncements, createAnnouncement } = require('../controllers/announcement.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
router.get('/', authorizeRoles('ADMIN', 'MEMBER'), getAnnouncements);
router.post('/', authorizeRoles('ADMIN'), createAnnouncement);

module.exports = router;
