"use client";

import { PaymentMethod, useMiscStore } from '@/store/miscStore';
import { ChevronDown, Pencil, Trash, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Button } from './common/Button';
import { BASE_URL } from '@/config';
import ImageDropdown from './common/ImageDropdown';
import { createPaymentRail, deletePaymentMethod, updatePaymentMethod } from '@/services/misc.service';
import toast from 'react-hot-toast';

interface PaymentMethodsProps {
    methods: PaymentMethod[];
    selectedPaymentId?: string;
    onSelect?: (paymentId: string) => void; // controlled selection
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
    methods,
    selectedPaymentId,
    onSelect,
}) => {
    const { paymentRails, addMethod, removeMethod, updateMethod } = useMiscStore();
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Controlled selected rail ID
    const [selectedRailId, setSelectedRailId] = useState<string | null>(paymentRails?.[0]?._id || null);

    // Track which method is being edited
    const [editingMethodId, setEditingMethodId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedRailId && paymentRails && paymentRails.length > 0) {
            setSelectedRailId(paymentRails[0]._id);
        }
    }, [paymentRails, selectedRailId]);

    const onSave = async () => {
        if (!selectedRailId || !name.trim()) return;
        setLoading(true);
        try {
            if (editingMethodId) {
                // Edit existing method
                const response = await updatePaymentMethod(editingMethodId, {
                    paymentRail: selectedRailId,
                    name: name.trim(),
                });
                updateMethod(response);
                toast.success("Payment method updated");
            } else {
                // Add new method
                const response = await createPaymentRail({
                    paymentRail: selectedRailId,
                    name: name.trim(),
                });
                addMethod(response);
                toast.success("Payment method added");
            }
            // Reset form
            setName('');
            setEditingMethodId(null);
            setAddOpen(false);
        } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message || "Failed to save payment method");
            else toast.error("Failed to save payment method");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!id) return;
        setLoading(true);
        try {
            removeMethod(id);
            if (selectedPaymentId === id && onSelect) onSelect('');
            await deletePaymentMethod(id);
            toast.success("Payment method deleted");
        } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message || "Failed to delete payment method");
            else toast.error("Failed to delete payment method");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (method: PaymentMethod) => {
        setEditingMethodId(method._id);
        setName(method.name);
        setSelectedRailId(method.paymentRail._id);
        setAddOpen(true);
    };

    const handleSelectMethod = (methodId: string) => {
        if (onSelect) onSelect(methodId);
        setOpen(false);
    };

    return (
        <div className="relative w-full">
            <label className="text-sm font-medium text-gray-700">Payment Method (Optional)</label>
            <div className='w-full border rounded-lg bg-white transition border-gray-300'>
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className='w-full h-12 md:h-[50px] flex items-center justify-between px-4 py-2'
                >
                    {selectedPaymentId ? (
                        <div className='flex items-center gap-4'>
                            <Image
                                src={`${BASE_URL}${methods?.find(m => m._id === selectedPaymentId)?.paymentRail.icon || ''}`}
                                alt='Rail'
                                width={40}
                                height={40}
                            />
                            <span className="text-dark text-sm md:text-base">
                                {methods?.find(m => m._id === selectedPaymentId)?.name}
                            </span>
                        </div>
                    ) : (
                        <div>
                            <p className='text-foreground text-base'>Select Payment Method</p>
                        </div>
                    )}

                    <ChevronDown className="w-5 h-5 text-gray" />
                </button>

                {open && (
                    <div className='border-t border-gray-300'>
                        {methods && methods.length > 0 && methods.map((m) => (
                            <div
                                key={m._id}
                                className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer
                                        ${m._id === selectedPaymentId ? 'bg-primary/20' : ''}
                                    `}
                            >
                                <div
                                    onClick={() => handleSelectMethod(m._id)}
                                    className='w-full flex items-center gap-4'>
                                    <Image src={`${BASE_URL}${m.paymentRail.icon}`} alt='Rail' width={40} height={40} />
                                    <span className="text-dark text-sm md:text-base">{m.name}</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <button className='text-foreground' onClick={() => handleEdit(m)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className='text-danger' onClick={() => onDelete(m._id)}>
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {open && !addOpen && (
                    <div className='w-full border-t border-gray-300'>
                        <button
                            onClick={() => { setAddOpen(true); setEditingMethodId(null); setName(''); }}
                            className='p-2 bg-gray-100 w-full text-center text-base text-primary'
                        >
                            + Add Another
                        </button>
                    </div>
                )}

                {open && addOpen && (
                    <div className='w-full flex items-center gap-4 p-4 bg-primary/10'>
                        <ImageDropdown
                            rails={paymentRails || []}
                            selectedRailId={selectedRailId}
                            onSelect={(rail) => setSelectedRailId(rail._id)}
                        />
                        <input
                            placeholder='Enter Name'
                            name='name'
                            className='w-full h-[40px] rounded-lg border px-3 py-2 text-sm outline-none transition-all duration-200 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button
                            loading={loading}
                            variant='primary'
                            size='sm'
                            disabled={!name || loading || !selectedRailId}
                            onClick={onSave}
                        >
                            {editingMethodId ? "Update" : "Save"}
                        </Button>
                        <button className='text-foreground' onClick={() => setAddOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethods;
