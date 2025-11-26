import React from 'react';
import Image from 'next/image';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Subscription } from '@/types/bundle.types';
import { ArrowDownToLine, Copy } from 'lucide-react';
import { shortenTx } from '@/utils';
import Link from 'next/link';

interface PaymentSuccessProps {
    open: boolean;
    subscription: Subscription | null;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ open, subscription }) => {
    if (!subscription) return null;

    const bundle = subscription.bundle;
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const originalTotal = bundle.totalOriginalPrice ?? 0;
    const discountedTotal = bundle.totalFirstDiscountedPrice ?? originalTotal;
    const savings = originalTotal - discountedTotal;
    const discountPercent = ((savings / originalTotal) * 100).toFixed(1);

    const nextBillingDate = formatDate(subscription.nextPaymentDate);
    const txId = shortenTx(subscription.tx ?? '');

    const paymentMethod = 'Debit Wallet'; // static for now
    const servicesIncluded = bundle.selectedPackages?.length ?? 4;

    return (
        <Modal title="Payment & Funding" isOpen={open} h={80}>
            <div className="w-full flex flex-col items-center justify-center p-4">
                {/* ✅ Success Illustration */}
                <Image
                    src="/assets/logo.png"
                    alt="Success"
                    width={120}
                    height={120}
                    className="mb-4"
                />

                {/* ✅ Bundle Title */}
                <h5 className="text-xl font-semibold text-black text-center">
                    {bundle.name} Bundle Activated! 🎉
                </h5>
                <p className="text-sm text-gray-500 font-normal text-center mb-6">
                    Your subscriptions are now active and ready to use
                </p>

                {/* ✅ Receipt Card */}
                <div className="w-full max-w-md border border-foreground rounded-xl p-4 shadow-sm">
                    <div className="space-y-1 text-sm text-black">
                        <div className="flex justify-between">
                            <span>Original Total</span>
                            <span className="font-medium">USDC {originalTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Bundle Total</span>
                            <span className="font-medium">USDC {discountedTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-green-600">
                            <span>You Save</span>
                            <span className="font-medium">USDC {savings.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount %</span>
                            <span>{discountPercent}%</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Yield Offset</span>
                            <span>0</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Services Included</span>
                            <span>{servicesIncluded.toString().padStart(2, '0')}</span>
                        </div>

                        <hr className="my-2 border-gray-300" />

                        <div className="flex justify-between font-medium">
                            <span>You Paid</span>
                            <span>USDC {discountedTotal.toFixed(2)}</span>
                        </div>

                        <hr className="my-2 border-gray-300" />

                        <div className="flex justify-between">
                            <span>Next Billing Date</span>
                            <span>{nextBillingDate}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Payment Method</span>
                            <span>{paymentMethod}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>TX ID</span>
                            <div className="flex items-center gap-1 text-gray-600">
                                <span>{txId}</span>
                                <Copy size={14} className="cursor-pointer text-gray-500" />
                            </div>
                        </div>
                    </div>

                    {/* ✅ Save Receipt Button */}
                    <div className="flex items-center justify-center mt-4 text-sm text-gray-700 cursor-pointer hover:text-black">
                        <ArrowDownToLine size={18} />
                        <span className="ml-2 font-medium">Save Receipt</span>
                    </div>
                </div>

                {/* ✅ Claim Button */}
                <Link href={`/subscription/${subscription._id}`} className='w-full'>
                    <Button variant="dark" size="full" className="mt-6 flex items-center justify-center gap-2">
                        Claim Bundle
                    </Button>
                </Link>
            </div>
        </Modal>
    );
};

export default PaymentSuccess;
