"use client"
import { Button } from '@/components/common/Button'
import Switch from '@/components/common/Switch'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const SubscriptionDetail = () => {
    return (
        <main className="w-full min-h-screen relative overflow-hidden p-4">
            <section className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <ArrowLeft />
                    <p className='text-lg text-black'>Subscription Detail</p>
                </div>
                <button className='px-4 py-2 bg-primary/30 rounded-xl text-primary'>Edit</button>
            </section>
            <br />
            <div className='subs-card-bg p-4 mt-4'>
                <section className='flex items-center justify-between'>
                    <div className='flex items-start gap-4'>
                        <Image src='/assets/mock/companies/4.png' alt='Subscription Image' width={60} height={60} className='rounded-xl' />
                        <div>
                            <h6 className='text-lg text-black'>Netflix</h6>
                            <p className='text-base text-foreground'>Entertainment</p>
                        </div>
                    </div>
                    <p className='text-sm text-foreground flex items-center gap-2'>Bank <span className='w-1 h-1 rounded-full bg-foreground inline-block' /> Auto-synced</p>
                </section>
                <section className='flex items-center justify-between mt-8'>
                    <h1 className='text-4xl text-black'>$15.99/ mo</h1>
                    <button className='px-3 py-1 text-black border border-black rounded-2xl'>Inactive</button>
                </section>
            </div>

            <div className='w-full p-2 mt-4'>
                <h3 className='text-2xl text-black mb-4'>Overview</h3>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-base text-foreground'>Billing Cycle</p>
                    <p className='text-base text-foreground'>Monthly</p>
                </div>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-base text-foreground'>Next Renewal Date</p>
                    <p className='text-base text-foreground'> 1 Oct , 2025</p>
                </div>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-base text-foreground'>Payment Method</p>
                    <p className='text-base text-foreground'> MasterCard</p>
                </div>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-base text-foreground'>Category</p>
                    <p className='text-base text-foreground'> 🎵 Entertainment </p>
                </div>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-base text-foreground'>Active</p>
                    <Switch checked={false} onChange={() => null} />
                </div>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-base text-foreground'>Notifications</p>
                    <Switch checked={false} onChange={() => null} />
                </div>
            </div>

            <div className='w-full  p-2 mt-4'>
                <h3 className='text-2xl text-black mb-4'>Billing History</h3>
                <div className='w-full h-[200px] overflow-y-scroll'>
                    <div className='flex items-center justify-between mb-3 border-b border-foreground pb-3'>
                        <p className='text-base text-foreground'>13 Jun 2025</p>
                        <p className='text-base text-black'>$15.99</p>
                    </div>
                    <div className='flex items-center justify-between mb-3 border-b border-foreground pb-3'>
                        <p className='text-base text-foreground'>13 Jun 2025</p>
                        <p className='text-base text-black'>$15.99</p>
                    </div>
                    <div className='flex items-center justify-between mb-3 border-b border-foreground pb-3'>
                        <p className='text-base text-foreground'>13 Jun 2025</p>
                        <p className='text-base text-black'>$15.99</p>
                    </div>

                </div>

            </div>


            <div className='flex flex-col items-center gap-4'>
                <Button variant='primary' size='full'>Mark as Inactive</Button>
                <Button variant='outline' size='full'>Delete Sub</Button>
            </div>
        </main>
    )
}

export default SubscriptionDetail