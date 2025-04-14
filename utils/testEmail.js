const { sendMail } = require("./sendMail"); // Correct path to sendMail.js

(async () => {
  try {
    await sendMail(
      "elhadi.cpp@gmail.com",
      "Test Email",
      "This is a test email. from 2FA App by miller",
    );
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
})();
