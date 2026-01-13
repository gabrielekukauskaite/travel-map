const Label = () => {
  return (
    <div
      style={{
        justifySelf: "center",
        padding: "6px 8px",
        marginTop: "8px",
        marginBottom: "16px",
        background:
          "linear-gradient(180deg, #faf6ed 0%, #f0e8d4 50%, #e8ddc4 100%)",
        color: "#5a4a38",
        border: "1px solid rgba(122,93,49,0.4)",
        borderRadius: "14px",
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
      Select a continent to explore
    </div>
  );
};

export default Label;
