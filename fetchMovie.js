// fetchMovie.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const API_KEY = "49e8f09b8364cf1348ed4f97e81039bb";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function fetchMovieDetails(movieId) {
    const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );
    if (!detailsRes.ok) throw new Error("Failed to fetch movie details");
    const movie = await detailsRes.json();
    return {
        title: movie.title,
        overview: movie.overview,
        poster: `${IMAGE_BASE}${movie.poster_path}`,
    };
}

async function fetchSeriesDetails(seriesId) {
    const detailsRes = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}&language=en-US`
    );
    if (!detailsRes.ok) throw new Error("Failed to fetch series details");
    const series = await detailsRes.json();
    return {
        title: series.name,
        overview: series.overview,
        poster: `${IMAGE_BASE}${series.poster_path}`,
    };
}

module.exports = { fetchMovieDetails, fetchSeriesDetails };
