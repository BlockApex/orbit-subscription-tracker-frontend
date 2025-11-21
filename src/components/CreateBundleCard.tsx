import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateBundleCard = () => {
    return (
        <div className='w-full h-auto p-4 rounded-xl border border-dashed border-gray-400'>
            <div className='w-10 h-10 bg-primary-50 border border-primary rounded-xl flex items-center justify-center mb-4'>
                <span className='text-xl'>📦</span>
            </div>
            <h5 className={`text-xl font-medium text-black`}>
                Build Your Own Bundle
            </h5>
            <p className='text-base text-foreground mt-1'>
                Bundle your favorite subscriptions. The more you bundle, the more you save.
            </p>
            <Link href='/create' className='text-base text-primary flex items-center gap-2 mt-4'>Get Started <ArrowRight size={16} /> </Link>
        </div>
    )
}

export default CreateBundleCard