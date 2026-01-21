const Nameplate = () => {
  return (
    <div className="absolute top-15 left-1/2 -translate-x-1/2 z-20">
      <div className="relative">
        {/* Cartouche shadow */}
        <div
          className="absolute inset-0 translate-y-2 blur-md opacity-40 rounded-[30px]"
          style={{
            background:
              "linear-gradient(180deg, var(--parchment-light) 0%, var(--parchment-mid) 50%, var(--parchment-dark) 100%)",
          }}
        />

        {/* Main cartouche banner */}
        <div
          className="relative w-[500px] h-[85px] border-2 border-[var(--brown-medium)] rounded-[25px] opacity-95 p-2"
          style={{
            background:
              "linear-gradient(180deg, var(--parchment-light) 0%, var(--parchment-mid) 50%, var(--parchment-dark) 100%)",
            filter: "drop-shadow(0 4px 8px var(--shadow-dark))",
          }}
        >
          {/* Inner border decoration */}
          <div className="absolute top-2 left-2 right-2 bottom-2 border-[0.8px] border-[var(--brown-light)] rounded-[20px] opacity-40 pointer-events-none" />

          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
          <div className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
          <div className="absolute bottom-2 left-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
          <div className="absolute bottom-2 right-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />

          {/* Text content */}
          <div className="relative text-center p-[5px]">
            <h1
              className="font-serif text-xl font-semibold tracking-wider mb-1 text-[var(--brown-dark)] small-caps"
              style={{
                textShadow: "0 1px 1px var(--white-highlight-medium)",
                fontVariant: "small-caps",
              }}
            >
              Gabriele's Travel Chronicles
            </h1>
            <p
              className="font-serif text-sm italic text-[var(--brown-medium)]"
              style={{
                textShadow: "0 0.5px 0.5px var(--white-highlight)",
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
