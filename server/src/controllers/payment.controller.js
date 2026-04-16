const prisma = require('../utils/db');
const { sendPaymentConfirmation } = require('../services/email.service');

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { paymentDate: 'desc' }
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving payments' });
  }
};

const processPayment = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        status: 'PAID',
        paymentDate: new Date()
      },
      include: { user: true }
    });

    let membership = await prisma.membership.findUnique({ where: { userId } });
    
    const now = new Date();
    const extraTime = 30 * 24 * 60 * 60 * 1000; // +30 Days

    if (membership) {
      // Extend timeline
      const currentEnd = new Date(membership.endDate);
      const newEnd = currentEnd > now ? new Date(currentEnd.getTime() + extraTime) : new Date(now.getTime() + extraTime);
      
      await prisma.membership.update({
        where: { id: membership.id },
        data: { 
          endDate: newEnd,
          status: 'ACTIVE' 
        }
      });
    } else {
      // Create new Basic 30-day plan implicitly if absent during payment
      await prisma.membership.create({
        data: {
          userId,
          planType: 'Basic',
          startDate: now,
          endDate: new Date(now.getTime() + extraTime),
          status: 'ACTIVE'
        }
      });
    }

    await prisma.activityLog.create({
      data: {
        action: 'Payment Generated',
        details: `Payment of $${amount} collected from ${payment.user.name}. Membership extended 30 days.`
      }
    });

    await sendPaymentConfirmation(payment.user.email, payment.amount);

    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

module.exports = {
  getPayments,
  processPayment
};
