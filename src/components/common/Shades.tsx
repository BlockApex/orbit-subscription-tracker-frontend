
import { Check } from 'lucide-react';
import React from 'react'


const shades = [
  "#119576", // warm amber
  "#FFBD15", // teal green
  "#944AEE", // rich coral red
  "#78D2FF", // cool blue-gray
  "#6DE4A2", // vibrant violet
  "#FF8D7E"  // bright mint green
];


interface ShadesProps {
    setShade: (s: string) => void;
    shade: string;
}




const Shades: React.FC<ShadesProps> = ({ setShade, shade }) => {



    const handleShade = (s: string) => {
        setShade(s === shade ? '' : s)
    }

    return (
        <div className='w-full relative h-auto my-2 ' >
            <div className='flex items-center justify-start gap-4' >
                {shades.map((s , i) => {
                    return (
                        <div key={i} onClick={() => handleShade(s)} className='w-14 h-14 transition-all duration-300 hover:scale-110 flex items-center justify-center rounded-lg border border-white cursor-pointer' style={{ backgroundColor: s }} >
                            {shade === s ? <Check className='w-6 h-6 text-white' /> : ''}
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Shades