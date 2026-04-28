const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Meal-Kit Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Nodemailer Error: ", error.message);
    } else {
      console.log("✅ Email sent successfully: " + info.response);
    }
  });
};

module.exports = sendEmail;