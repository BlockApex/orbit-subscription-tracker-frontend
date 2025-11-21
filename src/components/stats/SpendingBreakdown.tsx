import Image from 'next/image'
import React from 'react'

const SpendingBreakdown = () => {
  return (
    <div className='w-full mt-4 bg-white p-4 rounded-xl'>
        <h3 className='text-xl text-black'>By Category</h3>
        <Image src='/assets/mock/pie.png' alt='pie' width={400} height={400} className='mt-4'/>
    </div>
  )
}

export default SpendingBreakdown