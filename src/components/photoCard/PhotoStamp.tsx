import { formatDate } from "../../utils/formatDate";

interface PhotoStampProps {
  title?: string;
  date?: string;
  className?: string;
}

const PhotoStamp = ({ title, date, className }: PhotoStampProps) => {
  return (
    <div
      className={`absolute bottom-3 left-3 rotate-[-1deg] border-2 border-[#a84448]/40 bg-[var(--parchment-light)]/85 backdrop-blur-sm font-mono uppercase self-start ${
        className ?? ""
      }`}
    >
      <p className="text-xs font-bold tracking-[0.2em] text-[#a84448]/80 px-3 pt-1.5 pb-1">
        {title || "Untitled Location"}
      </p>
      {date && (
        <>
          <div className="border-t border-[#a84448]/30" />
          <p className="text-[10px] tracking-widest text-[var(--brown-medium)]/70 px-3 pt-1 pb-1.5">
            {formatDate(date)}
          </p>
        </>
      )}
    </div>
  );
};

export default PhotoStamp;
