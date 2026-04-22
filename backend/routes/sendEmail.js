const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // إيميلك في ملف .env
      pass: process.env.EMAIL_PASS, // الـ App Password في ملف .env
    },
  });

  const mailOptions = {
    from: `"Meal-Kit Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, 
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;