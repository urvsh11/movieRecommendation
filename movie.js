const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjEyY2U3MTFiYmY5YmEwMDViMDVhMTFjZTY4MjlhNSIsIm5iZiI6MTc0MDE2MzA0OS4zNCwic3ViIjoiNjdiOGM3ZTk2OWIzMDIyMzhhZjNjNzRhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.S_QGPRSIpSEEd1f6MUiVzW8IR_Vvg9KWDuB481dzINg",
  },
};

let selectedOption;
let i = 0; // Start with the first movie
const searchBtn = document.getElementById("playBtn");
const moviePoster = document.getElementById("moviePoster");
const movieText = document.getElementById("movieText");
const genreList = document.getElementById("genres");
const nextBtn = document.getElementById("likeBtn");
const nextBtnDiv = document.getElementById("likeOrDislikeBtns");

// Fetch genre list and populate the dropdown
fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
  .then((res) => res.json())
  .then((res) => {
    // Clear previous options
    genreList.innerHTML = "";

    // Loop through each genre and create an <option> for each
    res.genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id; // Genre ID as the value
      option.textContent = genre.name; // Genre name as the visible text
      genreList.appendChild(option);
    });
  })
  .catch((err) => console.error(err));

// Function to fetch movies by genre ID
function fetchMoviesByGenre(genreId, index) {
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`;

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res.results.length > 0) {
        const posterPath = res.results[index].poster_path;

        // Full image URL
        const fullImageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

        // Set the movie poster
        moviePoster.innerHTML = `<img src="${fullImageUrl}" alt="${res.results[index].original_title} poster">`;

        // Create movie title and overview
        const h3 = document.createElement("h3");
        const para = document.createElement("p");
        h3.textContent = res.results[index].original_title;
        para.textContent = res.results[index].overview;

        // Append the movie title and overview to the movie text container
        movieText.innerHTML = ""; // Clear any previous content
        movieText.appendChild(h3);
        movieText.appendChild(para);
      }
    })
    .catch((err) => console.error(err));
}

// Add event listener to capture selected genre's ID
searchBtn.addEventListener("click", () => {
  const selectedGenreId = genreList.value;
  selectedOption = selectedGenreId;
  console.log("Selected Genre ID:", selectedOption);
  nextBtnDiv.hidden = false;

  // Fetch movies based on selected genre
  fetchMoviesByGenre(selectedOption, i);
});

// Add event listener to the next button to show the next movie
nextBtn.addEventListener("click", () => {
  i++; // Increment the movie index
  fetchMoviesByGenre(selectedOption, i);
});
