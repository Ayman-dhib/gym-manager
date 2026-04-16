const express = require('express');
const { getMyProfile } = require('../controllers/profile.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
// Accessible by both ADMIN and MEMBER
router.use(authorizeRoles('ADMIN', 'MEMBER'));

router.get('/me', getMyProfile);

module.exports = router;
