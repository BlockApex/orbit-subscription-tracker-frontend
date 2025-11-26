"use client"
import { useAuthStore } from '@/store/authStore'
import { Bell } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const TopBar = () => {
    const { user } = useAuthStore();
    return (
        <div className='w-full bg-[#F5F5F5] z-50 lg:max-w-3xl mx-auto flex items-center justify-between gap-4 sticky top-0 left-0 right-0 p-4'>
            <Link href='/profile' className='flex items-center gap-2' >
                <Image src='/assets/mock/user.png' alt='User' width={50} height={50} className='rounded-full' />
                <div className='flex flex-col'>
                    <p className='text-base text-foreground font-normal'>Hey,👋</p>
                    {user && <h6 className='text-lg text-black font-normal'> {user.name} </h6>}
                </div>
            </Link>
            <section>
                <button className='flex items-center justify-center relative'>
                    <Bell />
                    <span className='w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0' />
                </button>
            </section>
        </div>
    )
}

export default TopBar