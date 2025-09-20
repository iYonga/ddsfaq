import React from "react";
import Button from "./Button";

const FeatureCard = ({
  title,
  description,
  icon,
  onClick,
  variant = "primary",
  color = "#FFCC00",
  size = "medium"
}) => {
  const cardStyle = {
    background: "rgba(17, 17, 17, 0.8)",
    border: "2px solid rgba(255, 204, 0, 0.2)",
    borderRadius: "1rem",
    padding: "2rem",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    minHeight: size === "large" ? "280px" : size === "small" ? "200px" : "240px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1rem",
  };

  const hoverStyle = {
    transform: "translateY(-8px)",
    borderColor: color,
    boxShadow: `0 12px 40px rgba(${hexToRgb(color)}, 0.3)`,
    background: "rgba(17, 17, 17, 0.95)",
  };

  const iconContainerStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: `rgba(${hexToRgb(color)}, 0.1)`,
    border: `2px solid ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    fontSize: "2rem",
    color: color,
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    margin: "0",
    marginBottom: "0.5rem",
  };

  const descriptionStyle = {
    color: "#ccc",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    margin: "0",
    flex: "1",
  };

  const handleMouseEnter = (e) => {
    Object.entries(hoverStyle).forEach(([key, value]) => {
      e.currentTarget.style[key] = value;
    });

    const iconContainer = e.currentTarget.querySelector('.icon-container');
    if (iconContainer) {
      iconContainer.style.transform = "scale(1.1)";
      iconContainer.style.background = `rgba(${hexToRgb(color)}, 0.2)`;
    }
  };

  const handleMouseLeave = (e) => {
    Object.keys(hoverStyle).forEach(key => {
      e.currentTarget.style[key] = cardStyle[key] || "";
    });

    const iconContainer = e.currentTarget.querySelector('.icon-container');
    if (iconContainer) {
      iconContainer.style.transform = "scale(1)";
      iconContainer.style.background = `rgba(${hexToRgb(color)}, 0.1)`;
    }
  };

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      "255, 204, 0";
  }

  return (
    <div
      style={cardStyle}
      className="feature-card"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="icon-container" style={iconContainerStyle}>
        {icon}
      </div>

      <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3 style={titleStyle}>{title}</h3>
          <p style={descriptionStyle}>{description}</p>
        </div>

        <Button
          label="Get Started"
          variant={variant}
          size="small"
          style={{
            marginTop: "1rem",
            borderColor: color,
            color: variant === "primary" ? "#000" : color,
            background: variant === "primary" ? color : "transparent",
          }}
          trigger={onClick}
        />
      </div>

      {/* Decorative corner accent */}
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "30px",
          height: "30px",
          background: color,
          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          opacity: "0.7",
        }}
      />
    </div>
  );
};

export default FeatureCard;