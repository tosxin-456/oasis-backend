const express = require("express");
const router = express.Router();
const { addNewMovie, getAllMovies } = require("../controllers/movie.controller");

// Add new
router.post("/new_movies", addNewMovie);

// Fetch all
router.get("/movies", getAllMovies);

module.exports = router;
