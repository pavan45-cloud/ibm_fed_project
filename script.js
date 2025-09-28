//paste ur (i got using my mail in omdb website) actual OMDB API key =====
const API_KEY = "fcb6af6b";//my personal omdb key

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const movieList = document.getElementById("movie-list");
const movieTemplate = document.getElementById("movie-template");

// Search button click
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

// Fetch movie list
function fetchMovies(query) {
    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            movieList.innerHTML = "";

            if (data.Search) {
                data.Search.forEach(movie => {
                    fetchMovieDetails(movie.imdbID);
                });
            } else {
                movieList.innerHTML = "<p>No movies found.</p>";
            }
        })
        .catch(err => {
            console.error("Error fetching movies:", err);
            movieList.innerHTML = "<p>Error loading movies.</p>";
        });
}

// Fetch individual movie details
function fetchMovieDetails(id) {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(movie => {
            const movieCard = movieTemplate.content.cloneNode(true);

            // Poster
            const poster = movieCard.querySelector(".movie-poster");
            poster.src = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image";

            // Details
            movieCard.querySelector(".movie-title").textContent = movie.Title;
            movieCard.querySelector(".movie-year").textContent = `Year: ${movie.Year}`;
            movieCard.querySelector(".movie-plot").textContent = movie.Plot;

            const ratingSelect = movieCard.querySelector(".rating");
            const saveReviewBtn = movieCard.querySelector(".save-review-btn");
            const reviewText = movieCard.querySelector("textarea");
            const userReviewsDiv = movieCard.querySelector(".user-reviews");

            // Load stored reviews
            const storedData = JSON.parse(localStorage.getItem(id)) || [];
            storedData.forEach(review => {
                const reviewEl = document.createElement("p");
                reviewEl.textContent = `Rating: ${review.rating} - ${review.comment}`;
                userReviewsDiv.appendChild(reviewEl);
            });

            // Save review button
            saveReviewBtn.addEventListener("click", () => {
                const rating = ratingSelect.value;
                const comment = reviewText.value.trim();
                if (comment) {
                    storedData.push({ rating, comment });
                    localStorage.setItem(id, JSON.stringify(storedData));

                    const reviewEl = document.createElement("p");
                    reviewEl.textContent = `Rating: ${rating} - ${comment}`;
                    userReviewsDiv.appendChild(reviewEl);

                    reviewText.value = "";
                }
            });

            movieList.appendChild(movieCard);
        })
        .catch(err => {
            console.error("Error fetching movie details:", err);
        });
}