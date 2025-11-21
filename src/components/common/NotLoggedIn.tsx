import React from 'react'

const NotLoggedIn = () => {
    return (
        <div className='w-full flex flex-col  gap-4 items-center justify-center'>
            <h2 className='text-lg lg:text-xl text-black text-center'>Connect Your Wallet</h2>
            <p className='text-base text-foreground text-center'>
                Wallet is connected please sign a message to login
            </p>
        </div>
    )
}

export default NotLoggedIn