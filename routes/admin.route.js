// routes/adminRoutes.js
const express = require("express");
const { loginAdmin, registerAdmin } = require("../controllers/admin.controller");

const router = express.Router();

// Only needed once — disable after initial setup
router.post("/register", registerAdmin);

// Login route
router.post("/login", loginAdmin);

module.exports = router;
