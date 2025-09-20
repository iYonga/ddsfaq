import React from "react";

const AlphabetNav = ({ availableLetters, activeLetter, onLetterClick }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div
      style={{
        position: "sticky",
        top: "1rem",
        backgroundColor: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        marginBottom: "2rem",
        zIndex: 100,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        {alphabet.map((letter) => {
          const isAvailable = availableLetters.includes(letter);
          const isActive = activeLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => isAvailable && onLetterClick(letter)}
              disabled={!isAvailable}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                border: isActive
                  ? "2px solid #FFCC00"
                  : isAvailable
                  ? "1px solid #666"
                  : "1px solid #333",
                borderRadius: "0.375rem",
                backgroundColor: isActive
                  ? "#FFCC00"
                  : isAvailable
                  ? "#2a2a2a"
                  : "#1a1a1a",
                color: isActive
                  ? "#000"
                  : isAvailable
                  ? "#ccc"
                  : "#666",
                cursor: isAvailable ? "pointer" : "default",
                fontSize: "0.9rem",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                if (isAvailable && !isActive) {
                  e.target.style.backgroundColor = "#333";
                  e.target.style.color = "#FFCC00";
                }
              }}
              onMouseLeave={(e) => {
                if (isAvailable && !isActive) {
                  e.target.style.backgroundColor = "#2a2a2a";
                  e.target.style.color = "#ccc";
                }
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AlphabetNav;