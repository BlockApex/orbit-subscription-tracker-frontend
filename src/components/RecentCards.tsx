import React from 'react'
import Card from './Card'

const RecentCards = () => {
    return (
        <div className='w-full h-auto relative my-6'>
            <section className='w-full flex items-center justify-between'>
                <h5 className={`text-xl font-normal text-black`}>
                    Subscription Smart Card
                </h5>
            </section>
            <section className="w-full flex items-center gap-4 mt-4 overflow-x-auto scrollbar-hide px-2">
                {Array(6)
                    .fill(0)
                    .map((_, i) => (
                        <Card key={i} />
                    ))}
            </section>

        </div>
    )
}

export default RecentCards