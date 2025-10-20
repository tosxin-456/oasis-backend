// controllers/movieController.js
const Movie = require("../models/movies.model");

// ➕ Add New Movie or Series
const addNewMovie = async (req, res) => {
    try {
        const { movieId, title, type, year, downloadUrl } = req.body;

        // Validate
        if (!movieId || !title || !type || !year || !downloadUrl) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Prevent duplicate TMDB entries
        const existingMovie = await Movie.findOne({ movieId });
        if (existingMovie) {
            return res.status(400).json({ message: "Movie already exists" });
        }

        // Increment number
        const lastMovie = await Movie.findOne().sort({ number: -1 });
        const nextNumber = lastMovie ? lastMovie.number + 1 : 1;

        // Save new
        const newMovie = new Movie({
            movieId,
            title,
            type,
            downloadUrl,
            number: nextNumber,
        });

        await newMovie.save();

        res.status(201).json({
            message: `${type === "series" ? "Series" : "Movie"} added successfully`,
            newMovie,
        });
    } catch (error) {
        console.error("Error saving movie:", error);
        res.status(500).json({ message: "Failed to save movie" });
    }
};

// 📦 Fetch All Movies and Stats
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });

        const totalMovies = await Movie.countDocuments({ type: "movie" });
        const totalSeries = await Movie.countDocuments({ type: "series" });
        const pendingUploads = await Movie.countDocuments({ downloadUrl: { $exists: false } });

        res.status(200).json({
            totalMovies,
            totalSeries,
            pendingUploads,
            movies,
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: "Failed to fetch movies" });
    }
};

module.exports = { addNewMovie, getAllMovies };
