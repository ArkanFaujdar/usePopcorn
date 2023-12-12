import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(() => {
    const savedWatched = localStorage.getItem(key);
    return savedWatched ? JSON.parse(savedWatched) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
