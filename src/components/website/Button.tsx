import { ChevronRight } from 'lucide-react';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  dark?: boolean;
  onClick?: () => void
};

const Button: React.FC<ButtonProps> = ({ children, dark = false, onClick }) => {
  return (
    <button
      className={`
        ${dark ? 'bg-black' : 'bg-primary-dark'} 
        ps-4 pe-2 py-3 
        rounded-2xl 
        text-base text-white 
        flex items-center gap-4 
        transition-all duration-200 ease-in-out
        hover:${dark ? 'bg-gray-800' : 'bg-primary-dark/80'}
        hover:scale-[1.02] 
        active:scale-[0.97]
        active:brightness-90
      `}
      onClick={onClick}
    >
      {children}
      <span
        className={`
          w-6 h-8 
          flex items-center justify-center 
          rounded-full 
          transition-colors duration-200
          ${dark ? 'bg-primary-web' : 'bg-primary/50'}
        `}
      >
        <ChevronRight size={20} />
      </span>
    </button>
  );
};

export default Button;
