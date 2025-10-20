const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "secretkey"
            );

            req.admin = await Admin.findById(decoded.id).select("_id username");
            next();
        } catch (err) {
            console.error("Auth error:", err);
            res.status(401).json({ message: "Not authorized, invalid token" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
