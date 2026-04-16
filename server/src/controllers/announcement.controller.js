const prisma = require('../utils/db');

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving announcements' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const announcement = await prisma.announcement.create({
      data: { title, content, priority: priority || 'NORMAL' }
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement' });
  }
};

module.exports = { getAnnouncements, createAnnouncement };
