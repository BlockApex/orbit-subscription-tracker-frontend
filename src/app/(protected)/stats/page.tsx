import AppLayout from '@/components/common/AppLayout'
import AnnualForecast from '@/components/stats/AnnualForecast'
import BillingCycle from '@/components/stats/BillingCycle'
import SpendingBreakdown from '@/components/stats/SpendingBreakdown'
import TopSubscriptions from '@/components/stats/TopSubscriptions'
import { Calendar } from 'lucide-react'
import React from 'react'

const Stats = () => {
    return (
        <AppLayout showTopbar={false}>
            <main className="w-full min-h-screen relative overflow-hidden p-4 pb-12">
                <p className='text-base text-foreground'>Spending Breakdown</p>
                <SpendingBreakdown />
                <BillingCycle />
                <AnnualForecast />
                <section className='flex items-center gap-4 mt-4'>
                    <div className='w-full border border-gray-200 p-4 rounded-xl bg-white'>
                        <p className='text-foreground text-base flex items-center gap-2'><Calendar size={17} /> Next 30 Days</p>
                        <h2 className='text-2xl text-black mt-6'>
                            €151.93
                        </h2>
                    </div>
                    <div className='w-full border border-gray-200 p-4 rounded-xl bg-white'>
                        <p className='text-foreground text-base flex items-center gap-2'><Calendar size={17} /> Next 3 Months</p>
                        <h2 className='text-2xl text-black mt-6'>
                            €151.93
                        </h2>
                    </div>
                </section>
                <TopSubscriptions />
            </main>
        </AppLayout>
    )
}

export default Stats