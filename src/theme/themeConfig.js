const theme = {
  token: {
    // 🎨 **Typography - Fresh, Modern, SaaS-like**
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: "0.5px",
    fontFamily: `"Inter", "Roboto", sans-serif`, // Use a fresh, modern font

    // 🌈 **Primary Colors - SaaS Vibes**
    colorPrimary: "#FF4F4F", // Bright & bold red
    colorPrimaryHover: "#E02B2B",
    colorPrimaryActive: "#B22424",
    colorLink: "#6E57E0", // Purple SaaS feel
    colorLinkHover: "#4D3DB2",

    // 🎭 **Text & Contrast**
    colorText: "#222", // Darker for strong contrast
    colorTextSecondary: "#4A4A4A",
    colorTextPlaceholder: "#A0A0A0",
    colorTextInverse: "#FFFFFF", // For dark mode components

    // 🟢 **Backgrounds & Containers**
    colorBgBase: "#F8FAFD", // Soft light grey instead of pure white
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "rgba(255, 255, 255, 0.95)", // Soft glass effect
    colorBorder: "#DDDDDD",

    // 🔲 **Shadows & Borders - Soft UI**
    borderRadius: 12,
    borderRadiusLG: 16,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)", // Softer modern shadows
    boxShadowSecondary: "0px 4px 12px rgba(0, 0, 0, 0.08)",

    // 🟣 **Hover & Active States**
    colorPrimaryBgHover: "rgba(255, 79, 79, 0.1)",
    colorPrimaryBgActive: "rgba(255, 79, 79, 0.2)",
  },

  // 🎨 **Custom Component Styles**
  components: {
    Button: {
      borderRadius: 10,
      height: 46,
      fontWeight: 600,
      paddingInline: 26,
      background: "linear-gradient(135deg, #FF4F4F 0%, #FF7878 100%)",
      color: "#FFF",
      boxShadow: "0px 6px 16px rgba(255, 79, 79, 0.2)", // Soft button glow
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        filter: "brightness(1.1)",
      },
    },
    Input: {
      borderRadius: 10,
      paddingInline: 14,
      background: "#FFF",
      colorBgContainer: "#FFF",
      colorBorder: "#E0E0E0",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)", // Subtle shadow
      colorTextPlaceholder: "#A0A0A0",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: "#FF4F4F",
      },
    },
    Card: {
      borderRadius: 16,
      background: "rgba(255, 255, 255, 0.75)", // Soft glassmorphism
      backdropFilter: "blur(10px)",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)", // Softer depth
      padding: 24,
    },
    Modal: {
      borderRadius: 20,
      boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)",
      background: "rgba(255, 255, 255, 0.9)", // More glass effect
      backdropFilter: "blur(12px)",
    },
    Table: {
      borderRadius: 14,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
      colorBgContainer: "#FFF",
      colorBorder: "#E5E5E5",
    },
    Tooltip: {
      colorBgContainer: "#1A1A1A",
      colorText: "#FFF",
      borderRadius: 6,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
  },
};

export default theme;
