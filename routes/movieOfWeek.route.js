const express = require("express");
const router = express.Router();
const {
    setMovieOfTheWeek,
    getMovieOfTheWeek,
    deleteMovieOfTheWeek,
} = require("../controllers/movieOfWeek.controller");
const { protect } = require("../middlewares/authMiddleware");


// Public route — anyone can see the current movie
router.get("/", getMovieOfTheWeek);

// Protected routes — only admins can modify
router.post("/", setMovieOfTheWeek);

router.delete("/:id", protect, deleteMovieOfTheWeek);

module.exports = router;
