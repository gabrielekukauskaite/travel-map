const Nameplate = () => {
  return (
    <div className="absolute top-15 left-1/2 -translate-x-1/2 z-20 w-[calc(100vw-8rem)] sm:w-[500px] max-w-[500px] h-auto min-h-[85px] border-2 border-[var(--brown-medium)] rounded-[25px] opacity-95 p-2 text-center bg-[linear-gradient(180deg,var(--parchment-light)_0%,var(--parchment-mid)_50%,var(--parchment-dark)_100%)] [filter:drop-shadow(0_4px_8px_var(--shadow-dark))]">
      {/* Inner border decoration */}
      <div className="absolute top-2 left-2 right-2 bottom-2 border-[0.8px] border-[var(--brown-light)] rounded-[20px] opacity-40 pointer-events-none" />

      {/* Decorative corner elements */}
      <div className="absolute top-2 left-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
      <div className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
      <div className="absolute bottom-2 left-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
      <div className="absolute bottom-2 right-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />

      {/* Text content */}
      <div className="relative p-[5px]">
        <h1 className="font-serif text-xl font-semibold tracking-wider mb-1 text-[var(--brown-dark)] leading-tight [text-shadow:0_1px_1px_var(--white-highlight-medium)] [font-variant:small-caps]">
          Gabriele's Travel Chronicles
        </h1>
        <p className="font-serif text-sm italic text-[var(--brown-medium)] [text-shadow:0_0.5px_0.5px_var(--white-highlight)]">
          Postcards from Around the World
        </p>
      </div>
    </div>
  );
};
export default Nameplate;
