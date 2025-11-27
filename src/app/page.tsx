'use client'
import { Button } from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';
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
            if (step === steps.length - 1) {
                localStorage.setItem('hasSeenOnboard', 'true'); // Mark onboard as seen
                router.push('/auth');
                return;
            }
            setStep(prev => Math.min(prev + 1, steps.length - 1));
        } else {
            setStep(prev => Math.max(prev - 1, 0));
        }
    };

    const handleSkip = () => {
        localStorage.setItem('hasSeenOnboard', 'true'); // Mark onboard as seen
        router.push('/auth');
    }

    return (

        <main className={`w-full h-dvh bg-white relative overflow-hidden transition-colors duration-500 ${data.bg}`}>
            <div className='relative flex flex-col items-center justify-between h-full'>
                <div className="flex-1 flex items-center justify-center w-full max-h-[50%]">
                    <Image
                        src={data.image}
                        alt={data.title}
                        width={500}
                        height={500}
                        className='w-auto h-auto max-h-full object-contain lg:hidden'
                        priority
                    />
                    <Image src={data.image} alt={data.title} width={400} height={400} className='hidden lg:flex' />
                </div>

                <div className='flex flex-col items-center justify-between gap-6 w-full h-full  max-w-md py-4 px-4'>
                    <div className='flex flex-col items-center gap-6 mt-4'>
                        <div className='flex flex-col gap-3 text-center'>
                            <h2 className='text-2xl lg:text-3xl text-black font-bold leading-tight'>{data.title}</h2>
                            <p className='text-sm lg:text-base text-black/60 px-4'>{data.description}</p>
                        </div>

                        {/* Step indicators */}
                        <div className='flex items-center justify-center gap-2'>
                            {steps.map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-2 rounded-full block transition-all duration-300 ${step === i ? 'bg-primary w-8' : 'bg-gray-300 w-2'}`}
                                ></span>
                            ))}
                        </div>

                    </div>

                    <div className="w-full mt-2 flex flex-col items-center justify-center gap-4">
                        <Button
                            onClick={() => handleSlide('next')}
                            variant='primary'
                            size='full'
                            className='flex items-center justify-center gap-2 py-6 text-lg font-semibold'
                        >
                            {step === steps.length - 1 ? 'Get Started' : 'Continue'} <ArrowRight size={20} />
                        </Button>

                        <button onClick={handleSkip} className='text-base text-foreground'>Skip</button>
                    </div>
                </div>
            </div>
        </main>
    );

};

export default Onboard;
