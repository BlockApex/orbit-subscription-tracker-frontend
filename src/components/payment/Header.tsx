'use client'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const PaymentHeader = () => {
    const router = useRouter()

    return (
        <div className='w-full bg-primary-dark rounded-b-xl px-4 py-6'>
            <div className='flex items-center gap-4'>
                <button
                    onClick={() => router.back()}
                    className='w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center'>
                    <ChevronLeft className='text-black' />
                </button>
                <div>
                    <h5 className={`text-xl font-normal text-white`}>
                        Payment
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default PaymentHeader