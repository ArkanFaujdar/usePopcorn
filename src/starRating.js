import React from "react";

// Styles
const container = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  lineHeight: "1px",
};
const star = {
  display: "flex",
};

export default function Rating({
  maxRating = 5,
  size = 36,
  color = "#FFD700",
  messages = ["Not Good", "Okay", "Good", "Great", "Amazing"],
  defaultRating = 4,
  handleSetRating,
}) {
  const [rating, setRating] = React.useState(defaultRating);
  const [hoverRating, setHoverRating] = React.useState(rating);

  function handleRating(rate) {
    setRating(rate);
    console.log(rate);
    handleSetRating(rate);
  }

  return (
    <div style={container}>
      <div style={star}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Stars
            key={i}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setHoverRating(i + 1)}
            onHoverOut={() => setHoverRating(0)}
            full={hoverRating ? hoverRating > i : rating > i}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p>{hoverRating || rating + "/" + maxRating}</p>
    </div>
  );
}

function Stars({ onRate, full, onHoverOut, onHoverIn, size, color }) {
  const starRating = {
    display: "block",
    height: `${size}px`,
    width: `${size}px`,
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starRating}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
