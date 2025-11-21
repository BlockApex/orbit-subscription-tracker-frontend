import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const btn = `bg-primary-web 
        ps-4 pe-2 py-3 
        rounded-2xl 
        text-base text-black 
        flex items-center gap-4 
        transition-all duration-200 ease-in-out
        hover:bg-primary-dark/80
        hover:scale-[1.02] 
        active:scale-[0.97]
        active:brightness-90`
const icn = `w-6 h-8 bg-white 
          flex items-center justify-center 
          rounded-full 
          transition-colors duration-200 
          group-hover:bg-white/30`


const data = [
    {
        title: 'Access wallet-native buyers',
        description: (
            <>
                Reach privacy-first users who prefer to subscribe with their <br className='hidden lg:flex' /> Solana wallets and stack apps for savings.
            </>
        )
    },
    {
        title: 'List once, get discovered',
        description: (
            <>
                Placement inside curated Bundles puts your app in front of <br className='hidden lg:flex' /> users actively building stacks to save.

            </>
        )
    },
    {
        title: 'You keep settlement flow',
        description: (
            <>
                Users pay direct from their wallets to you on Solana. Bundl never <br className='hidden lg:flex' />  holds funds or acts as a PSP.

            </>
        )
    },
    {
        title: 'Low-lift integration',
        description: (
            <>
                Use a lightweight Receipts API (unlock on verify) or drop-in <br className='hidden lg:flex' /> Web3/REST components. We automate renewals and receipts;  <br className='hidden lg:flex' /> you keep your existing systems.

            </>
        )
    },
]
const Merchant = () => {
    return (
        <div className='w-full h-auto max-w-full lg:max-w-screen-2xl mx-auto relative overflow-hidden px-4 lg:px-10 mt-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 lg:p-0'>
                <section className='w-full h-full ps-2 lg:ps-6' >
                    <h1 className='text-3xl lg:text-5xl font-normal text-black'>
                        Why merchants love <br className='hidden lg:flex' /> Bundl
                    </h1>
                    <p className='text-base text-foreground-web mt-4'>
                        Bundl empowers apps, creators, and SaaS platforms to accept wallet <br className='hidden lg:flex' /> payments and reach new users. Your customers stay in control, and <br className='hidden lg:flex' /> you get paid instantly in USDC.
                    </p>
                    <div className='mt-6 flex flex-col gap-4'>
                        {data.map((l, i) => {
                            return (
                                <div key={i} className='flex items-baseline gap-2'>
                                    <span className='block w-2 h-2 bg-primary-web'></span>
                                    <div className='ps-2'>
                                        <h6 className='text-lg font-semibold text-black'>{l.title}</h6>
                                        <p className='text-black text-base' >
                                            {l.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
                <section className='w-full flex flex-col items-center justify-center'>
                    <Image src='/assets/landing/merchant.png' alt='Merchant' width={600} height={800} />
                    <div className='mt-6'>
                        <div className='w-full flex items-center gap-4'>
                            <Link href='https://forms.gle/YRug8xQ4jK5mH1PL7' target='_blank'>

                                <button className={btn}>
                                    Become a Partner
                                    <span className={icn}>
                                        <ChevronRight size={20} />
                                    </span>
                                </button>
                            </Link>
                            <div className='px-6 py-2 border border-gray-300 rounded-xl'>
                                <Image src='/assets/landing/partner.svg' alt='icon' width={40} height={40} />
                            </div>
                        </div>
                        <br />
                        <div className='w-full flex items-center gap-4'>
                            <div className='px-6 py-2 border border-gray-300 rounded-xl'>
                                <Image src='/assets/landing/file.svg' alt='icon' width={30} height={30} />
                            </div>
                            <button className='px-6 py-4 rounded-2xl text-base text-black  border border-gray-100 bg-gray-100'>
                                Read Merchant Docs
                            </button>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Merchant