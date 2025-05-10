const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rtracer697@gmail.com", // Replace with your Gmail
    pass: "qiyo onnr ynvc eyau", // App password
  },
});

const sendPasswordSetupEmail = async (email, token) => {
  const resetLink = `http://localhost:3000/set-password/${token}`;

  const mailOptions = {
    from: "rtracer697@gmail.com", // Replace with your Gmail
    to: email,
    subject: "Set Up Your Password - RailTracer",
    html: `
      <h1>Welcome to RailTracer!</h1>
      <p>Your account has been created. Please click the link below to set up your password:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Set Up Password</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = {
  sendPasswordSetupEmail,
};
