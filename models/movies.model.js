// models/movies.model.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        movieId: {
            type: Number,
            required: true,
            unique: true, // TMDB ID
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["movie", "series"],
            default: "movie",
        },
        downloadUrl: {
            type: String,
            required: true,
        },
        number: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
