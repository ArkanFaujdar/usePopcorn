import { useEffect, useRef, useState } from "react";
import { useMovies } from "./useMovies";
import Rating from "./starRating";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "6db0b51f";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedMovieId] = useState(null);
  const { movies, loading, error } = useMovies(query);
  console.log(movies);

  // To store Data in browser memory
  const [watched, setWatched] = useLocalStorage([], "watched");

  // To select movie to display the Details of it
  function handleSelectMovie(Id) {
    setSelectedMovieId((id) => (Id === id ? null : Id));
  }

  // To close the Selected movie
  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  // TO remove a movie from the watched section
  function handleRemoveFromWatched(Id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== Id));
  }

  console.log(query.length);
  return (
    <>
      {/* Implicit way of passing a children prop */}
      <h1 className="text-extrabold text-[30px] text-center mb-5 md:hidden">
        🍿 Use Popcorn
      </h1>
      <Navbar>
        <SearchBar
          setQuery={setQuery}
          query={query}
          handleCloseMovie={handleCloseMovie}
        />
        <Results movies={movies} />
      </Navbar>

      <Main>
        <div className="grid md:grid-cols-2 gap-10">
          <Box1>
            {error && <ErrorPop message={error} />}
            {loading && <Loading />}
            {!loading && !error && (
              <MovieList
                movies={movies}
                handleSelectMovie={handleSelectMovie}
                query={query}
              />
            )}
          </Box1>

          <Box2>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                handleCloseMovie={handleCloseMovie}
                watched={watched}
                setWatched={setWatched}
                key={selectedId + 10}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList
                  watched={watched}
                  handleRemoveFromWatched={handleRemoveFromWatched}
                />
              </>
            )}
          </Box2>
        </div>
      </Main>
    </>

    /* Explicit way of passing a children prop */

    // <>
    //   <Navbar element={<Results movies={movies} />} />

    //   <Main>
    //     <Box element={<MovieList movies={movies} />} />

    //     <Box
    //       element={
    //         <>
    //           <WatchedSummary watched={watched} />
    //           <WatchedMovieList watched={watched} />
    //         </>
    //       }
    //     />
    //   </Main>
    // </>
  );
}

function ErrorPop({ message }) {
  return (
    <p className="error">
      <span>⛔️</span>
      {message}
    </p>
  );
}

function Loading() {
  return <p className="loader">loading...</p>;
}

// Navbar Elements
function Logo() {
  return (
    <div className="logo flex">
      <span
        role="img"
        className="hidden md:flex
      "
      >
        🍿
      </span>
      <h1 className="hidden md:flex">usePopcorn</h1>
    </div>
  );
}

function SearchBar({ setQuery, query, handleCloseMovie }) {
  const inputEl = useRef(null);
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, []);

  // Using useRef hook
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          // setQuery("");
          // handleCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return document.addEventListener("keydown", callback);
    },
    [setQuery, handleCloseMovie]
  );

  return (
    <>
      <input
        className="search m-auto sm:w-[450px] md:w-full"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
    </>
  );
}
function Results({ movies }) {
  return (
    <>
      <p className="hidden text-center md:block text-[15px]">
        Found <strong>{movies.length}</strong> results
      </p>
    </>
  );
}

function Navbar({ children }) {
  return (
    <>
      <nav className="nav-bar md:pl-10 md:bg-[#6741d9]">
        <Logo />
        {children}
      </nav>
    </>
  );
}

// Main Section
function Main({ children }) {
  return (
    <>
      <main className="main m-auto md:mt-10 md:mx-10 max-w-screen md:h-screen">
        {children}
      </main>
    </>
  );
}

// Added Movies List
function Box1({ children, query }) {
  return (
    <div className="box max-h-[350px] md:max-h-screen">
      {/* <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      no need to wrap children in {} */}
      {children}
    </div>
  );
}
function Box2({ children }) {
  const [isOpen, setIsOpen1] = useState(true);
  return (
    <div className="box max-w-full">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {/* no need to wrap children in {} */}
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          handleSelectMovie={handleSelectMovie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

// List that pops after search
function Movie({ movie, handleSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// To Display the Complete details of the Selected Movie using another API link
function MovieDetails({ selectedId, handleCloseMovie, setWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoadingDetatils, setIsLoadingDetails] = useState(false);
  const [userRating, setUserRating] = useState("");
  const userRated = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const {
    Poster: poster,
    Actors: actors,
    Year: year,
    Title: title,
    imdbRating,
    Plot: plot,
    Genre: genre,
    Director: director,
    Runtime: runtime,
    Released: released,
  } = movie;

  useEffect(
    function () {
      async function FetchData() {
        setIsLoadingDetails(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();

        setMovie(data);
        setIsLoadingDetails(false);
      }
      FetchData();
    },
    [selectedId]
  );

  // to set title to the selected Movie name
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie : ${title}`;

      // Clean up function , runs whenever a component is unmount

      return function () {
        document.title = `usePopcorn`;
      };
    },
    [title, selectedId]
  );

  useKey("Escape", handleCloseMovie);

  // To add a movie in the Watched List
  function handleWatchList() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    setWatched((list) => [...list, newWatchedMovie]);
    handleCloseMovie();
  }
  return (
    <>
      {isLoadingDetatils ? (
        <Loading />
      ) : (
        <div className="details">
          <button className="btn-back" onClick={() => handleCloseMovie()}>
            &larr;
          </button>
          <header>
            <img src={poster} alt="okay" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐️ {imdbRating} ImdbRating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {console.log(userRating)}
              {!isWatched ? (
                <>
                  <Rating
                    maxRating={10}
                    size={24}
                    handleSetRating={setUserRating}
                  />
                  {
                    <>
                      <button
                        className="btn-add"
                        onClick={() => handleWatchList(movie)}
                      >
                        + Add to Watchlist
                      </button>
                    </>
                  }
                </>
              ) : (
                <p>
                  You have already Rated this Movie {userRated} <span>⭐️</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

//

// Watched Section
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies to be watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>
            {watched.length === 1
              ? watched.length + " movie"
              : watched.length + " movies"}
          </span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Math.round(avgImdbRating)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Math.round(avgUserRating)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, handleRemoveFromWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleRemoveFromWatched={handleRemoveFromWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleRemoveFromWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{!movie.userRating ? 4 : movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleRemoveFromWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
