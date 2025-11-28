"use client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import Switch from "@/components/common/Switch";
import { activeSubscription, cancelSubscription, deleteMySubscription, getSubscriptionById, renewSubscription, updateSubscription } from "@/services/subscription.service";
import { Spinner } from "@/components/common/Spinner";
import toast from "react-hot-toast";
import { capitalizeFirstLetter } from "@/utils";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import { Subscription } from "@/app/import-subscriptions/manual/page";
import { useMiscStore } from "@/store/miscStore";
import { getCategories, getMyPaymentMethods } from "@/services/misc.service";

interface ApiSubscriptionDetail {
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
    billingHistory: {
        amount: number;
        date: string;
    }[];
}

const SubscriptionDetail = () => {
    const router = useRouter();
    const params = useParams(); // assuming Next.js app router
    const subscriptionId = params?.id as string;
    const { categories, paymentMethods, setCategories, setMethods } = useMiscStore();

    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<ApiSubscriptionDetail | null>(null);
    const [flag, setFlag] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const data = await getSubscriptionById(subscriptionId);
                setSubscription(data);

                // Fetch misc data if not available
                if (categories.length === 0) {
                    const cats = await getCategories();
                    setCategories(cats);
                }
                if (paymentMethods.length === 0) {
                    const methods = await getMyPaymentMethods();
                    setMethods(methods);
                }

            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Failed to fetch subscription");
            } finally {
                setLoading(false);
            }
        };

        if (subscriptionId) {
            fetchSubscription();
        }
    }, [subscriptionId, flag, categories.length, paymentMethods.length, setCategories, setMethods]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center py-20">
                <Spinner />
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center py-20">
                <p className="text-lg text-black">Subscription not found.</p>
            </div>
        );
    }

    const price = (subscription.priceData.amount / 10 ** subscription.priceData.decimals).toFixed(2);

    const handleRenew = async () => {
        try {
            setActionLoading(true);
            const response = await renewSubscription(subscriptionId);
            if (response) {
                toast.success("Subscription marked as renewed");
                setFlag(!flag);
                setActionLoading(false);
            }
        } catch (err: unknown) {
            setActionLoading(false);
            toast.error(
                err instanceof Error ? err.message : "Failed to renew subscription"
            );
        }
    }


    const handleCancel = async () => {
        try {
            setActionLoading(true);
            const response = await cancelSubscription(subscriptionId);
            if (response) {
                toast.success("Subscription marked as cancelled");
                setFlag(!flag);
                setActionLoading(false);
            }
        } catch (err: unknown) {
            setActionLoading(false);
            toast.error(
                err instanceof Error ? err.message : "Failed to cancel subscription"
            );
        }
    }


    const handleActive = async () => {
        try {
            setActionLoading(true);
            const response = await activeSubscription(subscriptionId);
            if (response) {
                toast.success("Subscription marked as active");
                setFlag(!flag);
                setActionLoading(false);
            }
        } catch (err: unknown) {
            setActionLoading(false);
            toast.error(
                err instanceof Error ? err.message : "Failed to active subscription"
            );
        }
    }

    const handleDelete = async () => {
        try {
            setActionLoading(true);
            await deleteMySubscription(subscriptionId);
            toast.success("Subscription deleted successfully");
            setActionLoading(false);
            router.back();

        } catch (err: unknown) {
            setActionLoading(false);
            toast.error(
                err instanceof Error ? err.message : "Failed to delete subscription"
            );
        }
    }

    const handleUpdateSubscription = async (subs: Subscription) => {
        const toastId = "update-subs";
        toast.loading("Updating subscription...", { id: toastId });
        try {
            // Prepare payload similar to ImportManualSubscription
            const data: Omit<Subscription, "merchant"> & {
                currency: string;
                merchant: string | {
                    name: string;
                    logo?: string;
                    website?: string;
                    custom?: boolean;
                };
            } = {
                ...subs,
                currency: "691f1f84c2b239c4a506fd0c" // Hardcoded as per reference
            };

            if (subs.merchant && typeof subs.merchant !== "string" && subs.merchant.custom) {
                data.merchant = {
                    name: subs.merchant.name,
                    logo: subs.merchant.logo,
                    website: subs.merchant.website,
                    custom: true,
                };
            } else if (typeof subs.merchant !== "string") {
                data.merchant = subs.merchant._id!;
            }

            // Remove modal-only fields
            delete data.isEdit;
            delete data.active;
            delete data._id;

            await updateSubscription(subscriptionId, data);
            toast.success("Subscription updated!", { id: toastId });
            setFlag(!flag); // Refresh data
            setEditOpen(false);

        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update subscription",
                { id: toastId }
            );
        }
    };

    // Adapter to convert ApiSubscriptionDetail to Subscription for the modal
    const adaptedSubscription: Subscription | null = subscription ? {
        _id: subscription._id,
        merchant: {
            _id: "custom", // Or find ID if available, but for display name/logo is enough if custom
            name: subscription.merchant.name,
            logo: subscription.merchant.logo,
            custom: true // Treat as custom for editing purposes to preserve name/logo
        },
        packageName: subscription.packageName,
        // Find category ID by name
        category: categories.find(c => c.name === subscription.category.name)?._id || "",
        frequency: subscription.frequency.text,
        price: price,
        // Find payment method ID by name
        paymentMethod: paymentMethods.find(p => p.name === subscription.paymentMethod.name)?._id || "",
        isOnFreeTrial: subscription.isOnFreeTrial,
        nextPaymentDate: subscription.nextPaymentDate,
        active: subscription.isActive,
        isEdit: true
    } : null;


    return (
        <main className="w-full min-h-screen relative overflow-hidden p-4">
            {/* Header */}
            <section className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => router.back()}>
                        <ArrowLeft />
                    </button>
                    <p className="text-lg text-black">Subscription Detail</p>
                </div>
                <button onClick={() => setEditOpen(true)} className="px-4 py-2 bg-primary/30 rounded-xl text-primary">Edit</button>
            </section>

            {/* Subscription Card */}
            <div className="subs-card-bg p-4 mt-4">
                <section className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <Image
                            src={subscription.merchant.logo}
                            alt={subscription.merchant.name}
                            width={60}
                            height={60}
                            className="rounded-xl"
                            unoptimized
                        />
                        <div>
                            <h6 className="text-lg text-black">{subscription.merchant.name}</h6>
                            <p className="text-base text-foreground">
                                {subscription.category.icon} {subscription.category.name}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-foreground flex items-center gap-2">
                        {subscription.isAutoTracked ? "Bank" : "Manual"}{" "}
                        {/* <span className="w-1 h-1 rounded-full bg-foreground inline-block" />{" "}
            {subscription.isAutoTracked ? "Auto-synced" : "Manual"} */}
                    </p>
                </section>

                <section className="flex items-center justify-between mt-8">
                    <h1 className="text-3xl text-black">${price}/{subscription.frequency.text}</h1>
                    <button
                        className={`px-3 py-1 text-black border rounded-2xl ${subscription.isActive ? "border-black" : "border-gray-400 text-gray-400"
                            }`}
                    >
                        {subscription.isActive ? "Active" : "Inactive"}
                    </button>
                </section>
            </div>

            {/* Overview */}
            <div className="w-full p-2 mt-4">
                <h3 className="text-2xl text-black mb-4">Overview</h3>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-foreground">Billing Cycle</p>
                    <p className="text-base text-foreground">{capitalizeFirstLetter(subscription.frequency.text)}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-foreground">Next Renewal Date</p>
                    <p className="text-base text-foreground">
                        {format(new Date(subscription.nextPaymentDate), "d MMM, yyyy")}
                    </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-foreground">Payment Method</p>
                    <p className="text-base text-foreground">{capitalizeFirstLetter(subscription.paymentMethod.name)}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-foreground">Category</p>
                    <p className="text-base text-foreground">
                        {subscription.category.icon} {subscription.category.name}
                    </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-foreground">Active</p>
                    <Switch checked={subscription.isActive} onChange={() => null} />
                </div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-foreground">Notifications</p>
                    <Switch checked={false} onChange={() => null} />
                </div>
            </div>

            {/* Billing History */}
            {subscription.isAutoTracked ? (
                <div className="w-full p-2 mt-4">
                    <h3 className="text-2xl text-black mb-4">Billing History</h3>
                    <div className="w-full h-[200px] overflow-y-scroll">
                        {subscription.billingHistory.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between mb-3 border-b border-foreground pb-3"
                            >
                                <p className="text-base text-foreground">
                                    {format(new Date(item.date), "d MMM yyyy")}
                                </p>
                                <p className="text-base text-black">${(item.amount / 100).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : ''}

            {/* Actions */}
            <div className="w-full z-50 lg:max-w-3xl mx-auto flex items-center justify-center gap-4 fixed bottom-2 left-0 right-0 p-2">
                {subscription.isActive ? (
                    <Button onClick={handleRenew} loading={actionLoading} disabled={actionLoading} variant="primary" size="full">
                        Mark as Renewed
                    </Button>
                ) : (
                    <Button onClick={handleActive} loading={actionLoading} disabled={actionLoading} variant="primary" size="full">
                        Mark as Active
                    </Button>
                )}
                {subscription.isActive ? (
                    <Button onClick={handleCancel} loading={actionLoading} disabled={actionLoading} variant="danger" size="full">
                        Mark as Cancelled
                    </Button>
                ) : (
                    <Button onClick={handleDelete} loading={actionLoading} disabled={actionLoading} variant="danger" size="full">
                        Delete Subscription
                    </Button>
                )}
            </div>

            <AddSubscriptionModal
                open={editOpen}
                setOpen={setEditOpen}
                item={adaptedSubscription}
                isEditing={true}
                handleAddSubscription={handleUpdateSubscription}
            />
        </main>
    );
};

export default SubscriptionDetail;
