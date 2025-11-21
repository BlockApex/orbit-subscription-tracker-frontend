"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import BundleCard from "./BundleCard";
import { Bundle } from "../types/bundle.types";
import { getPresetBundles } from "../services/bundle.service";
import { Spinner } from "./common/Spinner";

const FeaturedBundles: React.FC = () => {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                setLoading(true);
                const data = await getPresetBundles();

                // ✅ If more than 3 bundles, keep only the first 3
                const limitedData = data.length > 3 ? data.slice(0, 3) : data;

                setBundles(limitedData);
            } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || 'Failed to fetch bundles');
            } else {
                toast.error('Failed to fetch bundles');
            }
            } finally {
                setLoading(false);
            }
        };

        fetchBundles();
    }, []);


    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-8">
                <Spinner />
            </div>
        );
    }

    if (!bundles.length) {
        return (
            <div className="w-full text-center py-8 text-gray-500">
                No bundles available.
            </div>
        );
    }

    return (
        <div className="w-full h-auto relative p-2">
            <div className="flex items-center justify-between">
                <p className="text-base text-foreground font-normal">Featured Bundles</p>
                <Link href="/discover" className="text-base text-primary">
                    See All
                </Link>
            </div>

            <div className="flex flex-col gap-8 mt-4">
                {bundles.map((b) => {
                    return <BundleCard bundle={b} key={b._id} />;
                })}
            </div>
        </div>
    );
};

export default FeaturedBundles;
