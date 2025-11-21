import React from 'react'

const BillingCycle = () => {
    return (
        <div className='w-full mt-4 bg-white p-4 rounded-xl'>
            <h3 className='text-xl text-black'>By Billing Cycle</h3>

            <div className='bg-gray-200 p-4 mt-6 flex items-center justify-between rounded-xl'>
                <p className='text-base text-black'>Monthly</p>
                <p className='text-base text-black'>$151.93 /mo</p>
            </div>
        </div>
    )
}

export default BillingCycle