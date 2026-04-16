const { sendCustomEmail } = require('../services/email.service');
const prisma = require('../utils/db');

const sendEmailToMember = async (req, res) => {
  const { userId, subject, message } = req.body;
  if (!userId || !subject || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendCustomEmail(user.email, subject, message);
    
    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: 'Email Sent',
        details: `Dispatched manual email to ${user.name}`
      }
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending email', error: error.message });
  }
};

module.exports = { sendEmailToMember };
