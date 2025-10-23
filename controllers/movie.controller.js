// controllers/movieController.js
const Movie = require("../models/movies.model");

// ➕ Add New Movie or Series
const addNewMovie = async (req, res) => {
    try {
        const {
            movieId,
            title,
            type,
            downloadUrl,
            poster,
            backdrop,
            overview,
            genres,
            releaseDate,
            rating,
            popularity,
            originalLanguage,
            voteCount,
        } = req.body;

        // ✅ Validate input before saving
        if (!movieId || !title || !type || !downloadUrl) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // ✅ Prevent duplicate TMDB entries
        const existingMovie = await Movie.findOne({ movieId });
        if (existingMovie) {
            return res.status(400).json({ message: "Movie already exists" });
        }

        // ✅ Auto-increment 'number' field
        const lastMovie = await Movie.findOne().sort({ number: -1 });
        const nextNumber = lastMovie ? lastMovie.number + 1 : 1;

        // ✅ Create new movie
        const newMovie = new Movie({
            movieId,
            title,
            type,
            downloadUrl,
            poster,
            backdrop,
            overview,
            genres,
            releaseDate,
            rating,
            popularity,
            originalLanguage,
            voteCount,
            number: nextNumber,
        });

        await newMovie.save();

        res.status(201).json({
            message: `${type === "series" ? "Series" : "Movie"} added successfully`,
            movie: newMovie,
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
