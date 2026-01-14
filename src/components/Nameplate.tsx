const Nameplate = () => {
  return (
    <div className="absolute top-15 left-1/2 -translate-x-1/2 z-20">
      <div className="relative">
        {/* Cartouche shadow */}
        <div
          className="absolute inset-0 transform translate-y-2 blur-md opacity-40"
          style={{
            background:
              "linear-gradient(180deg, #f5ead4 0%, #f0e8d4 50%, #e8ddc4 100%)",
            borderRadius: "30px",
          }}
        />

        {/* Main cartouche banner */}
        <div
          className="relative"
          style={{
            width: "500px",
            height: "85px",
            background:
              "linear-gradient(180deg, #f5ead4 0%, #f0e8d4 50%, #e8ddc4 100%)",
            border: "2px solid #6b5438",
            borderRadius: "25px",
            opacity: 0.95,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            padding: "8px",
          }}
        >
          {/* Inner border decoration */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              right: "8px",
              bottom: "8px",
              border: "0.8px solid #8b6f47",
              borderRadius: "20px",
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />

          {/* Decorative corner elements */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#8b6f47",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#8b6f47",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#8b6f47",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#8b6f47",
              opacity: 0.5,
            }}
          />

          {/* Text content */}
          <div className="relative text-center p-[5px]">
            <h1
              className="font-serif text-xl font-semibold tracking-wider mb-1"
              style={{
                color: "#3d2817",
                textShadow: "0 1px 1px rgba(255, 255, 255, 0.5)",
                fontVariant: "small-caps",
              }}
            >
              Gabriele's Travel Chronicles
            </h1>
            <p
              className="font-serif text-sm italic"
              style={{
                color: "#6b5438",
                textShadow: "0 0.5px 0.5px rgba(255, 255, 255, 0.3)",
              }}
            >
              Postcards from Around the World
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nameplate;
