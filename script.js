const moviesUrl = "http://localhost:3000/films";
const movieList = document.getElementById("films");
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieDescription = document.getElementById("movie-description");
const movieShowtime = document.getElementById("movie-showtime");
const movieRuntime = document.getElementById("movie-runtime");
const availableTickets = document.getElementById("available-tickets");
const buyTicketButton = document.getElementById("buy-ticket");

document.addEventListener("DOMContentLoaded", loadMovies);

function loadMovies() {
    fetch(moviesUrl)
        .then(response => response.json())
        .then(movies => {
            movieList.innerHTML = "";
            movies.forEach(movie => displayMovieInList(movie));
            if (movies.length > 0) {
                displayMovieDetails(movies[0]);
            }
        });
}

function displayMovieInList(movie) {
    const movieItem = document.createElement("li");
    movieItem.textContent = movie.title;
    movieItem.dataset.id = movie.id;
    movieItem.classList.add("film-item");

    if (movie.capacity - movie.tickets_sold <= 0) {
        movieItem.classList.add("sold-out");
    }

    movieItem.addEventListener("click", () => displayMovieDetails(movie));

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "red";
    deleteBtn.style.color = "white";
    deleteBtn.onclick = (event) => {
        event.stopPropagation();
        deleteMovie(movie.id, movieItem);
    };

    movieItem.appendChild(deleteBtn);
    movieList.appendChild(movieItem);
}

function displayMovieDetails(movie) {
    moviePoster.src = movie.poster;
    movieTitle.textContent = movie.title;
    movieDescription.textContent = movie.description;
    movieShowtime.textContent = movie.showtime;
    movieRuntime.textContent = movie.runtime;
    availableTickets.textContent = movie.capacity - movie.tickets_sold;

    buyTicketButton.disabled = movie.capacity - movie.tickets_sold <= 0;
    buyTicketButton.textContent = buyTicketButton.disabled ? "Sold Out" : "Buy Ticket";

    buyTicketButton.onclick = () => buyTicket(movie);
}

function buyTicket(movie) {
    if (movie.tickets_sold < movie.capacity) {
        const updatedTickets = movie.tickets_sold + 1;

        fetch(`${moviesUrl}/${movie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets_sold: updatedTickets })
        })
        .then(response => response.json())
        .then(updatedMovie => {
            displayMovieDetails(updatedMovie);
            updateMovieList(updatedMovie);
        });
    }
}

function updateMovieList(movie) {
    const movieItems = document.querySelectorAll("#films li");
    movieItems.forEach(item => {
        if (item.dataset.id == movie.id) {
            if (movie.capacity - movie.tickets_sold <= 0) {
                item.classList.add("sold-out");
            } else {
                item.classList.remove("sold-out");
            }
        }
    });
}

function deleteMovie(movieId, movieItem) {
    fetch(`${moviesUrl}/${movieId}`, { method: "DELETE" })
        .then(() => movieItem.remove());
}
