import AppLayout from '@/components/common/AppLayout'
import SubscriptionList from '@/components/SubscriptionList'
import UserHomeView from '@/components/UserHomeView'
import React from 'react'

const Dashboard = () => {
    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden px-2 lg:px-4">
                <br />
                <UserHomeView />
                <br />
                <SubscriptionList />
            </main>
        </AppLayout>
    )
}

export default Dashboard