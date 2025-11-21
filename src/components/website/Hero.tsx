"use client"
import Image from 'next/image'
import React from 'react'
import Lottie from 'lottie-react'
import EmailInput from './EmailInput'
import LogoSlider from './LogoSlider'
import AnimatedText from './AnimatedText'
import heroAnimation from '../mob.json'

const Hero = () => {

    return (
        <div className='w-full max-w-full xl:max-w-7xl mx-auto h-auto overflow-hidden py-6 mt-6 px-4 lg:px-10'>
            <div className='grid grid-cols-1 lg:grid-cols-3'>
                <section className='flex flex-col items-center lg:items-end justify-center lg:justify-start py-10'>
                    <div>
                        <h1 className='text-3xl lg:text-4xl font-normal text-black text-center lg:text-right'>
                            Too many
                        </h1>
                        <AnimatedText />
                    </div>
                    <p className='text-lg text-foreground-web text-center lg:text-right w-full mt-4 lg:mt-10 p-4'>
                        Bundl helps you fund and manage all your subscriptions in one place, unlocking exclusive discounts while offsetting costs with yield on idle assets.
                    </p>
                </section>

                <section className='w-full flex flex-col gap-4 items-center justify-center '>
                    {/* ✅ Replaced Image with Lottie animation */}
                    <Lottie
                        animationData={heroAnimation}
                        loop
                        autoplay
                    // className='w-[90%]'
                    />
                    <Image src='/assets/landing/hero/solana.svg' alt='Solana Image' width={150} height={100} />
                </section>

                <section className='flex flex-col items-center lg:items-start justify-center lg:justify-start py-10'>
                    <LogoSlider />
                    <div className='mt-10 p-4 '>
                        <h1 className='text-5xl font-normal text-black text-left'>
                            Take back
                            <br />
                            control.
                        </h1>
                        <br />
                        <EmailInput

                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Hero
