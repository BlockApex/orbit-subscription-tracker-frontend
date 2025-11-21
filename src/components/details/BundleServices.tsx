"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Sparkle } from "lucide-react";
import { Bundle, BundleItem, Offer } from "@/app/types/bundle.types";

const BundleServices = ({ bundle }: { bundle: Bundle }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="w-full h-[600px] lg:h-[550px] overflow-y-scroll relative p-4">
            <div className="flex items-center justify-between my-4">
                <p className="text-base text-foreground font-normal">Included Services</p>
            </div>
            <div className="w-full h-[600px] lg:h-[500px] overflow-y-scroll flex flex-col gap-4">
                {bundle.selectedPackages.map((pkg:BundleItem) => {
                    const service = pkg.service;
                    const plan = pkg.package;
                    const isExpanded = expandedId === service._id;

                    const trialOffer = pkg.applicableOffers.find(
                        (offer: Offer) => offer.type === "free"
                    );
                    const discountOffer = pkg.applicableOffers.find(
                        (offer: Offer) => offer.type === "%discount"
                    );

                    return (
                        <div
                            key={service._id}
                            className="bg-white relative rounded-xl border border-gray-300 transition-all duration-300"
                        >
                            {trialOffer && (
                                <div className="absolute -top-2 right-0 bg-[#F8D69F] text-[#5B3B00] text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-xl shadow-sm z-0">
                                    {trialOffer.period} Free Trial
                                </div>
                            )}

                            {/* Header */}
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer select-none"
                                onClick={() => toggleExpand(service._id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={service.logo}
                                        alt={service.name}
                                        width={40}
                                        height={40}
                                        className="rounded-lg object-contain"
                                    />
                                    <div>
                                        <h3 className="text-lg font-normal text-black">{service.name}</h3>
                                        <p className="text-base text-foreground">{plan.name}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-foreground line-through">
                                        ${plan.amount.toFixed(2)}
                                    </p>
                                    <p className="text-base font-normal text-black">
                                        ${(plan.amount * 0.8).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Expandable Content */}
                            <div
                                className={`transition-all duration-500 ease-in-out ${isExpanded ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
                                    } overflow-hidden`}
                            >
                                <div className="px-6 pb-4">

                                       <pre className="text-sm text-foreground text-wrap">
                                        {plan.description}
                                        </pre> 


                                    <div className="flex items-center justify-end mt-2">
                                        {discountOffer && (
                                            <p className="text-base text-primary flex items-center gap-2">
                                                <Sparkle size={20} /> {discountOffer.amount}% OFF
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BundleServices;
