"use client"
import React, { useState, useEffect } from 'react'
import { Modal } from './common/Modal';
import Input from './common/Input';
import Switch from './common/Switch';
import { Button } from './common/Button';
import BillingCycle, { BillingCycleValue } from './common/BillingCycle';
import { Select } from './common/Select';
import { ImageUpload } from './ImageUpload';
import Image from 'next/image';
import { uploadImage } from '@/services/auth.service';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';


interface AddSubscriptionModalProps {
    open: boolean;
    setOpen: (o: boolean) => void;
    item: any | null; // Company object (for add) or Subscription object (for edit)
    isEditing: boolean;
    handleAddSubscription: (subs: any) => void
}


const categories = [
    { _id: "1", title: "🎵  Entertainment " },
    { _id: "2", title: "🎮 Gaming" },
    { _id: "3", title: "🎬 Movies & TV" },
    { _id: "4", title: "🎨 Arts & Creativity" },
    { _id: "5", title: "📚 Education" },
    { _id: "6", title: "🧘 Wellness & Lifestyle" },
]

interface ClientErrors {
    name?: string;
    url?: string;
    monthlyPrice?: string;
    renewDate?: string;
    category?: string;
}


const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ open, setOpen, item, isEditing, handleAddSubscription }) => {
    const [name, setName] = useState('');
    const [billingCycle, setBillingCycle] = useState<BillingCycleValue>({
        name: "Monthly",
        value: "1 month",
    });
    const [image, setImage] = useState<string | null>(null)
    const [url, setUrl] = useState('');
    const [monthlyPrice, setMonthlyPrice] = useState('');
    const [category, setCategory] = useState('')
    const [renewDate, setRenewDate] = useState('')
    const [freeTrial, setFreeTrial] = useState(false);
    const [active, setActive] = useState(false);
    const [clientErrors, setClientErrors] = useState<ClientErrors>({});
    const [loading, setLoading] = useState(false);

    
    const companyDisplay = isEditing ? item?.company : item; 

    const closeModal = () => {
        setOpen(false);
    };

    // Initialize form state when modal opens or item/edit status changes
    useEffect(() => {
        if (open) {
            // Reset to default
            setName('');
            setUrl('');
            setMonthlyPrice('');
            setBillingCycle({ name: "Monthly", value: "1 month" });
            setRenewDate('');
            setCategory('');
            setFreeTrial(false);
            setActive(false);
            setImage(null);
            setClientErrors({});
            setLoading(false);

            if (isEditing && item) {
                // EDIT MODE: Load existing subscription data
                const sub = item;
                const company = sub.company;

                if (!company._id) { // Only pre-fill name/url for custom subs
                    setName(company.name || '');
                    setUrl(company.url || '');
                }
                setImage(company.image || null);
                setMonthlyPrice(sub.monthlyPrice || '');
                setBillingCycle(sub.billingCycle || { name: "Monthly", value: "1 month" });
                setRenewDate(sub.renewDate || '');
                setCategory(sub.category || '');
                setFreeTrial(sub.freeTrial || false);
                setActive(sub.active || false);

            } else if (!isEditing && !item) {
                 // ADD CUSTOM: Initialize custom image upload
            }
        }
    }, [open, item, isEditing]);


    const validate = (): boolean => {
        const errors: ClientErrors = {};

        // Validate name/url only for custom subscriptions being added/edited
        if (!companyDisplay && !name.trim()) { 
            errors.name = "Subscription name is required";
        }

        if (!companyDisplay && url && !/^https?:\/\/.+/.test(url)) {
            errors.url = "Enter a valid URL";
        }

        if (!monthlyPrice || isNaN(Number(monthlyPrice)) || Number(monthlyPrice) <= 0) {
            errors.monthlyPrice = "Enter a valid monthly price";
        }

        if (!renewDate) {
            errors.renewDate = "Next renewal date is required";
        }

        if (!category) {
            errors.category = "Select a category";
        }

        setClientErrors(errors);

        return Object.keys(errors).length === 0;
    }

    const handleAdd = () => {
        if (!validate()) return;

        let data: any = {
            billingCycle,
            monthlyPrice,
            category,
            renewDate,
            freeTrial,
            active,
            isEdit: isEditing // Flag for the parent component to handle update vs add
        }

        if (isEditing) {
            // Keep the original company structure/ID from the subscription being edited
            data.company = item.company; 
        } else if (item) {
            // Add subscription for pre-defined company (item is the company object)
            data.company = item;
        } else {
            // Add custom subscription (item is undefined)
            // Use a temporary unique ID for new custom subscriptions
            data.company = { name, url, icon:image, _id: Date.now() }; 
        }

        closeModal();
        handleAddSubscription(data)
    }

    const handleImageChange = async (file: File | null, previewUrl: string | null) => {
        setImage(previewUrl);
        setLoading(true);
        try {
            // Assuming uploadImage handles the file upload and returns an object with a URL part
            const response = await uploadImage(file!);
            const url = BASE_URL + response.url;
            setImage(url);
        } catch (err: unknown) {
            setImage('');
            toast.error(
                err instanceof Error
                    ? err.message || "Failed to upload image"
                    : "Failed to upload image"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title='' isOpen={open} onClose={closeModal} h={90}>
            <div className="w-full h-auto relative px-2 py-8">
                {companyDisplay ? (
                    <div className='w-full flex items-center justify-between gap-4 border border-gray-300 p-4 rounded-xl mb-6'>
                        <div className='flex items-center gap-2'>
                            <Image src={companyDisplay.icon || companyDisplay.image} width={40} height={40} alt={companyDisplay.name} className='rounded-xl' />
                            <div>
                                <p className='flex items-center gap-2'>{companyDisplay.name}</p>
                                <small className='text-sm text-foreground'>
                                    {isEditing ? `$${item.monthlyPrice}/${item.billingCycle.name.toLowerCase().replace('ly', '')}` : "$9.99/monthly"}
                                </small>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='w-full flex items-center justify-center mb-6'>
                        <ImageUpload
                            value={image || ""}
                            onChange={handleImageChange}
                        />
                    </div>
                )}

                <div className='w-full h-auto flex flex-col gap-6'>
                    {/* Show name/url inputs only for custom subs (where companyDisplay is null/undefined) */}
                    {!companyDisplay && ( 
                        <>
                            <Input
                                value={name}
                                onChange={(e) => setName(e)}
                                label='Subscription Name'
                                placeholder='Enter Subscription Name'
                                error={clientErrors.name}
                            />
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e)}
                                label='Subscription URL (Optional)'
                                placeholder='Enter Subscription URL'
                                error={clientErrors.url}
                            />
                        </>
                    )}
                    <Input
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(e)}
                        label='Monthly Price'
                        placeholder='0.00'
                        error={clientErrors.monthlyPrice}
                    />
                    <BillingCycle
                        value={billingCycle}
                        onChange={(cycle) => setBillingCycle(cycle)}
                    />
                    <Input
                        type='date'
                        value={renewDate}
                        onChange={(e) => setRenewDate(e)}
                        label='Next Renewal Date'
                        placeholder='Enter Next Renewal Date'
                        error={clientErrors.renewDate}
                    />
                    <Select
                        label="Category"
                        options={categories}
                        value={category}
                        onChange={(value) => setCategory(value)}
                        placeholder="Select Category"
                        error={clientErrors.category}
                    />
                    <div className='w-full flex items-center justify-between'>
                        <label className="text-sm font-medium text-gray-700">
                            Free Trial
                        </label>
                        <Switch checked={freeTrial} onChange={setFreeTrial} />
                    </div>
                    <div className='w-full flex items-center justify-between'>
                        <label className="text-sm font-medium text-gray-700">
                            Active
                        </label>
                        <Switch checked={active} onChange={setActive} />
                    </div>
                </div>
                <div className='flex items-center justify-between w-full gap-4 mt-10'>
                    <Button onClick={handleAdd} variant='primary' size='full'>
                        {isEditing ? "Save Changes" : "Add Subscription"}
                    </Button>
                </div>
            </div>
        </Modal >
    )
}

export default AddSubscriptionModal;