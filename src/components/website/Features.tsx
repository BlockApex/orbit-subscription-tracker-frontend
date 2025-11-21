import React from 'react'
import Button from './Button'
import Image from 'next/image'
import Link from 'next/link'

const Features = () => {
    return (
        <div className='w-full h-auto max-w-screen-2xl mx-auto relative overflow-hidden p-4 mt-4 px-4 lg:px-10'>
            <section className='w-full flex flex-col lg:flex-row items-start lg:items-center justify-between'>
                <h1 className='text-3xl lg:text-5xl font-normal text-black'>
                    One place. One payment.
                    <br />
                    Unify your subscriptions.
                </h1>
                <br className='block lg:hidden' />
                <Link href='/app'>

                    <Button>
                        Launch dApp
                    </Button>
                </Link>
            </section>
            <section className="w-full h-auto lg:h-[600px] xl:h-[300px] grid grid-cols-12 gap-6 mt-8">
                {/* Left Feature */}
                <div className="col-span-12  xl:col-span-5 bg-primary-web/10 p-6 rounded-2xl relative">
                    <div className="flex flex-col justify-start lg:justify-between h-auto lg:h-full">
                        <h2 className="text-xl lg:text-3xl font-normal text-black">
                            One Monthly <br className='hidden lg:flex' /> Payment
                        </h2>

                        <p className="text-base text-foreground-web mt-2 lg:mt-0">
                            Less Mess More Control, <br className='hidden lg:flex' /> No Surprise Renewals
                        </p>
                    </div>
                    <div className="relative lg:absolute bottom-0 right-0">
                        <Image
                            src="/assets/landing/features/1.png"
                            alt="One Monthly Payment"
                            width={300}
                            height={260}
                            className="object-contain mx-auto"
                        />
                    </div>
                </div>

                {/* Right Feature */}
                <div className="col-span-12 xl:col-span-7  bg-primary-web/10 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex flex-col justify-start lg:justify-between h-auto lg:h-full">
                        <h2 className="text-xl lg:text-3xl font-normal text-black">
                            Your idle funds
                            <br className='hidden lg:flex' />
                            cut your bill
                        </h2>

                        <p className="text-base text-foreground-web mt-2 lg:mt-0">
                            Deposit once; your idle funds will <br className='hidden lg:flex' /> earn yields that automatically reduce your bill.
                        </p>
                    </div>
                    <div className="relative lg:absolute bottom-0 right-0">
                        <Image
                            src="/assets/landing/features/2.png"
                            alt="Cut Your Bill"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>
            <section className="w-full h-auto lg:h-[600px] xl:h-[300px] grid grid-cols-12 gap-6 mt-8">
                {/* Left Feature */}
                <div className="col-span-12 xl:col-span-7  bg-primary-web/10 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex flex-col justify-start lg:justify-between h-auto lg:h-full">
                        <h2 className="text-xl lg:text-3xl font-normal text-black">
                            Track everything, <br className='hidden lg:flex' /> on or off Bundl
                        </h2>

                        <p className="text-base text-foreground-web mt-2 lg:mt-0 pe-6">
                            Skip the spreadsheet. See every subscription <br className='hidden lg:flex' />and bill in one place, whether you pay through Bundl or not.
                        </p>
                    </div>
                    <div className="relative lg:absolute bottom-0 right-0">
                        <Image
                            src="/assets/landing/features/3.svg"
                            alt="Your idle funds cut your bill"
                            width={300}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>
                {/* Right Feature */}
                <div className="col-span-12  xl:col-span-5 bg-primary-web/10 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex flex-col justify-start lg:justify-between h-auto lg:h-full">
                        <h2 className="text-xl lg:text-3xl font-normal text-black">
                            Save more with <br className='hidden lg:flex' />Bundles
                        </h2>

                        <p className="text-base text-foreground-web mt-2 lg:mt-0">
                            Add More, Save More,
                            <br className='hidden lg:flex' />
                            Preset or Custom Bundle
                        </p>
                    </div>
                    <div className="relative lg:absolute bottom-4 right-4">
                        <Image
                            src="/assets/landing/features/4.png"
                            alt="Save more with Bundles"
                            width={300}
                            height={200}
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>

            <section className='w-full p-4 lg:p-0 rounded-2xl bg-[#6D45FF] mt-10 flex flex-col lg:flex-row items-center justify-center gap-6'>
                <h2 className="text-xl lg:text-3xl font-normal text-white text-center">
                    Powered by Arcium
                </h2>
                <Image
                    src="/assets/landing/features/shield.svg"
                    alt="Cut Your Bill"
                    width={400}
                    height={400}
                    className="object-contain"
                />
                <p className="text-base text-white text-center">
                    Apps verify you’ve paid your wallet and <br /> other subscription stay hidden
                </p>
            </section>
        </div>
    )
}

export default Features