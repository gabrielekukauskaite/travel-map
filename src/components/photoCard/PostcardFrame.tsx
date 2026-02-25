import type { CSSProperties, ReactNode } from "react";

const POSTCARD_AIRMAIL_BACKGROUND_IMAGE =
  "repeating-linear-gradient(45deg, #a84448 0px, #a84448 15px, #547aa5 15px, #547aa5 30px, #e8ddc4 30px, #e8ddc4 45px)";

const POSTCARD_PAPER_TEXTURE_URL =
  "https://www.transparenttextures.com/patterns/cream-paper.png";

const postcardAirmailFrameStyle: CSSProperties = {
  backgroundImage: POSTCARD_AIRMAIL_BACKGROUND_IMAGE,
};

const postcardPaperStyle: CSSProperties = {
  backgroundImage: `url(${POSTCARD_PAPER_TEXTURE_URL})`,
  backgroundColor: "var(--parchment-light)",
};

const postcardOuterClassName =
  "inline-block border-2 rounded-sm border-[var(--brown-dark)] p-1 sm:p-2 relative";

const postcardInnerClassName =
  "relative overflow-hidden border border-[var(--brown-light)] rounded-sm p-1 sm:p-2";

interface PostcardFrameProps {
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;
  outerStyle?: CSSProperties;
  innerStyle?: CSSProperties;
}

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

const PostcardFrame = ({
  children,
  outerClassName,
  innerClassName,
  outerStyle,
  innerStyle,
}: PostcardFrameProps) => {
  return (
    <div
      className={cx(postcardOuterClassName, outerClassName)}
      style={{ ...postcardAirmailFrameStyle, ...outerStyle }}
    >
      <div
        className={cx(postcardInnerClassName, innerClassName)}
        style={{ ...postcardPaperStyle, ...innerStyle }}
      >
        {children}
      </div>
    </div>
  );
};

export default PostcardFrame;
