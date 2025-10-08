"use client";

import Image from "next/image";
import { useState } from "react";

function Style({
  image,
  selectStyle,
  isSelected,
}: {
  image: string;
  selectStyle: () => void;
  isSelected: boolean;
}) {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        onClick={selectStyle}
        className={`relative w-fit cursor-pointer transition-all hover:scale-105 ${
          isSelected
            ? "border-foreground scale-105 rounded-xl border-2 shadow-sm"
            : ""
        }`}
      >
        {(mouseOver || isSelected) && (
          <>
            <div className="absolute -top-4 -right-6 h-4 w-4 -rotate-45 border-t border-black"></div>
            <div className="absolute -top-6 -right-3 h-4 w-4 rotate-[-75deg] border-t border-black"></div>
            <div className="absolute -top-0 -right-7 h-4 w-4 rotate-[-20deg] border-t border-black"></div>
            <div className="absolute -bottom-6 -left-4 h-4 w-4 -rotate-45 border-t border-black"></div>
            <div className="absolute -bottom-3 -left-6 h-4 w-4 rotate-[-20deg] border-t border-black"></div>
            <div className="absolute -bottom-7 -left-0 h-4 w-4 rotate-[-75deg] border-t border-black"></div>
          </>
        )}
        <Image
          className="min-w-52 rounded-lg"
          src={image}
          alt={image}
          height={250}
          width={300}
        />
      </div>
    </>
  );
}

export default Style;
