import { MerchantType } from '@/app/import-subscriptions/manual/page';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface MerchantProps {
    c: MerchantType;
    handleOpenModal: (c: MerchantType) => void;
}

const Merchant: React.FC<MerchantProps> = ({ c, handleOpenModal }) => {
    return (
        <div
            key={c._id}
            className="w-full flex items-center justify-between border border-gray-300 p-4 rounded-xl cursor-pointer"
            onClick={() => handleOpenModal(c)}
        >
            <div className="flex items-center gap-2">
                <Image
                    src={c.logo!}
                    width={40}
                    height={40}
                    alt={c.name}
                    className="rounded-xl"
                    unoptimized
                />
                <p className='text-base text-black'>{c.name}
                    {/* <small className="text-sm text-foreground">
                        {c.website}
                    </small> */}
                </p>
            </div>
            <ChevronRight className="text-foreground" size={17} />
        </div>
    );
};

export default Merchant;
