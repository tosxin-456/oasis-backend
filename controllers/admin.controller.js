// controllers/adminController.js
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secretkey", {
        expiresIn: "7d",
    });
};

// Register admin (for setup)
const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const exists = await Admin.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const admin = await Admin.create({ username, password });
        res.status(201).json({
            message: "Admin created successfully",
            admin: { id: admin._id, username: admin.username },
        });
    } catch (err) {
        console.log(err)
        console.error(err);
        res.status(500).json({ message: "Error creating admin" });
    }
};

// Login admin
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (admin && (await admin.matchPassword(password))) {
            const token = generateToken(admin._id);
            res.json({
                message: "Login successful",
                token,
                admin: { id: admin._id, username: admin.username },
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
    }
};

// Get admin profile
const getAdmin = async (req, res) => {
    try {
        // The `req.admin` comes from the JWT middleware (you’ll see that below)
        const admin = await Admin.findById(req.admin.id).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            message: "Admin fetched successfully",
            admin,
        });
    } catch (err) {
        console.error("Error fetching admin:", err);
        res.status(500).json({ message: "Failed to fetch admin" });
    }
};


module.exports = {
    registerAdmin,
    loginAdmin,
    getAdmin
};
