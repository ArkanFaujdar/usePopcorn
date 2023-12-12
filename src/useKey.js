import { useEffect } from "react";

export function useKey(key, handleCloseMovie) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.lowerCase === key.lowerCase) {
          handleCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      // Clean up Function
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handleCloseMovie, key]
  );
}
