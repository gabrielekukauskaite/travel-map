const Nameplate = () => {
  return (
    <div className="absolute top-15 left-1/2 -translate-x-1/2 z-20">
      <div className="relative">
        {/* Plaque shadow and depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-amber-950 rounded-sm transform translate-y-1 blur-sm opacity-60"></div>

        {/* Main plaque */}
        <div className="relative bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 px-8 py-3 rounded-sm shadow-2xl border-2 border-amber-900">
          {/* Inner bevel effect */}
          <div className="absolute inset-1 border border-amber-500 rounded-sm opacity-30 pointer-events-none"></div>

          {/* Brushed metal texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent rounded-sm pointer-events-none"></div>

          {/* Mounting screws */}
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-amber-900 border border-amber-950 shadow-inner"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-900 border border-amber-950 shadow-inner"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-amber-900 border border-amber-950 shadow-inner"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-amber-900 border border-amber-950 shadow-inner"></div>

          {/* Text content */}
          <div className="relative text-center">
            <h1
              className="text-amber-950 font-serif text-lg font-bold tracking-wide mb-0.5"
              style={{
                textShadow:
                  "0 1px 0 rgba(255, 223, 136, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              Gabriele's Travel Chronicles
            </h1>
            <p
              className="text-amber-900 font-serif text-xs italic"
              style={{
                textShadow: "0 1px 0 rgba(255, 223, 136, 0.3)",
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
