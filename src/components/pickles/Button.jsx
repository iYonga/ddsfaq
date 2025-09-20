import React from "react";
// Enhanced button component with hover effects and animations
const Button = ({
  style,
  label,
  trigger = () => {},
  variant = "primary", // primary, secondary, outline
  size = "medium", // small, medium, large
  fullWidth = false,
  icon = null
}) => {
  const baseStyles = {
    padding: size === "small" ? "0.4rem 0.8rem" : size === "large" ? "0.8rem 1.6rem" : "0.6rem 1.2rem",
    fontSize: size === "small" ? "0.9rem" : size === "large" ? "1.1rem" : "1rem",
    borderRadius: "0.5rem",
    border: "2px solid",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
    width: fullWidth ? "100%" : "auto",
    minWidth: fullWidth ? "100%" : "auto",
  };

  const variantStyles = {
    primary: {
      background: "var(--primary-color)",
      borderColor: "var(--primary-color)",
      color: "#000",
      boxShadow: "var(--shadow-soft)",
    },
    secondary: {
      background: "transparent",
      borderColor: "var(--primary-color)",
      color: "var(--primary-color)",
    },
    outline: {
      background: "rgba(255, 204, 0, 0.1)",
      borderColor: "var(--primary-color)",
      color: "var(--primary-color)",
    }
  };

  const hoverStyles = {
    primary: {
      transform: "translateY(-2px)",
      boxShadow: "var(--shadow-medium)",
    },
    secondary: {
      background: "var(--primary-color)",
      color: "#000",
      transform: "translateY(-2px)",
    },
    outline: {
      background: "rgba(255, 204, 0, 0.2)",
      transform: "translateY(-2px)",
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...style,
  };

  const handleMouseEnter = (e) => {
    Object.entries(hoverStyles[variant]).forEach(([key, value]) => {
      e.target.style[key] = value;
    });
  };

  const handleMouseLeave = (e) => {
    Object.keys(hoverStyles[variant]).forEach(key => {
      e.target.style[key] = combinedStyles[key] || "";
    });
  };

  return (
    <button
      onClick={trigger}
      style={combinedStyles}
      className="enhanced-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
