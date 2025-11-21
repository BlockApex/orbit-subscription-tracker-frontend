"use client"
import React, { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, MoveRight, Search } from 'lucide-react'
import Input from '@/components/common/Input'
import Image from 'next/image'
import AddSubscriptionModal from '@/components/AddSubscriptionModal'
import { Button } from '@/components/common/Button'

const companies = [
    { _id: 1, name: 'ChatGPT', icon: '/assets/mock/companies/1.png' },
    { _id: 2, name: 'Github Copilot', icon: '/assets/mock/companies/2.png' },
    { _id: 3, name: 'Vercel', icon: '/assets/mock/companies/3.png' },
    { _id: 4, name: 'Netflix', icon: '/assets/mock/companies/4.png' },
    { _id: 5, name: 'Spotify', icon: '/assets/mock/companies/5.png' },
    { _id: 6, name: 'Youtube', icon: '/assets/mock/companies/6.png' },
    { _id: 7, name: 'Amazone Prime', icon: '/assets/mock/companies/7.png' },
    { _id: 8, name: 'Disney+', icon: '/assets/mock/companies/8.png' },
    { _id: 9, name: 'Icloud+', icon: '/assets/mock/companies/9.png' },
    { _id: 10, name: 'Google Cloud', icon: '/assets/mock/companies/10.png' },
    { _id: 11, name: 'Paramount++', icon: '/assets/mock/companies/11.png' },
]

const ImportManualSubscription = () => {
    const [search, setSearch] = useState('');
    const [subscriptions, setSubscriptions] = useState<any>([]);
    // Holds either a Company (for adding) or a Subscription (for editing)
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [open, setOpen] = useState(false);

    // Determines if the modal is in 'edit' or 'add' mode
    const isEditing = selectedItem && 'billingCycle' in selectedItem;

    const handleOpenModal = (item: any) => {
        setSelectedItem(item);
        setOpen(true);
    }

    const handleAddSubscription = (subs: any) => {
        if (subs.isEdit) {
            // Find and replace the old subscription with the updated details
            setSubscriptions(
                subscriptions.map((s: any) =>
                    s.company._id === subs.company._id ? subs : s
                )
            );
        } else {
            // Add a new subscription
            setSubscriptions([...subscriptions, subs]);
        }
    }

    const removeSubscription = (c: any) => {
        // Filter out the subscription based on the company ID
        let filteredSubs = subscriptions.filter((s: any) => s.company._id !== c._id);
        setSubscriptions(filteredSubs);
    }


    // Use a Set for efficient filtering of available companies
    const subscribedCompanyIds = new Set(subscriptions.map((s: any) => s.company?._id));

    return (
        <main className="w-full min-h-screen bg-gray-50 relative overflow-hidden p-4">
            {/* Header */}
            <div className="flex items-center gap-4 py-5 sticky top-0 bg-gray-50 z-10">
                <button
                    //   onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                >
                    <ChevronLeft className="text-white" />
                </button>
                <h5 className="text-xl font-normal text-gray-900">
                    Companies
                </h5>
            </div>
            <div className=''>
                <div className='w-full flex flex-col gap-4 mt-4'>
                    <Input
                        label=""
                        value={search}
                        onChange={setSearch}
                        placeholder="Search for company"
                        className="text-black"
                        icon={<Search className="text-dark" />}
                    />
                    <div className='w-full max-h-[600px] lg:max-h-[500px] overflow-y-scroll flex flex-col gap-4'>

                        {/* Add Custom Subscription Button */}
                        <div onClick={() => handleOpenModal(undefined)} className='w-full flex items-center justify-between gap-4 bg-secondary/20 border border-gray-300 p-4 rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <Image src='/assets/custom-subs.svg' width={40} height={40} alt='Add Custom Subscription' className='rounded-xl' />
                                <div>
                                    <p className='flex items-center gap-2'>
                                        Add Custom Subscription
                                    </p>
                                </div>
                            </div>
                            <button>
                                <ChevronRight className='text-foreground' size={17} />
                            </button>
                        </div>

                        {/* LIST OF ADDED SUBSCRIPTIONS (EDITABLE) */}
                        {subscriptions.length > 0 ? (
                            subscriptions
                                .map((s: any) => {
                                    const { company: c } = s;
                                    return (
                                        <div
                                            key={c._id} // Use stable ID
                                            className={`w-full bg-primary/20 flex items-center border border-primary p-4 rounded-xl`}
                                        >
                                            {/* Remove button */}
                                            <button onClick={() => removeSubscription(c)} className='w-7 h-7 flex items-center justify-center rounded-lg border border-foreground me-3 bg-primary'>
                                                <Check size={17} className='text-white' />
                                            </button>
                                            {/* Click to EDIT: Pass the full subscription object (s) */}
                                            <div onClick={() => handleOpenModal(s)} className='w-full flex items-center justify-between gap-4'>
                                                <div className='flex items-center gap-2'>
                                                    <Image src={c.icon || c.image} width={40} height={40} alt={c.name} className='rounded-xl' />
                                                    <div>
                                                        <p className='flex items-center gap-2'>{c.name}</p>
                                                        <small className='text-sm text-foreground'>
                                                            {`$${s.monthlyPrice}/${s.billingCycle.name.toLowerCase().replace('ly', '')}`}
                                                        </small>
                                                    </div>
                                                </div>
                                                <button>
                                                    <ChevronRight className='text-foreground' size={17} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                        ) : (
                            ""
                        )}

                        {/* LIST OF AVAILABLE COMPANIES (NOT SUBSCRIBED) */}
                        {companies.length > 0 ? (
                            companies
                                // FIX: Only show companies whose _id is NOT in the subscribedCompanyIds Set
                                .filter((c) => !subscribedCompanyIds.has(c._id))
                                .map((c) => {
                                    return (
                                        <div
                                            key={c._id}
                                            className={`w-full flex items-center border border-gray-300 p-4 rounded-xl cursor-pointer`}
                                        >
                                            {/* Placeholder button (not subscribed) */}
                                            <button className='w-7 h-7 flex items-center justify-center rounded-lg border border-foreground me-3'>
                                                {/* (Optional: Add a Plus icon here instead of Check) */}
                                            </button>
                                            {/* Click to ADD: Pass the company object (c) */}
                                            <div onClick={() => handleOpenModal(c)} className='w-full flex items-center justify-between gap-4'>
                                                <div className='flex items-center gap-2'>
                                                    <Image src={c.icon} width={40} height={40} alt={c.name} className='rounded-xl' />
                                                    <div>
                                                        <p className='flex items-center gap-2'>{c.name}</p>
                                                        <small className='text-sm text-foreground'>
                                                            $9.99/monthly
                                                        </small>
                                                    </div>
                                                </div>
                                                <button>
                                                    <ChevronRight className='text-foreground' size={17} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                        ) : (
                            <p className="text-center text-gray-500 py-4">No companies found</p>
                        )}
                    </div>
                </div>
            </div>

            <AddSubscriptionModal
                handleAddSubscription={handleAddSubscription}
                item={selectedItem}
                isEditing={isEditing}
                open={open}
                setOpen={setOpen}
            />

            {/* Checkout Section */}
            <section className="w-full z-40 lg:max-w-3xl mx-auto flex items-center justify-center fixed bottom-0 left-0 right-0 p-2">
                <div className="w-full max-w-[100%] bg-primary shadow-2xl p-2 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 p-4">
                        <div className="flex items-center -space-x-2">
                            {subscriptions && subscriptions !== null && subscriptions.length > 0 && (
                                <>
                                    {/* 1. Show only the first subscription image */}
                                    <Image
                                        key={subscriptions[0].company._id || 0} // Use a stable key
                                        src={subscriptions[0].company.icon || subscriptions[0].company.image}
                                        alt={subscriptions[0].company.name || "Subscription"}
                                        width={40}
                                        height={40}
                                        className="rounded-full border-2 border-primary bg-white"
                                    />

                                    {/* 2. Check if there are more than 1 subscription */}
                                    {subscriptions.length > 1 && (
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold border-2 border-primary z-10"
                                            title={`And ${subscriptions.length - 1} more subscriptions`}
                                        >
                                            {/* Calculate remaining count */}
                                            +{subscriptions.length - 1}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        {subscriptions.length && (
                            <p className="text-sm lg:text-base text-white font-normal ">
                                {subscriptions.length} Subscriptions
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4 p-4">

                        <Button
                            variant="light"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={!subscriptions.length}

                        >
                            Continue <MoveRight size={18} />
                        </Button>
                    </div>
                </div>
            </section>

        </main>
    )
}

export default ImportManualSubscription;