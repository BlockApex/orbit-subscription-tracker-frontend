'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { getUserSpend } from '@/services/auth.service';

// ----------------------
// Types
// ----------------------
interface UserSpendResponse {
    scaledMonthlySpend: string;
    scaledYearlySpend: string;
    totalSubscriptions: number;
}

const UserHomeView: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [spend, setSpend] = useState<UserSpendResponse | null>(null);

    useEffect(() => {
        const fetchSpend = async () => {
            try {
                setLoading(true);
                const res = await getUserSpend();

                // API must return the following:
                // {
                //   scaledMonthlySpend: "35523.00",
                //   scaledYearlySpend: "426277.00",
                //   totalSubscriptions: number
                // }

                setSpend({
                    scaledMonthlySpend: res.scaledMonthlySpend,
                    scaledYearlySpend: res.scaledYearlySpend,
                    totalSubscriptions: res.totalSubscriptions,
                });
            } catch (err) {
                console.error('Failed to fetch spend:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpend();
    }, []);

    // ----------------------
    // Loading UI
    // ----------------------
    if (loading || !spend) {
        return (
            <div className="w-full h-full p-4 stats-bg animate-pulse">
                <small className="text-sm text-black flex items-center gap-1">
                    <DollarSign size={15} /> Total Monthly Spend
                </small>

                <div className="mt-6">
                    <div className="h-14 w-40 bg-gray-300 rounded-md" />
                    <section className="w-full flex items-center justify-between mt-4">
                        <div className="h-6 w-24 bg-gray-300 rounded-md" />
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-32 bg-gray-300 rounded-md" />
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    // ----------------------
    // Final UI
    // ----------------------
    return (
        <div className="w-full h-full p-4 stats-bg">
            <small className="text-sm text-black flex items-center gap-1">
                <DollarSign size={15} /> Total Monthly Spend
            </small>

            <div className="mt-6">
                <h1 className="text-5xl text-black font-normal">
                    ${Number(spend.scaledMonthlySpend).toLocaleString()}
                </h1>

                <section className="w-full flex items-center justify-between mt-4">
                    <p className="text-base text-black">
                        ${Number(spend.scaledYearlySpend).toLocaleString()}/year
                    </p>

                    <div className="flex items-center gap-2">
                        {/* <p className="text-base text-black">You're spending on</p>
                        <span className="py-1 px-3 rounded-2xl border border-white/50 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            {spend.totalSubscriptions} Subs
                        </span> */}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserHomeView;
