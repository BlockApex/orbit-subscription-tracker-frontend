'use client'
import { Button } from '@/components/common/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import React, { useState } from 'react';

const steps = [
    {
        image: '/assets/onboard/1.svg',
        title: `Know Where Your Money Goes`,
        description: `Track all your subscriptions in one beautiful place. See exactly what you're paying for and when.`,
    },
    {
        image: '/assets/onboard/2.svg',
        title: `Never Miss a Renewal Again`,
        description: `Get smart reminders before payments go through. Stay on top of every billing date.`,
        bg: 'bg-primary-web/40',
    },
    {
        image: '/assets/onboard/3.svg',
        title: `Stay in Control of All Your Subs`,
        description: `Spot unused subscriptions, track spending trends, and optimize your monthly budget.`,
        bg: 'bg-primary-web/60',
    }
];

const Onboard = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const data = steps[step];

    const handleSlide = (type: 'next' | 'prev') => {
        if (type === 'next') {
            if(step === steps.length - 1){
                router.push('/auth')
            }
            setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        } else {
            setStep((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

    return (
        <main className={`w-full min-h-screen bg-white relative overflow-hidden transition-colors duration-500 ${data.bg}`}>
            <div className='relative flex flex-col items-center justify-between gap-4'>
                <Image src={data.image} alt={data.title} width={500} height={700} />
                <div className='p-4 flex flex-col gap-4 mt-8'>
                    <h2 className='text-3xl text-black font-bold text-center'>{data.title}</h2>
                    <p className='text-base text-black/60 text-center'>{data.description}</p>
                </div>

                {/* Step indicators */}
                <div className='flex items-center justify-center gap-4'>
                    {steps.map((_, i) => (
                        <span
                            key={i}
                            className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full block transition-colors duration-300 ${step === i ? 'bg-primary w-10' : 'bg-foreground'}`}
                        ></span>
                    ))}
                </div>

                <div className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center gap-4 fixed bottom-2 left-0 right-0 p-2">
                    <Button
                        onClick={() => handleSlide('next')}
                        variant='primary'
                        size='full'
                        className='flex items-center gap-4'
                    >
                        {step === steps.length - 1 ? 'Get Started' : 'Continue'} <ArrowRight size={17} />
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default Onboard;
