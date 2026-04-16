const express = require('express');
const { getAllMembers, addMember, updateMember, deleteMember } = require('../controllers/member.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authenticateToken);
// Protect all underlying member modifying methods
router.use(authorizeRoles('ADMIN'));

router.get('/', getAllMembers);
router.post('/', addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
