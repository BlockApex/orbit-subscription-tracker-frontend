"use client";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import React, { useEffect, useState } from "react";
import SubscriptionTabs from "./SubscriptionTabs";
import { ListFilter } from "lucide-react";
import Image from "next/image";
import SubscriptionLine from "./SubscriptionLine";
import toast from "react-hot-toast";
import { getMySubscriptions } from "@/services/subscription.service";
import { Spinner } from "./common/Spinner";

interface ApiSubscription {
    _id: string;
    merchant: {
        name: string;
        logo: string;
    };
    packageName: string;
    category: {
        name: string;
        icon: string;
    };
    frequency: {
        text: string;
        seconds: number;
    };
    priceData: {
        amount: number;
        decimals: number;
    };
    paymentMethod: {
        name: string;
    };
    isOnFreeTrial: boolean;
    isActive: boolean;
    isAutoTracked: boolean;
    nextPaymentDate: string;
    createdAt: string;
}

type Status = "active" | "cancelled";

interface Subscription {
    _id: string;
    image: string;
    name: string;
    price: string;
    type: string;
    end_at: string;
    created_at: string;
    status: Status;
    packageName: string;
    category: string;
    categoryIcon: string;
    frequency: string;
    isOnFreeTrial: boolean;
    isAutoTracked: boolean;
    nextPaymentDate: string;
}

interface SubscriptionGroup {
    type: string;
    subscriptions: Subscription[];
}

const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "cancelled", label: "Cancelled" },
];

const SubscriptionList = () => {
    const router = useRouter();
    const [tab, setTab] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<SubscriptionGroup[]>([]);

    // Format API → UI
    const mapToSubscription = (item: ApiSubscription): Subscription => {
        const price = (item.priceData.amount / 10 ** item.priceData.decimals).toFixed(2);

        return {
            _id: item._id,
            image: item.merchant.logo,
            name: item.merchant.name,
            packageName: item.packageName,
            category: item.category.name,
            categoryIcon: item.category.icon,
            frequency: item.frequency.text,
            price: `$${price}`,
            type: item.isAutoTracked ? "Bank" : "Manual",
            end_at: formatDistanceToNow(new Date(item.nextPaymentDate), { addSuffix: false }),
            created_at: format(new Date(item.createdAt), "d MMM yyyy"),
            status: item.isActive ? "active" : "cancelled",
            isOnFreeTrial: item.isOnFreeTrial,
            isAutoTracked: item.isAutoTracked,
            nextPaymentDate: item.nextPaymentDate,
        };
    };

    // Group by next payment date
    const getGroupType = (nextPayment: string): "Coming up" | "Due Soon" => {
        const next = new Date(nextPayment).getTime();
        const now = Date.now();
        const diffDays = Math.ceil((next - now) / (1000 * 60 * 60 * 24));

        return diffDays <= 3 ? "Coming up" : "Due Soon";
    };

    // Fetch subscriptions
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setLoading(true);

                const res: ApiSubscription[] = await getMySubscriptions();

                const comingUp: Subscription[] = [];
                const dueSoon: Subscription[] = [];

                res.forEach((item) => {
                    const formatted = mapToSubscription(item);
                    const group = getGroupType(item.nextPaymentDate);
                    if (group === "Coming up") comingUp.push(formatted);
                    else dueSoon.push(formatted);
                });

                // Sort by nearest payment date
                comingUp.sort(
                    (a, b) =>
                        new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
                );
                dueSoon.sort(
                    (a, b) =>
                        new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
                );

                const readyGroups: SubscriptionGroup[] = [];

                if (comingUp.length > 0)
                    readyGroups.push({ type: "Coming up", subscriptions: comingUp });

                if (dueSoon.length > 0)
                    readyGroups.push({ type: "Due Soon", subscriptions: dueSoon });

                setGroups(readyGroups);
            } catch (err) {
                toast.error("Failed to load subscriptions");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    // Apply tab filter
    const filteredData = groups
        .map((g) => ({
            ...g,
            subscriptions: g.subscriptions.filter((s) =>
                tab === "all" ? true : s.status === tab
            ),
        }))
        .filter((g) => g.subscriptions.length > 0);

    const renderImportType = (type: string) => {
        if (type.toLowerCase() === "manual") {
            return (
                <span className="text-xs text-danger bg-danger/10 px-4 py-1 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-danger inline-block" /> Manual
                </span>
            );
        }
        return (
            <span className="text-xs text-success bg-success/10 px-4 py-1 rounded-2xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success inline-block" /> Bank
            </span>
        );
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center py-20">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="w-full h-auto">
            {/* Tabs */}
            <section className="flex items-center justify-between p-2">
                <SubscriptionTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
                <button className="p-2 bg-gray-200 rounded-lg">
                    <ListFilter size={15} className="text-black" />
                </button>
            </section>

            {/* Subscription Groups */}
            <div className="w-full h-auto flex flex-col gap-4 mt-4 p-2">
                {filteredData.map((group, idx) => (
                    <div key={idx}>
                        <p className="text-base text-foreground mb-2">{group.type}</p>

                        <div className="flex flex-col gap-4">
                            {group.subscriptions.map((sub, i) => (
                                <div
                                    key={i}
                                    onClick={()=>router.push(`/subscription/${sub._id}`)}
                                    className="relative w-full bg-white rounded-tl-2xl rounded-tr-2xl p-4 cursor-pointer"
                                >
                                    <div className="relative w-full flex items-start justify-between pb-4">
                                        {/* LEFT */}
                                        <section className="flex flex-start gap-3">
                                            <div>
                                                <Image
                                                    src={sub.image}
                                                    width={50}
                                                    height={50}
                                                    alt={sub.name}
                                                    className="rounded-xl"
                                                    unoptimized
                                                />
                                            </div>

                                            <div>
                                                <h6 className="text-lg text-black">
                                                    {sub.name}{" "}
                                                    <small className="text-sm text-foreground ms-2">
                                                        ({sub.packageName})
                                                    </small>
                                                </h6>

                                                {/* Category + Icon */}
                                                <p className="text-sm text-foreground flex items-center gap-1">
                                                    <span>{sub.categoryIcon}</span> {sub.category}
                                                </p>

                                                {/* Frequency + Price */}
                                                <p className="text-base text-foreground mb-2">
                                                    {sub.price} / {sub.frequency}
                                                </p>

                                                {/* Type + Free Trial (inline) */}
                                                <div className="flex items-center gap-2">
                                                    {renderImportType(sub.type)}
                                                    {sub.isOnFreeTrial && (
                                                        <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                                            Free Trial Active
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </section>

                                        {/* RIGHT */}
                                        <section className="flex flex-col items-end justify-between">
                                            <small className="text-sm text-foreground">{sub.created_at}</small>
                                            <p className="absolute bottom-0 right-0 text-base text-black">
                                                {sub.end_at}
                                            </p>
                                        </section>
                                    </div>

                                    <SubscriptionLine type={group.type} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionList;
