const Label = () => {
  return (
    <div
      style={{
        position: "relative",
        justifySelf: "center",
        padding: "4px 14px",
        marginTop: "8px",
        marginBottom: "16px",
        background:
          "linear-gradient(180deg, #faf6ed 0%, #f0e8d4 50%, #e8ddc4 100%)",
        color: "#5a4a38",
        border: "1px solid rgba(0,0,0,0.4)",
        borderRadius: "20px",
        boxShadow:
          "inset 0 0 0 1px rgba(255,248,230,0.3), 0 0 8px rgba(0,0,0,0.1)",
        fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
        fontVariant: "small-caps",
        fontWeight: 500,
        fontSize: "0.95rem",
        letterSpacing: "0.08em",
        textAlign: "center",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {/* Left dot */}
      <div
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          backgroundColor: "#8b6f47",
          boxShadow: "0 0 1px rgba(0,0,0,0.3)",
        }}
      />
      {/* Right dot */}
      <div
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          backgroundColor: "#8b6f47",
          boxShadow: "0 0 1px rgba(0,0,0,0.3)",
        }}
      />
      Select a continent to explore
    </div>
  );
};

export default Label;
