import { TrendingUp, Wallet2 } from 'lucide-react'
import React from 'react'

const Balance = () => {
    return (
        <div className='w-full h-auto relative p-4'>
            <p className='text-base text-black font-normal'>Account Balance</p>
            <div className='w-full bg-primary rounded-lg p-4 mt-2 flex items-start justify-between'>
                <div className='flex flex-col gap-2'>
                    <h6 className='text-lg font-normal text-black mb-0 flex items-center gap-2'><Wallet2 size={18} /> Wallet Balance</h6>
                    <p className='text-base text-black font-normal p-0 my-0'>Regular balance for payments</p>
                </div>
                <h6 className='text-lg font-bold text-black mb-0 flex items-center gap-2'>USDC 150.00</h6>
            </div>
            <div className='w-full bg-primary/20 rounded-lg p-4 mt-4  '>
                <div className='flex items-start justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h6 className='text-lg font-normal text-black mb-0 flex items-center gap-2'><TrendingUp className='text-primary' size={18} />Smart Balance</h6>
                        <p className='text-sm text-black font-normal p-0 my-0'>Earning up to 8% APY • Covers subscriptions with yield</p>
                    </div>
                    <h6 className='text-lg font-normal text-black mb-0 flex items-center gap-2'>$500.00</h6>
                </div>
                <div className='w-full bg-primary/30 border border-primary rounded-xl p-4 mt-4'>
                    <p className='text-base text-primary font-semibold'>Deposit to Smart Balance</p>
                </div>
            </div>
        </div>
    )
}

export default Balance