const prisma = require('../utils/db');
const { sendExpirationWarning } = require('../services/email.service');
const bcrypt = require('bcrypt');

// Get all members (users with role MEMBER) along with their membership details
const getAllMembers = async (req, res) => {
  try {
    const members = await prisma.user.findMany({
      where: { role: 'MEMBER', isDeleted: false },
      include: { membership: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving members' });
  }
};

// Add a new member
const addMember = async (req, res) => {
  try {
    const { name, email, password, planType, startDate, endDate } = req.body;
    
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || 'defaultPassword123', 10);

    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'MEMBER'
        }
      });

      const newMembership = await prisma.membership.create({
        data: {
          userId: newUser.id,
          planType,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: 'ACTIVE'
        }
      });

      await prisma.activityLog.create({
        data: {
          action: 'Member Created',
          details: `New member registered: ${name} with ${planType} plan.`
        }
      });

      return { ...newUser, membership: newMembership };
    });

    res.status(201).json({ message: 'Member added successfully', member: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding member' });
  }
};

// Update member details
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, planType, startDate, endDate, status } = req.body;

    // Update user and membership
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    if (planType || startDate || endDate || status) {
      await prisma.membership.update({
        where: { userId: id },
        data: {
          planType: planType || undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          status: status || undefined
        }
      });
    }

    const memberData = await prisma.user.findUnique({ where: { id }, include: { membership: true } });

    res.status(200).json({ message: 'Member updated successfully', member: memberData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating member' });
  }
};

// Delete member (Soft Delete)
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({ 
      where: { id },
      data: { isDeleted: true }
    });

    await prisma.activityLog.create({
      data: {
        action: 'Member Removed',
        details: `Member soft-deleted: ${user.name}`
      }
    });

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting member' });
  }
};

module.exports = {
  getAllMembers,
  addMember,
  updateMember,
  deleteMember
};
