"use client";
import React, { useEffect, useState } from "react";

const textList = ["SUBSCRIPTIONS", "SURPRISES", "CHARGES"];

const AnimatedText = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // trigger fade out
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % textList.length);
        setFade(true);
      }, 300); // wait for fade-out before changing text
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 mt-4 bg-primary-web/30 rounded-xl">
      <h1
        className={`text-3xl lg:text-4xl font-normal text-black transition-all duration-500 ease-in-out  ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {textList[index]}
      </h1>
    </div>
  );
};

export default AnimatedText;
