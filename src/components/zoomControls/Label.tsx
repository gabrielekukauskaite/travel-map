const Label = () => {
  return (
    <div className="relative justify-self-center px-[14px] py-1 mt-2 mb-4 text-[#5a4a38] border border-black/40 rounded-[20px] font-serif font-medium text-[0.95rem] tracking-[0.08em] text-center whitespace-nowrap pointer-events-none bg-[linear-gradient(180deg,#faf6ed_0%,#f0e8d4_50%,#e8ddc4_100%)] shadow-[inset_0_0_0_1px_rgba(255,248,230,0.3),0_0_8px_rgba(0,0,0,0.1)] [font-variant:small-caps]">
      {/* Left dot */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[#8b6f47] shadow-[0_0_1px_rgba(0,0,0,0.3)]" />
      {/* Right dot */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[#8b6f47] shadow-[0_0_1px_rgba(0,0,0,0.3)]" />
      Select a continent to explore
    </div>
  );
};

export default Label;
