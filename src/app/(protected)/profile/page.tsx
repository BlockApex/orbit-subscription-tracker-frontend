"use client"
import AppLayout from '@/components/common/AppLayout'
import { Button } from '@/components/common/Button'
import { Bell, ChevronRight, DollarSign, Download, Info, LogOut, Map, Moon, Shield, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


const routes = [
    {
        title: 'Personal Information',
        icon: User,
        link: ''
    },
    {
        title: 'Currency',
        icon: DollarSign,
        link: ''
    },
    {
        title: 'Notification Preferences',
        icon: Bell,
        link: ''
    },
    {
        title: 'App Theme',
        icon: Moon,
        link: ''
    },
    {
        title: 'Security & Privacy',
        icon: Shield,
        link: ''
    },
    {
        title: 'Language & Region',
        icon: Map,
        link: ''
    },
    {
        title: 'Help & Support',
        icon: Info,
        link: ''
    },
]

const Profile = () => {

    const handleLogout = () => {
        // Clear localStorage and redirect to login page
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
    }
    return (
        <AppLayout showTopbar={false}>
            <main className="w-full min-h-screen relative overflow-hidden p-4 pb-12">
                <div className='w-full mt-4 bg-white p-4 rounded-xl'>
                    <div className='flex items-center gap-2' >
                        <Image src='/assets/mock/user.png' alt='User' width={50} height={50} className='rounded-full' />
                        <div className='flex flex-col'>
                            <h6 className='text-lg text-black font-normal'> Syed Mujtaba </h6>
                            <p className='text-base text-foreground font-normal'>alex.morgan@email.com</p>
                        </div>
                    </div>
                    <hr className='broder-b border-gray-200 my-4' />
                    <div className='flex items-start gap-10'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-base text-black'>12</p>
                            <p className='text-base text-foreground'>Active</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-base text-black'>$250</p>
                            <p className='text-base text-foreground'>Monthly</p>
                        </div>
                    </div>
                </div>

                <div className='w-full p-2 mt-6'>
                    <p className='text-base text-foreground'>Settings</p>
                    <div className='flex flex-col gap-3 mt-4'>
                        {routes.map(({ icon: Icon, title }, i) => {
                            return (
                                <div key={i} className='w-full bg-white rounded-2xl flex items-center justify-between px-4 py-5'>
                                    <div className='flex items-center gap-3'>
                                        <Icon className='text-base text-foreground' />
                                        <p className='text-base text-black'>{title}</p>
                                    </div>
                                    <button>
                                        <ChevronRight className='text-base text-foreground' />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <p className='text-base text-foreground my-4'>Data</p>

                    <div className='w-full bg-white rounded-2xl flex items-center justify-between px-4 py-5'>
                        <div className='flex items-center gap-3'>
                            <Download className='text-base text-foreground' />
                            <div>
                                <p className='text-base text-black'>Export Subscriptions</p>
                                <small className='text-sm text-foreground'>
                                    Download your data as JSON
                                </small>
                            </div>
                        </div>

                    </div>


                    <Button variant='danger' size='full' className='flex items-center gap-4 mt-6' onClick={handleLogout} ><LogOut/> Logout</Button>
                </div>
            </main>
        </AppLayout>
    )
}

export default Profile