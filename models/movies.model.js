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
        poster: {
            type: String, // Full URL of the poster
        },
        backdrop: {
            type: String, // Full URL of the backdrop image
        },
        overview: {
            type: String,
        },
        genres: {
            type: [String],
            default: [],
        },
        releaseDate: {
            type: String,
        },
        rating: {
            type: Number,
        },
        popularity: {
            type: Number,
        },
        originalLanguage: {
            type: String,
        },
        voteCount: {
            type: Number,
        },
        number: {
            type: Number,
            required: false,
        },
    },
    { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
