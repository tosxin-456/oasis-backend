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
        console.log("here")
        // Fetch all movies and series (sorted by newest first)
        const allMovies = await Movie.find().sort({ createdAt: -1 });

        // Separate movies and series for convenience (optional)
        const movies = allMovies.filter((item) => item.type === "movie");
        const series = allMovies.filter((item) => item.type === "series");

        // Get pending uploads (where downloadUrl is missing or empty)
        const pendingUploads = allMovies.filter(
            (item) => !item.downloadUrl || item.downloadUrl.trim() === ""
        );

        res.status(200).json({
            totalMovies: movies.length,
            totalSeries: series.length,
            pendingUploads: pendingUploads.length,
            movies,
            series,
            pendingUploads,
            allMovies, // includes everything in one array for full access
        });
    } catch (error) {
        // console.error("Error fetching movies:", error);
        res.status(500).json({ message: "Failed to fetch movies" });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Find movie by ID
        const movie = await Movie.findOne({ movieId });

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json(movie);
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ message: "Failed to fetch movie" });
    }
};


module.exports = { addNewMovie, getAllMovies, getMovieById };
