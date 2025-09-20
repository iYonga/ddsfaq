import React, { useState } from "react";

const FAQCard = ({ question, answer, source, letter, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id={`faq-${letter}-${id}`}
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "0.75rem",
        marginBottom: "1rem",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <div
          style={{
            flex: 1,
            color: "#fff",
            fontSize: "1rem",
            lineHeight: "1.5",
          }}
        >
          <span
            style={{
              color: "#FFCC00",
              fontWeight: "bold",
              marginRight: "0.5rem",
            }}
          >
            Q:
          </span>
          {question}
        </div>
        <div
          style={{
            fontSize: "1.2rem",
            color: "#FFCC00",
            transition: "transform 0.3s ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          ▼
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            borderTop: "1px solid #333",
            backgroundColor: "#0f0f0f",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              color: "#ccc",
              fontSize: "0.95rem",
              lineHeight: "1.6",
            }}
          >
            <div
              style={{
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  color: "#4CAF50",
                  fontWeight: "bold",
                  marginRight: "0.5rem",
                }}
              >
                A:
              </span>
              {answer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQCard;
