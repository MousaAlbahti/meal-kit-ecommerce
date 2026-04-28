const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'Meal-Kit Support 🥗 <no-reply@mealkit.com>', 
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Email Error: ", error.message);
    } else {
      console.log("✅ Email Success: " + info.response);
    }
  });
};

module.exports = sendEmail;