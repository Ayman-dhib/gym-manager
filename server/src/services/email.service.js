const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"GymManager Pro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

const sendCustomEmail = async (to, subject, message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">${subject}</h2>
      <p>${message}</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>The Gym Team</strong></p>
    </div>
  `;
  await sendEmail(to, subject, html);
};

const sendWelcomeEmail = async (userEmail, userName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Welcome to the Gym Management System, ${userName}!</h2>
      <p>We are thrilled to have you on board. You can now log into your account and manage your gym profile.</p>
      <p>Stay fit, stay healthy!</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>The Gym Team</strong></p>
    </div>
  `;
  await sendEmail(userEmail, 'Welcome to the Gym!', html);
};

const sendPaymentConfirmation = async (userEmail, amount) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333;">Payment Received</h2>
      <p>Thank you for your payment of <strong>$${amount}</strong>.</p>
      <p>Your transaction has been successfully processed.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>The Gym Team</strong></p>
    </div>
  `;
  await sendEmail(userEmail, 'Payment Confirmation', html);
};

const sendExpirationWarning = async (userEmail, endDate) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #ff4c4c;">Subscription Expiring Soon!</h2>
      <p>Your gym membership is scheduled to expire on <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
      <p>Please renew your membership to continue enjoying our facilities without interruption.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>The Gym Team</strong></p>
    </div>
  `;
  await sendEmail(userEmail, 'Action Required: Subscription Expiring Soon', html);
};

module.exports = {
  sendWelcomeEmail,
  sendPaymentConfirmation,
  sendExpirationWarning,
  sendCustomEmail
};
