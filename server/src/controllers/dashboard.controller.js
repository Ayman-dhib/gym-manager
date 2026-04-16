const prisma = require('../utils/db');

const getDashboardStats = async (req, res) => {
  try {
    // Advanced Feature: Auto-expire logic inline when pulling stats
    await prisma.membership.updateMany({
      where: { 
        status: 'ACTIVE',
        endDate: { lt: new Date() }
      },
      data: { status: 'EXPIRED' }
    });

    const totalMembers = await prisma.user.count({ where: { role: 'MEMBER' } });
    
    const activeSubscriptions = await prisma.membership.count({
      where: { status: 'ACTIVE' }
    });

    const expiredSubscriptions = await prisma.membership.count({
      where: { status: 'EXPIRED' }
    });

    // Revenue: simple sum of all payments
    const payments = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' }
    });

    const revenue = payments._sum.amount || 0;

    const recentActivity = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8
    });

    res.status(200).json({
      totalMembers,
      activeSubscriptions,
      expiredSubscriptions,
      revenue,
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { getDashboardStats };
