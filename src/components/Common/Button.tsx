import { FC, ReactNode } from "react";

const Button: FC<{
  style: "inverted" | "normal";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ style, children, onClick, className }) => {
  return (
    <button
      className={
        `rounded-md p-4 transition-opacity duration-300 hover:opacity-80 ` +
        `${style === "normal" && "bg-white text-black"} ` +
        `${style === "inverted" && "bg-black text-white"} ` +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
