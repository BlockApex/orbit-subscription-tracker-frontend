import { TrendingUp } from 'lucide-react'
import React from 'react'

const AnnualForecast = () => {
    return (
        <div className='w-full mt-4 p-4 '>
            <h3 className='text-xl text-black'>Annual Forecast</h3>
            <div className='w-full bg-danger/20 rounded-xl p-4 mt-4'>
                <p className='text-danger flex items-center gap-2'><TrendingUp /> 12-Month Projection</p>
                <h2 className='text-3xl text-black mt-6'>€1823.16</h2>
                <p className='text-base text-foreground mt-2'>
                    Based on 8 active subscriptions
                </p>
            </div>
        </div>

    )
}

export default AnnualForecast