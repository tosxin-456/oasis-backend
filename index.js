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
app.use("/api/movies", movieRoutes);
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

            const title = movie.title || "Movie Details";
            const description = movie.overview?.substring(0, 300) || "Watch the latest movies on OasisPlus.";
            const image = movie.poster || "https://www.oasisplus.com.ng/default-movie-poster.jpg";
            const url = `https://www.oasisplus.com.ng/movie/${movieId}`;
            const releaseDate = movie.release_date || "Unknown";
            const rating = movie.vote_average ? `${movie.vote_average}/10` : "N/A";
            const genres = movie.genres?.map(g => g.name).join(", ") || "Movies";

            const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
          <!-- Basic SEO -->
          <title>${title}</title>
          <meta name="description" content="${description}">
          <meta name="keywords" content="${genres}, Movies, Watch Online, OasisPlus">
          <meta name="author" content="OasisPlus">

          <!-- Open Graph -->
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${image}">
          <meta property="og:url" content="${url}">
          <meta property="og:type" content="video.movie">
          <meta property="og:site_name" content="OasisPlus">
          <meta property="og:locale" content="en_US">
          <meta property="video:release_date" content="${releaseDate}">
          <meta property="video:genre" content="${genres}">
          <meta property="video:rating" content="${rating}">

          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${image}">
          <meta name="twitter:site" content="@OasisPlus">
          
          <!-- Extra -->
          <link rel="canonical" href="${url}">
        </head>
        <body>
          <script>window.location.href="${url}"</script>
        </body>
      </html>
      `;

            return res.send(html);
        } catch (err) {
            return res.status(500).send("Failed to fetch movie details for bot");
        }
    }

    // ✅ Redirect real users to frontend
    res.redirect(`https://www.oasisplus.com.ng/movie/${movieId}`);
});


// ✅ Series Route (Enhanced too)
app.get("/series/:seriesId", async (req, res) => {
    const { seriesId } = req.params;

    if (isCrawler(req)) {
        try {
            const series = await fetchSeriesDetails(seriesId);

            const title = series.title || "Series Details";
            const description = series.overview?.substring(0, 300) || "Watch your favorite series on OasisPlus.";
            const image = series.poster || "https://www.oasisplus.com.ng/default-series-poster.jpg";
            const url = `https://www.oasisplus.com.ng/series/${seriesId}`;
            const genres = series.genres?.map(g => g.name).join(", ") || "TV Shows";
            const rating = series.vote_average ? `${series.vote_average}/10` : "N/A";
            const firstAirDate = series.first_air_date || "Unknown";

            const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
          <!-- Basic SEO -->
          <title>${title}</title>
          <meta name="description" content="${description}">
          <meta name="keywords" content="${genres}, TV Series, Watch Online, OasisPlus">
          <meta name="author" content="OasisPlus">

          <!-- Open Graph -->
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${image}">
          <meta property="og:url" content="${url}">
          <meta property="og:type" content="video.tv_show">
          <meta property="og:site_name" content="OasisPlus">
          <meta property="og:locale" content="en_US">
          <meta property="video:release_date" content="${firstAirDate}">
          <meta property="video:genre" content="${genres}">
          <meta property="video:rating" content="${rating}">

          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${image}">
          <meta name="twitter:site" content="@OasisPlus">
          
          <!-- Extra -->
          <link rel="canonical" href="${url}">
        </head>
        <body>
          <script>window.location.href="${url}"</script>
        </body>
      </html>
      `;

            return res.send(html);
        } catch (err) {
            return res.status(500).send("Failed to fetch series details for bot");
        }
    }

    // ✅ Redirect real users to frontend
    res.redirect(`https://www.oasisplus.com.ng/series/${seriesId}`);
});





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
