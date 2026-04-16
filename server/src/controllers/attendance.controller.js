const prisma = require('../utils/db');

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if membership is ACTIVE
    const membership = await prisma.membership.findUnique({ where: { userId } });
    if (!membership || membership.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Active membership required to check in.' });
    }

    // Prevent double check-ins dynamically (e.g. within 12 hours)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const recentCheckIn = await prisma.attendance.findFirst({
      where: { userId, checkIn: { gte: twelveHoursAgo } }
    });

    if (recentCheckIn) {
      return res.status(400).json({ message: 'You have already checked in recently.' });
    }

    const attendance = await prisma.attendance.create({ data: { userId } });
    res.status(201).json({ message: 'Successfully checked in!', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error processing check-in' });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      orderBy: { checkIn: 'desc' },
      take: 20
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendance' });
  }
};

module.exports = { checkIn, getMyAttendance };
