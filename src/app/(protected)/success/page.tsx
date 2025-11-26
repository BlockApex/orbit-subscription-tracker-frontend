"use client";
import { Button } from '@/components/common/Button'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const SuccessPage = () => {
    const router = useRouter();
    return (
        <main className="w-full h-screen bg-gray-50 relative overflow-hidden p-4">
            <div className='w-full min-h-screen flex flex-col items-center justify-center gap-4'>
                <Image src='/assets/success.svg' alt='Success' width={100} height={100} />
                <h3 className='text-2xl text-black'>You&apos;re all set!</h3>
                <p className='text-base text-foreground text-center'>
                    You&apos;ve added 5 subscriptions. You can always add more later.
                </p>

                <div className='w-full flex flex-col gap-4'>
                    <section className='w-full border border-gray-200 rounded-xl p-4 flex items-start gap-4'>
                        <Image src='/assets/no-data.png' alt='Subscription Example' width={50} height={50} />
                        <div>
                            <h4 className='text-lg text-black'>Track your spending</h4>
                            <p className='text-base text-foreground text-left'>
                                See insights and trends
                            </p>
                        </div>
                    </section>
                    <section className='w-full border border-gray-200 rounded-xl p-4 flex items-start gap-4'>
                        <Image src='/assets/no-data.png' alt='Subscription Example' width={50} height={50} />
                        <div>
                            <h4 className='text-lg text-black'>Never miss a payment</h4>
                            <p className='text-base text-foreground text-left'>
                                Get timely reminders
                            </p>
                        </div>
                    </section>
                </div>
            </div>
            <div className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center gap-4 fixed bottom-2 left-0 right-0 p-2">
                <Button
                    onClick={() => router.push('/dashboard')}
                    variant="primary"
                    size="full"
                    className="flex items-center gap-4"
                >
                    Go to Dashboard  <ArrowRight size={17} />
                </Button>
            </div>
        </main>
    )
}

export default SuccessPage