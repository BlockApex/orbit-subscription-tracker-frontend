import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Button from './Button'
import NavSm from './NavSm'

const Navbar = () => {
    return (
        <>

            <nav className='w-full max-w-7xl mx-auto h-auto p-4 hidden lg:block'>
                <div className='flex items-center justify-between gap-4'>
                    <section className='flex items-center gap-4'>
                        <Image src='/assets/landing/logo.svg' alt='Logo' width={60} height={60} />
                        <h2 className='text-3xl text-primary-web font-semibold'>Bundl</h2>
                    </section>
                    <section className='flex items-center gap-4'>
                        <Link href='/' className='text-base text-foreground-web'>
                            Home
                        </Link>
                        <Link href='/' className='text-base text-foreground-web'>
                            Features
                        </Link>
                        <Link href='/' className='text-base text-foreground-web'>
                            How it works
                        </Link>
                        <Link href='/' className='text-base text-foreground-web'>
                            Merchant
                        </Link>
                    </section>
                    <section>
                        <Link href='/app'>
                            <Button>
                                Launch dApp
                            </Button>
                        </Link>
                    </section>
                </div>
            </nav >
            <NavSm />
        </>
    )
}

export default Navbar