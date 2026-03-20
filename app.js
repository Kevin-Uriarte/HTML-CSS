const API_KEY = "288d196bb8160b95e05bd6b2cf8db23b";

const BASE = "https://api.themoviedb.org/3/discover/movie";
const SEARCH = "https://api.themoviedb.org/3/search/movie";
const IMG = "https://image.tmdb.org/t/p/w500";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

const homeSection = document.getElementById("home-section");
const movieSection = document.getElementById("movie-detail-section");
const actorSection = document.getElementById("actor-detail-section");


// ================= HOME =================
function goHome() {
  homeSection.classList.remove("hidden");
  movieSection.classList.add("hidden");
  actorSection.classList.add("hidden");
}


// ================= GET MOVIES =================
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}


// ================= SHOW MOVIES =================
function showMovies(movies) {

  moviesDiv.innerHTML = "";

  movies.forEach(movie => {

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${IMG + movie.poster_path}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p class="rating">⭐ ${movie.vote_average}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      getMovieDetail(movie.id);
    });

    moviesDiv.appendChild(card);
  });
}


// ================= MOVIE DETAIL =================
async function getMovieDetail(id) {

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-MX`
  );

  const movie = await res.json();

  homeSection.classList.add("hidden");
  movieSection.classList.remove("hidden");

  document.getElementById("movie-title").innerText = movie.title;
  document.getElementById("movie-overview").innerText = movie.overview;
  document.getElementById("movie-rating").innerText = "⭐ " + movie.vote_average;
  document.getElementById("movie-date").innerText = movie.release_date;
  document.getElementById("movie-poster").src = IMG + movie.poster_path;

  getActors(id);
}


// ================= ACTORES DE PELICULA =================
async function getActors(movieId) {

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=es-MX`
  );

  const data = await res.json();

  const actorsDiv = document.getElementById("actors");
  actorsDiv.innerHTML = "";

  data.cast.slice(0, 6).forEach(actor => {

    const actorCard = document.createElement("div");
    actorCard.classList.add("actor-card");

    actorCard.innerHTML = `
      <img src="${IMG + actor.profile_path}">
      <p>${actor.name}</p>
    `;

    actorCard.addEventListener("click", () => {
      getActorDetail(actor.id);
    });

    actorsDiv.appendChild(actorCard);
  });
}


// ================= ACTOR DETAIL =================
async function getActorDetail(id) {

  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=es-MX`
  );

  const actor = await res.json();

  movieSection.classList.add("hidden");
  actorSection.classList.remove("hidden");

  document.getElementById("actor-name").innerText = actor.name;
  document.getElementById("actor-bio").innerText = actor.biography || "Sin biografía";
  document.getElementById("actor-birthday").innerText = actor.birthday || "N/A";
  document.getElementById("actor-photo").src = IMG + actor.profile_path;
}


// ================= SEARCH =================
searchInput.addEventListener("keyup", e => {

  const value = e.target.value;

  if (value !== "") {
    getMovies(`${SEARCH}?api_key=${API_KEY}&query=${value}&language=es-MX`);
  } else {
    getMovies(`${BASE}?api_key=${API_KEY}&language=es-MX`);
  }
});


// ================= INIT =================
getMovies(`${BASE}?api_key=${API_KEY}&language=es-MX`);
