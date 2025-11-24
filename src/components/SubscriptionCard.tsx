"use client"
import React, { useState } from 'react'
import { BundleItem, ClaimedPackage } from '../types/bundle.types'
import Image from 'next/image'
import { Button } from './common/Button'
import { ChevronRight, CircleCheck, Info } from 'lucide-react'
import { capitalizeFirstLetter, truncateText } from '../utils'
import { Modal } from './common/Modal'
import Input from './common/Input'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { claimSubscription } from '../services/bundle.service'

interface SubscriptionCardProps {
    subscription: BundleItem;
    claimedPackages: ClaimedPackage[] | undefined;
    subscriptionId: string;
    refetch: () => void
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, claimedPackages, subscriptionId, refetch }) => {
    const [claimOpen, setClaimOpen] = useState(false);
    const [insOpen, setInsOpen] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const service = subscription.service;
    const plan = subscription.package;
    const isClaimed = claimedPackages?.some((p) => p.package._id === plan._id);
    const bg = isClaimed ? 'bg-success/40' : 'bg-warning/40';
    const form = plan.requiredFormFields || [];
    const instruction = claimedPackages?.find((p) => p.package._id === plan._id)?.claimInstructions ?? null;

    // Handle input change
    const handleChange = (fieldName: string, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
    };


    const handleClaim = async () => {
        try {
            setLoading(true);
            // Convert formData into providedFormFields format
            const providedFormFields = Object.entries(formData).map(([fieldName, fieldValue]) => ({
                fieldName,
                fieldValue,
            }));

            const payload = {
                subscription: subscriptionId,
                service: service._id,
                package: plan._id,
                providedFormFields,
            };

            console.log("🧾 Claim Payload:", payload);
            // Call API
            const response = await claimSubscription(subscriptionId, payload);

            console.log(response, "Api response.....")
            toast.success("🎉 Package has been claimed successfully!");
            refetch();
            setClaimOpen(false);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to claim subscription");
                return;
            }
            console.error("❌ Claim Error:", err);
            toast.error((err as Error)?.message || "Something went wrong while claiming");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={`w-full rounded-xl p-2 ${bg}`}>
            <div className="w-full rounded-xl bg-white p-3 lg:p-4">
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-start gap-2">
                        <Image alt="icon" src={service.logo} width={50} height={50} className="rounded-xl" />
                        <div className='ps-2'>
                            <h6 className="text-base text-black">{service.name}</h6>
                            <p className="text-sm text-foreground max-w-sm">
                                {truncateText(service?.description ?? "", 20)}

                            </p>
                        </div>
                    </div>
                    <h6 className="text-lg text-black">${plan?.amount}/month</h6>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full flex items-center justify-between px-2 py-4">
                {isClaimed ? (
                    <p className="text-sm text-black flex items-center gap-1">
                        <CircleCheck size={16} />
                        Access Granted !
                    </p>
                ) : (
                    <p className="text-sm text-black flex items-center gap-1">
                        <Info size={16} />
                        Click Claim to receive access
                    </p>
                )}

                {isClaimed ? (
                    <Button onClick={() => setInsOpen(true)} variant="dark" size="sm">
                        View Instruction <ChevronRight size={17} />
                    </Button>
                ) : (
                    <Button onClick={() => setClaimOpen(true)} variant="dark" size="sm">
                        Claim <ChevronRight size={17} />
                    </Button>
                )}
            </div>

            {/* Claim Modal */}
            <Modal title="" isOpen={claimOpen} onClose={() => setClaimOpen(false)}>
                <div className='w-full p-4'>
                    <h4 className='text-lg text-black text-center mb-4'>Claim Subscription</h4>
                    <br />
                    <div className='flex items-center justify-center mb-4'>
                        <div className="flex items-start gap-2 bg-secondary/20 p-4 rounded-xl">
                            <Image alt="icon" src={service.logo} width={50} height={50} className="rounded-xl" />
                            <div className='ps-2'>
                                <h6 className="text-base text-black">{service.name}</h6>
                                <p className="text-sm text-foreground max-w-sm">
                                    {truncateText(service?.description ?? "", 20)}

                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Form Fields */}
                    <form className="flex flex-col gap-3 mt-4">
                        {form.length > 0 ? (
                            form.map((field, index) => (
                                <div key={index} className="flex flex-col gap-1">

                                    <Input
                                        label={capitalizeFirstLetter(field.fieldName)}
                                        type={field.fieldType === 'string' ? 'text' : field.fieldType}
                                        placeholder={`Enter ${field.fieldName}`}
                                        value={formData[field.fieldName] || ''}
                                        onChange={(e) => handleChange(field.fieldName, e)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500">No additional details required.</p>
                        )}

                        <Button
                            variant="dark"
                            size="full"
                            className="mt-4 flex items-center gap-2"
                            onClick={handleClaim}
                            loading={loading}
                        >
                            Activate <ChevronRight size={16} />
                        </Button>
                    </form>
                </div>
            </Modal>


            {/* Instruction Modal */}
            <Modal title="" isOpen={insOpen} onClose={() => setInsOpen(false)}>
                <div className='w-full p-4'>
                    <h4 className='text-lg text-black text-center mb-4'>Activated 🎉</h4>
                    <br />
                    <div className='flex items-center justify-center mb-4'>
                        <div className="flex items-start gap-2 bg-secondary/20 p-4 rounded-xl">
                            <Image alt="icon" src={service.logo} width={50} height={50} className="rounded-xl" />
                            <div className='ps-2'>
                                <h6 className="text-base text-black">{service.name}</h6>
                                <p className="text-sm text-foreground max-w-sm">
                                    {truncateText(service?.description ?? "", 20)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='p-4'>
                        {instruction ? instruction : ""}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default SubscriptionCard
