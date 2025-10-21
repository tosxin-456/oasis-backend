const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const movieRoutes = require("./routes/movie.route");
const adminRoutes = require("./routes/admin.route");
const movieOfWeekRoutes = require("./routes/movieOfWeek.route");



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5144;

// ✅ CORS Middleware
app.use(cors());

// Middleware
app.use(express.json());

// Serve static React build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Routes
app.use("/api", movieRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movie_of_week", movieOfWeekRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));
