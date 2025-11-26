'use client'
import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Bundle } from '@/types/bundle.types'

const BundleDetailHeader = ({ bundle, subscription = false }: { bundle: Bundle, subscription?: boolean }) => {
    const router = useRouter()

    const totalDiscount = bundle.totalOriginalPrice - bundle.totalFirstDiscountedPrice
    const discountPercent = ((totalDiscount / bundle.totalOriginalPrice) * 100).toFixed(0)

    return (
        <div className='w-full bg-primary-dark rounded-b-xl px-4 py-6'>
            <div className='flex items-start gap-4'>
                <button
                    onClick={() => {
                        if (subscription) router.push('/bundles/me')
                        else router.back()
                    }}
                    className='w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition'
                >
                    <ChevronLeft />
                </button>
                <div>
                    <h5 className='text-xl font-normal text-white'>{bundle.name}</h5>
                    <p className='text-base text-white mt-1'>{bundle.description}</p>
                </div>
            </div>
            <div className='w-full flex items-start justify-between mt-4'>
                <div className='flex flex-col'>
                    <small className='text-white'>You Pay</small>
                    <div className='flex items-center gap-4 mt-1'>
                        <p className='text-white font-normal text-base line-through'>
                            ${bundle.totalOriginalPrice.toFixed(2)}
                        </p>
                        <p className='text-white font-semibold text-base'>
                            ${bundle.totalFirstDiscountedPrice.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <small className='text-white'>You Save</small>
                    <div className='flex items-center gap-4 mt-1'>
                        <p className='text-white font-semibold text-base'>
                            ${totalDiscount.toFixed(2)}
                            <small className='ms-1'>({discountPercent}%)</small>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BundleDetailHeader
