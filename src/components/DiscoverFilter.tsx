"use client"
import React, { useState } from 'react'
import { Modal } from './common/Modal';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import Input from './common/Input';
import { perks } from '../config';
import Slider from './common/RangeSlider';
import { Button } from './common/Button';
import { DiscoverFilterType } from '../types/bundle.types';






export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


interface DiscoverFilterProps {
    open: boolean;
    setOpen: (o: boolean) => void;
    applyFilter: (filter: DiscoverFilterType) => void
    categories: { id: number, label: string }[]
}

const DiscoverFilter: React.FC<DiscoverFilterProps> = ({ open, setOpen, applyFilter, categories }) => {
    const [category, setCategory] = useState({ id: 1, label: 'All' });
    const [perk, setPerk] = useState(perks[0]);
    const [discount, setDiscount] = useState(25);
    const [min, setMin] = useState("0");
    const [max, setMax] = useState("0");
    const [loading, setLoading] = useState(false);


    const handleFilter = () => {
        const filter = {
            category,
            perk,
            discount,
            min,
            max
        }
        applyFilter(filter)
        setOpen(false);
    }

    const handleReset = async () => {
        setLoading(true);
        await delay(500);
        const filter = {
            category: { id: 1, label: 'All' },
            perk,
            discount,
            min: '0',
            max: '0'
        }
        setMin('0');
        setMax('0');
        setCategory({ id: 1, label: 'All' });
        applyFilter(filter)
        setOpen(false);
        setLoading(false);
    }
    return (
        <Modal title='' isOpen={open} onClose={() => setOpen(false)} h={100}>
            <div className='w-full h-auto relative'>
                <section className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button
                            className={`w-10 h-10 rounded-full bg-dark flex items-center justify-center hover:bg-primary-100 transition`}

                        >
                            <ChevronLeft className='text-white' />
                        </button>
                        <h5 className={`text-xl font-normal text-black`}>
                            Filter
                        </h5>
                    </div>
                    <button className={`${loading ? "slow-spin" : ''}`} onClick={handleReset}>
                        <RefreshCw className='text-dark' />
                    </button>
                </section>
                <section className='w-full flex flex-col gap-3 h-auto p-2 mt-6'>
                    <p className='text-base text-black'>Price Range</p>
                    <div className='flex items-center justify-between gap-4'>
                        <Input value={min} onChange={(e) => setMin(e)} placeholder='Min' />
                        <Input value={max} onChange={(e) => setMax(e)} placeholder='Max' />
                    </div>
                    <p className='text-base text-black'>Discounts</p>
                    <Slider min={0} max={100} step={1} value={discount} onChange={setDiscount} />
                    <p className='text-base text-black'>Category</p>
                    <div className="w-full flex gap-3 items-center flex-wrap">
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setCategory(c)}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl border transition-all 
                                    ${category?.id === c.id
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "border-foreground text-black hover:bg-primary/20"
                                    }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                    <p className='text-base text-black'>Perks</p>
                    <div className="w-full flex gap-3 items-center flex-wrap">
                        {perks.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPerk(p)}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl border transition-all 
                                    ${perk.id === p.id
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "border-foreground text-black hover:bg-primary/20"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <br />
                    <Button onClick={handleFilter} variant='dark' size='full'>
                        Apply
                    </Button>
                </section>
            </div>
        </Modal>
    )
}

export default DiscoverFilter