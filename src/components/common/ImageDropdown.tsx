"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { BASE_URL } from '@/config';

interface PaymentRail {
  _id: string;
  name: string;
  icon: string;
}

interface Props {
  rails: PaymentRail[];
  selectedRailId: string | null;
  onSelect: (rail: PaymentRail) => void;
}

const ImageDropdown: React.FC<Props> = ({ rails, selectedRailId, onSelect }) => {
  const [open, setOpen] = useState(false);

  const selectedRail = rails.find(r => r._id === selectedRailId) || null;

  // Filter out rails with invalid icons
  const validRails = rails.filter(r => r.icon && r.icon.trim() !== '');

  const handleSelect = (rail: PaymentRail) => {
    onSelect(rail);
    setOpen(false);
  };

  return (
    <div className="relative max-w-[200px]">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full h-[40px] flex items-center justify-between rounded-lg border px-3 py-2 text-sm outline-none transition-all duration-200 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary
          ${open ? 'border-primary' : 'border-gray-300'}
        `}
      >
        <span className="flex items-center gap-2">
          {selectedRail && (
            <Image
              src={`${BASE_URL}${selectedRail.icon}`}
              alt={selectedRail.name}
              width={100}
              height={100}
              className="rounded"
            />
          )}
        </span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow z-10 max-h-60 overflow-auto">
          {validRails.map((rail) => (
            <button
              key={rail._id}
              onClick={() => handleSelect(rail)}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
            >
              <Image
                src={`${BASE_URL}${rail.icon}`}
                alt={rail.name}
                width={100}
                height={100}
                className="rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
