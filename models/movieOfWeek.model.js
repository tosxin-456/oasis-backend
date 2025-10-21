const mongoose = require("mongoose");

const movieOfWeekSchema = new mongoose.Schema(
    {
        movieId: {
            type: Number,
            required: true,
            unique: true, // only one record per TMDB movie
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: String,
            default: "N/A",
        },
        downloadUrl: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["movie", "series"],
            default: "movie",
        },
        poster: {
            type: String,
            default: null,
        },
        overview: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const MovieOfTheWeek = mongoose.model("MovieOfWeek", movieOfWeekSchema);

module.exports = MovieOfTheWeek;