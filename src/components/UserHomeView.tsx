import { DollarSign } from 'lucide-react'
import React from 'react'

const UserHomeView = () => {
    return (
        <div className='w-full h-full p-4 stats-bg'>
            <small className='text-sm text-black flex items-center gap-1' ><DollarSign size={15} /> Total Monthly Spend</small>
            <div className='mt-6'>
                <h1 className='text-5xl text-black font-normal'>
                    $00.00
                </h1>
                <section className='w-full flex items-center justify-between mt-4'>
                    <p className='text-base text-black'>
                        $00/year
                    </p>
                    <div className='flex items-center gap-2'>
                        <p className='text-base text-black'>You're spending on</p>
                        <span className='py-1 px-3 rounded-2xl border border-white/50'>
                            <span className='w-2 h-2 rounded-full bg-white'></span>
                         0 Subs</span>
                    </div>
                </section>
            </div>
        </div>

    )
}

export default UserHomeView