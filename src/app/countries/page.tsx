"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import CountryList from 'country-list-with-dial-code-and-flag';
import { ArrowRight, Search } from 'lucide-react';
import Input from '@/components/common/Input';
import { Button } from '@/components/common/Button';

const Countries = () => {
    const router = useRouter();
    const countries = CountryList.getAll();
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('');

    // Filter countries based on search input
    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="w-full min-h-screen bg-gray-50 relative overflow-hidden p-4">
            <div className='p-2'>
                <h5 className="text-xl font-normal text-black">
                    Country of Residence
                </h5>
                <p className='text-base text-foreground text-left mt-1'>We'll tailor payment connectors available in your region</p>
                <div className='w-full flex flex-col gap-4 mt-4'>
                    <Input
                        label=""
                        value={search}
                        onChange={setSearch}
                        placeholder="Search countries..."
                        className="text-black"
                        icon={<Search className="text-dark" />}
                    />
                    <div className='w-full max-h-[600px] lg:max-h-[500px] overflow-y-scroll flex flex-col gap-4'>
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((c, i) => {
                                const flag = c.flag;
                                const name = c.name;
                                const selected = c.code === country;

                                return (
                                    <div
                                        key={i}
                                        className={`w-full flex items-center justify-between border border-gray-300 p-4 rounded-xl ${selected ? 'bg-primary/30 b border-primary' : ''}`}
                                        onClick={() => setCountry(c.code)}
                                    >
                                        <p className='flex items-center gap-2'>{flag} <span className='ms-1'>{name}</span></p>
                                        {selected && <span className='w-5 h-5 bg-primary rounded-full flex items-center justify-center'>
                                            <span className='w-2 h-2 bg-white rounded-full'></span>
                                        </span>}
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-center text-gray-500 py-4">No countries found</p>
                        )}
                    </div>
                </div>

                <div className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center gap-4 fixed bottom-2 left-0 right-0 p-2">

                    <Button
                        onClick={() => router.push('/sources')}
                        variant='primary'
                        size='full'
                        className='flex items-center gap-4'
                    >
                        Continue <ArrowRight size={17} />
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default Countries
