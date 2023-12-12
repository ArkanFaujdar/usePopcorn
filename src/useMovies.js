import { useState, useEffect } from "react";

const KEY = "6db0b51f";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Failed");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "Abort Error") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }

      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }
      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, loading, error };
}
