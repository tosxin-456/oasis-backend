const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const movieRoutes = require("./routes/movie.route");
const adminRoutes = require("./routes/admin.route");
const movieOfWeekRoutes = require("./routes/movieOfWeek.route");
const { fetchMovieDetails, fetchSeriesDetails } = require("./fetchMovie");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5144;
const distPath = path.join(__dirname, "dist");

// ✅ CORS Middleware
app.use(cors());

// Middleware
app.use(express.json());

// Serve static React build
app.use(express.static(distPath));

// ✅ Routes
app.use("/api", movieRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movie_of_week", movieOfWeekRoutes);

// Helper function to detect bots
function isCrawler(req) {
    const ua = req.headers["user-agent"] || "";
    return /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp/i.test(
        ua
    );
}

// Movie route
// Movie route
app.get("/movie/:movieId", async (req, res) => {
    const { movieId } = req.params;

    if (isCrawler(req)) {
        try {
            const movie = await fetchMovieDetails(movieId);
            const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta property="og:title" content="${movie.title}">
            <meta property="og:description" content="${movie.overview}">
            <meta property="og:image" content="${movie.poster}">
            <meta property="og:url" content="https://www.oasisplus.com.ng/movie/${movieId}">
            <meta property="og:type" content="video.movie">
            <title>${movie.title}</title>
          </head>
          <body>
            <script>window.location.href="https://www.oasisplus.com.ng/movie/${movieId}"</script>
          </body>
        </html>
      `;
            return res.send(html);
        } catch (err) {
            return res.status(500).send("Failed to fetch movie details for bot");
        }
    }

    // ✅ Redirect users directly to the frontend domain
    res.redirect(`https://www.oasisplus.com.ng/movie/${movieId}`);
});


// Series route
app.get("/series/:seriesId", async (req, res) => {
    const { seriesId } = req.params;

    if (isCrawler(req)) {
        try {
            const series = await fetchSeriesDetails(seriesId);
            const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta property="og:title" content="${series.title}">
            <meta property="og:description" content="${series.overview}">
            <meta property="og:image" content="${series.poster}">
            <meta property="og:url" content="https://www.oasisplus.com.ng/series/${seriesId}">
            <meta property="og:type" content="video.tv_show">
            <title>${series.title}</title>
          </head>
          <body>
            <script>window.location.href="https://www.oasisplus.com.ng/series/${seriesId}"</script>
          </body>
        </html>
      `;
            return res.send(html);
        } catch (err) {
            return res.status(500).send("Failed to fetch series details for bot");
        }
    }

    // ✅ Redirect users directly to the frontend domain
    res.redirect(`https://www.oasisplus.com.ng/series/${seriesId}`);
});


// SPA fallback
// app.get("/*", (req, res) => {
//     res.status(200).send("Frontend not built yet — index.html missing.");
// });



// ✅ MongoDB connection and server start
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
