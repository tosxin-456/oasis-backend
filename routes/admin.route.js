// routes/adminRoutes.js
const express = require("express");
const { loginAdmin, registerAdmin, getAdmin } = require("../controllers/admin.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Only needed once — disable after initial setup
router.post("/register", registerAdmin);

// Login route
router.post("/login", loginAdmin);

router.get("/me", protect, getAdmin);


module.exports = router;
