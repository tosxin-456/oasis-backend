const MovieOfTheWeek = require("../models/movieOfWeek.model");

// @desc    Set or update the Movie of the Week
// @route   POST /api/movie_of_week
// @access  Private (Admin)
const setMovieOfTheWeek = async (req, res) => {
    try {
        const {
            movieId,
            title,
            year,
            downloadUrl,
            type,
            poster,
            overview,
            rating,
        } = req.body;
        console.log('object')

        if (!movieId || !title || !downloadUrl) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Replace any existing Movie of the Week
        const existing = await MovieOfTheWeek.findOne();

        if (existing) {
            await MovieOfTheWeek.findByIdAndDelete(existing._id);
        }

        const newMovie = await MovieOfTheWeek.create({
            movieId,
            title,
            year,
            downloadUrl,
            type,
            poster,
            overview,
            rating,
        });

        res.status(201).json({
            message: "Movie of the Week set successfully",
            movie: newMovie,
        });
    } catch (err) {
        console.error("Error setting movie of the week:", err);
        res.status(500).json({ message: "Failed to set Movie of the Week" });
    }
};

// @desc    Get current Movie of the Week
// @route   GET /api/movie_of_week
// @access  Public
const getMovieOfTheWeek = async (req, res) => {
    try {
        const movies = await MovieOfTheWeek.find(); // return all movies
        if (!movies.length) {
            return res.status(404).json({ message: "No Movie of the Week found" });
        }

        res.json({
            message: "Movies of the Week fetched successfully",
            movies,
        });
    } catch (err) {
        console.error("Error fetching Movies of the Week:", err);
        res.status(500).json({ message: "Failed to fetch Movies of the Week" });
    }
};


// @desc    Delete current Movie of the Week
// @route   DELETE /api/movie_of_week
// @access  Private (Admin)
const deleteMovieOfTheWeek = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await MovieOfTheWeek.findById(id);

        if (!movie) {
            return res.status(404).json({ message: "Movie of the Week not found" });
        }

        await MovieOfTheWeek.findByIdAndDelete(id);

        res.json({ message: "Movie of the Week deleted successfully" });
    } catch (err) {
        console.error("Error deleting Movie of the Week:", err);
        res.status(500).json({ message: "Failed to delete Movie of the Week" });
    }
};


module.exports = {
    setMovieOfTheWeek,
    getMovieOfTheWeek,
    deleteMovieOfTheWeek,
};
