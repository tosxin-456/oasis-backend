const express = require("express");
const router = express.Router();
const { addNewMovie, getAllMovies, getMovieById } = require("../controllers/movie.controller");

// Add new
router.post("/new_movies", addNewMovie);

router.get("/:movieId", getMovieById);


// Fetch all
router.get("/all", getAllMovies);

module.exports = router;
