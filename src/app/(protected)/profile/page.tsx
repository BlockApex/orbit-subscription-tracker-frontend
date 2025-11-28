"use client"
import AppLayout from '@/components/common/AppLayout'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { getUserSpend } from '@/services/auth.service'
import { getMySubscriptions } from '@/services/subscription.service'
import { useAuthStore } from '@/store/authStore'
import { Bell, ChevronRight, DollarSign, Download, Info, LogOut, Map, Moon, Shield, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


interface UserSpendResponse {
    scaledMonthlySpend: string;
    scaledYearlySpend: string;
    totalSubscriptions: number;
}


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
    // {
    //     title: 'Notification Preferences',
    //     icon: Bell,
    //     link: ''
    // },
    // {
    //     title: 'App Theme',
    //     icon: Moon,
    //     link: ''
    // },
    // {
    //     title: 'Security & Privacy',
    //     icon: Shield,
    //     link: ''
    // },
    // {
    //     title: 'Language & Region',
    //     icon: Map,
    //     link: ''
    // },
    // {
    //     title: 'Help & Support',
    //     icon: Info,
    //     link: ''
    // },
]

const Profile = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [spend, setSpend] = useState<UserSpendResponse | null>(null);
    const [count, setCount] = useState<null | number>(null);
    useEffect(() => {
        const fetchSpend = async () => {
            try {
                setLoading(true);
                const res = await getUserSpend();
                const subs_response = await getMySubscriptions();
                setSpend({
                    scaledMonthlySpend: res.scaledMonthlySpend,
                    scaledYearlySpend: res.scaledYearlySpend,
                    totalSubscriptions: res.totalSubscriptions,
                });
                setCount(subs_response.length);
            } catch (err) {
                console.error('Failed to fetch spend:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpend();
    }, []);


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
                            {user && <h6 className='text-lg text-black font-normal'> {user.name} </h6>}
                            {user && <p className='text-base text-foreground font-normal'>{user.email}</p>}
                        </div>
                    </div>
                    <hr className='broder-b border-gray-200 my-4' />
                    <div className='flex items-start gap-10'>
                        <div className='flex flex-col gap-2'>

                            {count ? (
                                <p className='text-base text-black'>
                                    {count}
                                </p>
                            ) : ''}
                            {loading ? (
                                <Spinner size='sm' />
                            ) : ''}
                            <p className='text-base text-foreground'>Active</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            {spend ? (
                                <p className='text-base text-black'>
                                    ${Number(spend.scaledMonthlySpend).toLocaleString()}
                                </p>
                            ) : ''}
                            {loading ? (
                                <Spinner size='sm' />
                            ) : ''}
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
                    {/* <p className='text-base text-foreground my-4'>Data</p>

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

                    </div> */}

                    <div className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center gap-4 fixed bottom-22 left-0 right-0 p-2">
                        <Button variant='danger' size='full' className='flex items-center gap-4 mt-6' onClick={handleLogout} ><LogOut /> Logout</Button>
                    </div>
                </div>
            </main>
        </AppLayout>
    )
}

export default Profile