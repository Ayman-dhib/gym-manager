const express = require('express');
const { sendEmailToMember } = require('../controllers/email.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN')); // Only admin can broadcast emails

router.post('/send', sendEmailToMember);

module.exports = router;
