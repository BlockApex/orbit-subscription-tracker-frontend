"use client"
import React, { useEffect, useState } from 'react'
import SubscriptionTabs from './SubscriptionTabs'
import { ListFilter, Plus } from 'lucide-react'
import Image from 'next/image'
import SubscriptionLine from './SubscriptionLine'
import { Button } from './common/Button'
import toast from 'react-hot-toast'
import { getMySubscriptions } from '@/services/subscription.service'

interface Subscription {
    image: string
    name: string
    price: string
    type: string
    end_at: string
    created_at: string
    status: 'active' | 'cancelled'
}

interface SubscriptionGroup {
    type: string
    subscriptions: Subscription[]
}

const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'cancelled', label: 'Cancelled' },
]

const data: SubscriptionGroup[] = [
    {
        type: "Coming up",
        subscriptions: [
            {
                image: '/assets/mock/companies/1.png',
                name: 'Cursor',
                price: '$15.99/ mo',
                type: 'Manual',
                end_at: 'Today',
                created_at: '19 Sep 2025',
                status: 'active'
            }
        ]
    },
    {
        type: "Due Soon",
        subscriptions: [
            {
                image: '/assets/mock/companies/2.png',
                name: 'ChatGpt',
                price: '$15.99/ mo',
                type: 'Manual',
                end_at: 'Today',
                created_at: '19 Sep 2025',
                status: 'active'
            },
            {
                image: '/assets/mock/companies/3.png',
                name: 'ChatGpt',
                price: '$15.99/ mo',
                type: 'Manual',
                end_at: 'Today',
                created_at: '19 Sep 2025',
                status: 'cancelled'
            },
            {
                image: '/assets/mock/companies/4.png',
                name: 'ChatGpt',
                price: '$15.99/ mo',
                type: 'Bank',
                end_at: 'Today',
                created_at: '19 Sep 2025',
                status: 'active'
            },
            {
                image: '/assets/mock/companies/5.png',
                name: 'ChatGpt',
                price: '$15.99/ mo',
                type: 'Manual',
                end_at: 'Today',
                created_at: '19 Sep 2025',
                status: 'cancelled'
            }
        ]
    }
]




const SubscriptionList = () => {
    const [tab, setTab] = useState<string>('all')
    const [loading, setLoading] = useState(true);


  // Fetch subscriptions data
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const data = await getMySubscriptions();
        console.log(data)
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);




    // Filter subscriptions based on active tab
    const filteredData = data.map(group => ({
        ...group,
        subscriptions: group.subscriptions.filter(sub =>
            tab === 'all' ? true : sub.status === tab
        )
    })).filter(group => group.subscriptions.length > 0)


    const renderImportType = (type: string) => {
        if (type === "Manual") {
            return (
                <span className='text-xs text-danger bg-danger/10 px-4 py-1 rounded-2xl flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-danger inline-block' /> Manual</span>
            )
        }
        return (
            <span className='text-xs text-success bg-success/10 px-4 py-1 rounded-2xl flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-success inline-block' /> Bank</span>
        )
    } 
    
    return (
        <div className='w-full h-auto'>
            {/* Tabs + Filter */}
            <section className='flex items-center justify-between p-2'>
                <SubscriptionTabs
                    tabs={tabs}
                    activeTab={tab}
                    onTabChange={setTab}
                />
                <button className='p-2 bg-gray-200 rounded-lg'>
                    <ListFilter size={15} className='text-black' />
                </button>
            </section>

            {/* Subscription Groups */}
            <div className='w-full h-auto flex flex-col gap-4 mt-4 p-2'>
                {filteredData.map((group, i) => (
                    <div key={i}>
                        <p className='text-base text-foreground mb-2'>{group.type}</p>
                        <div className='flex flex-col gap-4'>
                            {group.subscriptions.map((sub, i) => (
                                <div
                                    key={i}
                                    className='relative w-full bg-white rounded-tl-2xl rounded-tr-2xl p-4'
                                >
                                    <div className='relative w-full flex items-start justify-between pb-4'>
                                        <section className='flex flex-start gap-3'>
                                            <div>
                                                <Image src={sub.image} width={50} height={50} alt={sub.name} className='rounded-xl' />
                                            </div>
                                            <div className=''>
                                                <h6 className='text-lg text-black' >{sub.name}</h6>
                                                <p className='text-base text-foreground mb-2'>{sub.price}</p>
                                                {renderImportType(sub.type)}
                                            </div>
                                        </section>
                                        <section className='flex flex-col items-end justify-between'>
                                            <small className='text-sm text-foreground'>19 Sep 2025</small>
                                            <p className='absolute bottom-0 right-0 text-base text-black'>{sub.end_at}</p>
                                        </section>
                                    </div>
                                    <SubscriptionLine type={group.type} />

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* <div className='w-full h-full flex flex-col items-center justify-center gap-4 mt-6'>
                <Image src='/assets/no-data.png' alt='No Data' width={100} height={100}/>
                <h3 className='text-2xl text-black'>No upcoming bills</h3>
                <p className='text-base text-foreground'>Add your first subscription to start tracking</p>
                <Button variant='primary' size='md' className='flex items-center gap-4'><Plus/> Add Subscription</Button>
            </div> */}
        </div>
    )
}

export default SubscriptionList
