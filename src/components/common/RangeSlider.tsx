import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, step = 1, value, onChange }) => {
  return (
    <div className="w-full flex items-center gap-4 px-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`
          w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer transition-all
          accent-primary-dark
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-6
          [&::-webkit-slider-thumb]:h-6
          [&::-webkit-slider-thumb]:bg-primary-dark
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-webkit-slider-thumb]:shadow-md
        `}
      />
      <span className="text-sm text-gray-500 w-10 text-right font-medium">{value.toFixed(1)}</span>
    </div>
  );
};

export default Slider;
