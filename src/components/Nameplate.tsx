const Nameplate = () => {
  return (
    <div className="absolute top-10 sm:top-15 left-1/2 -translate-x-1/2 z-20 w-[calc(100vw-8rem)] sm:w-[500px] max-w-[500px] h-auto min-h-[85px] border-2 border-[var(--brown-medium)] rounded-[25px] p-2 text-center bg-[var(--parchment-light)] [filter:drop-shadow(0_4px_8px_var(--shadow-dark))]">
      {/* Inner border decoration */}
      <div className="absolute top-2 left-2 right-2 bottom-2 border-[0.8px] border-[var(--brown-light)] rounded-[20px] opacity-40 pointer-events-none" />

      {/* Decorative corner elements */}
      <div className="absolute top-2 left-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
      <div className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
      <div className="absolute bottom-2 left-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />
      <div className="absolute bottom-2 right-2 w-[5px] h-[5px] rounded-full bg-[var(--brown-light)] opacity-50" />

      {/* Text content */}
      <div className="relative p-[5px]">
        <h1 className="text-2xl font-semibold tracking-wider text-[var(--brown-dark)] leading-tight [text-shadow:0_1px_1px_var(--white-highlight-medium)] [font-variant:small-caps]">
          Gabriele's Travel Chronicles
        </h1>
        <p className="text-base italic text-[var(--brown-medium)] [text-shadow:0_0.5px_0.5px_var(--white-highlight)]">
          Postcards from Around the World
        </p>
      </div>
    </div>
  );
};
export default Nameplate;
