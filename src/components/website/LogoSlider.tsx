"use client";
import Image from "next/image";
import React from "react";

const data = [
  "/assets/landing/hero/icons/1.svg",
  "/assets/landing/hero/icons/2.svg",
  "/assets/landing/hero/icons/3.svg",
  "/assets/landing/hero/icons/4.svg",
  "/assets/landing/hero/icons/5.svg",
  "/assets/landing/hero/icons/6.svg",
];

const LogoSlider = () => {
  return (
    <div className="relative w-full overflow-hidden py-8 bg-transparent">
      {/* Track */}
      <div className="flex w-max animate-marquee-smooth">
        {[...data, ...data].map((src, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-w-[60px] mx-4"
          >
            <Image
              src={src}
              alt={`Logo ${i + 1}`}
              width={50}
              height={50}
              className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoSlider;
