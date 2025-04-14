const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

let transporter;

console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

async function initializeTransporter() {
  transporter = nodemailer.createTransport({
    // Fix: Use nodemailer.createTransport
    service: "gmail", // Use Gmail's SMTP server
    auth: {
      user: process.env.GMAIL_USER, // Replace with your Gmail address
      pass: process.env.GMAIL_PASS, // Replace with your Gmail app password
    },
  });
}

async function sendMail(to, subject, text) {
  if (!transporter) {
    await initializeTransporter();
  }

  const mail = await transporter.sendMail({
    from: `"2FA App" <${process.env.GMAIL_USER}>`, // Replace with your Gmail address
    to,
    subject,
    text,
  });

  console.log(`Email sent to ${to}: ${text}`);
}

module.exports = { sendMail };
