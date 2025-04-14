const express = require("express");
const router = express.Router();
const { sendMail } = require("../utils/sendMail");

const USERS = {
  "uzrpax": { password: "alo2025", email: "ghiatabdelali12345@gmail.com" },
};
let generatedOTP = null;

// GET /
router.get("/", (req, res) => {
  res.render("home", { title: "Home" }); // Pass the title
});

// GET /register
router.get("/register", (req, res) => {
  res.render("register", { title: "Register" }); // Pass the title
});

// POST /register
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (USERS[username]) {
    return res.send("User already exists.");
  }

  USERS[username] = { password, email };
  res.send('Registered successfully. <a href="/login">Login</a>');
});

// GET /login
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" }); // Pass the title
});

// POST /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let user = USERS[username];

  if (user && user.password === password) {
    generatedOTP = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

    try {
      await sendMail(
        user.email,
        "Your OTP Code",
        `Your OTP is: ${generatedOTP}`
      );
      console.log(`OTP sent to ${user.email}: ${generatedOTP}`);
    } catch (error) {
      console.error("Error sending email:", error);
      return res.send("Failed to send OTP. Please try again.");
    }

    req.session.user = username; // Store the logged-in user in the session
    res.cookie("username", username); // Store username in a cookie
    res.redirect("/login2"); // Redirect to the OTP verification page
  } else {
    res.send("Invalid credentials.");
  }
});

// GET /login2
router.get("/login2", (req, res) => {
  const username = req.cookies.username;
  //if(username !== req.session.user){// Check if the cookie matches the session
   // return res.redirect("/login"); // Redirect to login if they don't match
  //}
  if (!username) return res.redirect("/login");
  res.render("login2", { username, title: "Verify OTP" }); // Pass the username and title
});

// POST /login2
router.post("/login2", (req, res) => {
  const { otp } = req.body;
  const username = req.cookies.username;

  if (otp === generatedOTP) {
    req.session.user = username; // Store the user in the session
    res.redirect("/dashboard");
  } else {
    res.status(401).send("Invalid OTP.");
  }
});

// GET /dashboard
router.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { title: "Dashboard", user: req.session.user }); // Pass the title and user
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.send("Error logging out. Please try again.");
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.redirect("/"); // Redirect to the home page
  });
});

module.exports = router;
