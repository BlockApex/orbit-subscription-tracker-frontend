"use client";
import { Button } from '@/components/common/Button'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const SuccessPage = () => {
    const router = useRouter();
    return (

        <main className="w-full h-dvh bg-gray-50 relative overflow-hidden p-4 flex flex-col items-center justify-between">
            <div className='w-full flex-1 flex flex-col items-center justify-center gap-6 overflow-y-auto'>
                <div className="flex flex-col items-center gap-4 text-center">
                    <Image src='/assets/success.svg' alt='Success' width={100} height={100} className="w-24 h-24" />
                    <div className="space-y-2">
                        <h3 className='text-2xl font-normal text-black'>You&apos;re all set!</h3>
                        <p className='text-sm text-foreground max-w-[280px] mx-auto'>
                            You&apos;ve added subscriptions. You can always add more later.
                        </p>
                    </div>
                </div>

                <div className='w-full max-w-sm flex flex-col gap-3 px-2'>
                    <section className='w-full  border border-gray-200 rounded-xl p-4 flex items-center gap-4 '>
                        <div className="shrink-0">
                            <Image src='/assets/success/1.png' alt='Subscription Example' width={40} height={40} />
                        </div>
                        <div>
                            <h4 className='text-base font-normal text-black'>Track your spending</h4>
                            <p className='text-xs text-foreground'>
                                See insights and trends
                            </p>
                        </div>
                    </section>
                    <section className='w-full border border-gray-200 rounded-xl p-4 flex items-center gap-4 '>
                        <div className="shrink-0">
                            <Image src='/assets/success/2.png' alt='Subscription Example' width={40} height={40} />
                        </div>
                        <div>
                            <h4 className='text-base font-normal text-black'>Never miss a payment</h4>
                            <p className='text-xs text-foreground'>
                                Get timely reminders
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            <div className="w-full max-w-md pt-4">
                <Button
                    onClick={() => router.push('/dashboard')}
                    variant="primary"
                    size="full"
                    className="flex items-center justify-center gap-2 py-6 text-lg"
                >
                    Go to Dashboard  <ArrowRight size={20} />
                </Button>
            </div>
        </main>
    )

}

export default SuccessPage