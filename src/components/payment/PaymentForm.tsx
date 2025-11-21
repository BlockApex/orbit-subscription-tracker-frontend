"use client";
import { BlockhashWithExpiryBlockHeight, Cluster, clusterApiUrl, Connection, PublicKey, SendTransactionError, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Switch from "../common/Switch";
import { Check, Sparkle, TrendingUp, Wallet2 } from "lucide-react";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { useParams } from 'next/navigation';
import PaymentSuccess from "./PaymentSuccess";
import { getBundleById, paymentBundle, prepareSubscription, subscribeBundle } from "@/services/bundle.service";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { AxiosError } from "axios";
import { Bundle, Subscription } from "@/types/bundle.types";
import { CHAIN } from "@/config";




type InstructionKey = {
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
};


const durations = [
    { key: 3, label: "03 Months" },
    { key: 6, label: "06 Months" },
    { key: 12, label: "12 Months" },
];


const currencies = [
    { _id: "usdc", title: "USDC" },
    { _id: "sol", title: "Solana" },
];

const methods = [
    {
        title: 'Smart Balance',
        text: 'Apply yield then debit wallet instantly',
        icon: <TrendingUp />,
        disabled: true
    },
    {
        title: 'Debit Wallet',
        text: 'Instantly charge from wallet balance',
        icon: <Wallet2 />,
        disabled: false
    },
    {
        title: 'Yield Only',
        text: 'Charge only from yield, pause if insufficient',
        icon: <Sparkle />,
        disabled: true
    },
]

const PaymentForm = () => {
    const { id } = useParams<{ id: string }>()
    const { publicKey, signTransaction, signAllTransactions } = useWallet();
    const [bundle, setBundle] = useState<Bundle | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [duration, setDuration] = useState(durations[1]);
    const [currency, setCurrency] = useState(currencies[0]._id)
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [prepare, setPrepare] = useState(false);
    const [subscription, setSubscription] = useState<null | Subscription>(null);




    useEffect(() => {
        const fetchBundle = async () => {
            try {
                setLoading(true);
                const data = await getBundleById(id);
                setBundle(data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message || 'Failed to fetch bundle');
                } else {
                    toast.error('Failed to fetch bundle');
                }
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchBundle();
        }
    }, [id]);



    const handleSubscribe = async () => {
        if (!publicKey) throw new Error("Wallet not connected");
        if (!signTransaction) {
            throw new Error("Wallet adapter does not provide signTransaction.");
        }

        const connection = new Connection(clusterApiUrl(CHAIN as Cluster), "confirmed");
        try {
            setLoading(true);
            const response = await subscribeBundle(id);

            // Declare blockhash in outer scope for confirmation
            const latestBlockhash: BlockhashWithExpiryBlockHeight = await connection.getLatestBlockhash("confirmed");

            let lastTxHash = null;

            for (const [i, txData] of response.transactions.entries()) {
                console.log(`🧩 Processing Transaction #${i + 1} | Type: ${txData.type}`);

                // --------------------------------------------------------
                // 🛑 FIX: FETCH BLOCKHASH HERE (RIGHT BEFORE SIGNING)
                // --------------------------------------------------------

                // 1. Deserialize the Legacy Transaction to extract instructions
                const tx = VersionedTransaction.deserialize(Uint8Array.from(JSON.parse(`[${txData.transaction}]`)));

                // const tx = VersionedTransaction.deserialize(Uint8Array.from(txData.transaction as string))

                // 7. Request the user's signature
                console.log("🚀 Requesting user signature via signTransaction...");
                const signedTx = await signTransaction(tx);

                // 8. Send the Raw Transaction
                console.log("🚀 Sending final raw transaction...");

                // Use skipPreflight=true to bypass the RPC node's check on the stale server signature
                const signature = await connection.sendRawTransaction(signedTx.serialize(), {
                    skipPreflight: true
                });
                lastTxHash = signature;

                console.log(`✅ Transaction Sent! Hash: ${lastTxHash}`);

                // 9. Confirm the transaction (using the fresh blockhash and expiry height)
                const confirmation = await connection.confirmTransaction(
                    {
                        signature,
                        blockhash: latestBlockhash.blockhash,
                        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight + 100,
                    },
                    "confirmed"
                );

                if (confirmation.value.err === null) {
                    console.log(`https://solscan.io/tx/${lastTxHash}`);
                    console.log(`🎉 Transaction #${i + 1} Confirmed!`);
                } else {
                    throw new Error(`Error subscription tokens: ${confirmation.value.err}`);
                }
            }

            // Final success logic
            const paymentResponse = await paymentBundle(response.subscription._id!)
            setSubscription({ ...paymentResponse.subscription, tx: lastTxHash });
            setSuccess(true);
            toast.success("Bundle subscribed successfully!");
        } catch (err: unknown) {

            // ... (error handling remains the same)
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message)
                return
            } else if (err instanceof SendTransactionError) {
                console.log(err);
                const logs = await err.getLogs(connection);
                console.log(logs);
            }
            console.error("❌ Transaction Error:", err);
            toast.error(JSON.stringify(err));
        } finally {
            setLoading(false);
            console.log("🧹 Transaction attempt finished");
        }
    };


    const approveSubscription = async () => {
        if (!publicKey || !signAllTransactions) throw new Error("Wallet or signAllTransactions function not available");

        try {
            setLoading(true);
            const interval = enabled ? duration.key : 1;
            const response = await prepareSubscription(id, interval);
            const connection = new Connection(clusterApiUrl(CHAIN as Cluster), "confirmed");
            const latestBlockhash = await connection.getLatestBlockhash("confirmed");

            const transactionsToSign = [];

            for (const [i, txData] of response.transactions.entries()) {
                console.log(`🧩 Building Transaction #${i + 1}`);

                // 1. Build Instruction (as before)
                const instr = txData.instruction;
                const keys = instr.keys.map((k: InstructionKey) => ({
                    pubkey: new PublicKey(k.pubkey),
                    isSigner: k.isSigner,
                    isWritable: k.isWritable,
                }));
                const programId = new PublicKey(instr.programId);
                const data = Buffer.from(instr.data);
                const instruction = new TransactionInstruction({ keys, programId, data });

                // 2. Create the Versioned Transaction (using Legacy Message for safety)
                const messageLegacy = new TransactionMessage({
                    payerKey: publicKey,
                    recentBlockhash: latestBlockhash.blockhash,
                    instructions: [instruction],
                }).compileToLegacyMessage();

                const tx = new VersionedTransaction(messageLegacy);
                transactionsToSign.push(tx);
            }

            // ----------------------------------------------------
            // 🛑 NEW STEP: Use signAllTransactions 
            // Request the wallet to sign all transactions at once.
            // ----------------------------------------------------
            console.log("🚀 Requesting signature(s) from wallet...");
            const signedTransactions = await signAllTransactions(transactionsToSign);

            const signatures = [];

            for (const [i, signedTx] of signedTransactions.entries()) {
                // 3. Send the Raw Transaction
                const signature = await connection.sendRawTransaction(signedTx.serialize(), {
                    skipPreflight: true
                });
                signatures.push(signature);

                console.log(`✅ Transaction #${i + 1} Sent! Signature:`, signature);

                // 4. Confirm the transaction (using the retrieved signature and blockhash)
                const confirmation = await connection.confirmTransaction(
                    {
                        signature,
                        blockhash: latestBlockhash.blockhash,
                        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                    },
                    "confirmed"
                );

                if (confirmation.value.err === null) {
                    console.log(`https://solscan.io/tx/${signature}`);
                    console.log("🎉 Transaction Confirmed!");
                } else {
                    throw new Error(`Error subscription tokens: ${confirmation.value.err}`);
                }
            }

            setPrepare(true);
            toast.success("Subscription Approved Successfully!");

        } catch (err: unknown) {
            // ... (error handling remains the same)
            console.log(err)
        } finally {
            setLoading(false);
            console.log("🧹 Transaction attempt finished");
        }
    }




    const getBillingCycleDates = () => {
        const start = new Date();
        const renew = new Date(start);

        if (enabled) {
            renew.setMonth(start.getMonth() + duration.key);
        } else {
            renew.setMonth(start.getMonth() + 1);
        }

        const format = (d: Date) =>
            d.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

        return {
            startDate: format(start),
            renewDate: format(renew),
        };
    };

    return (
        <div className="w-full h-auto relative p-4">
            {/* AUTO RENEW */}
            <h5 className='text-lg text-black' >
                {bundle?.name}
            </h5>
            <br />
            <div className="w-full bg-gray-100 rounded-lg p-4">
                {/* Auto Renew Section */}
                <div className="flex items-start justify-between">
                    <h6 className="text-base lg:text-lg font-normal text-black mb-0 flex items-center gap-2">
                        Auto Renew Subscriptions
                    </h6>
                    <Switch checked={enabled} onChange={setEnabled} />
                </div>
                {!enabled ? (
                    <p className="text-base text-foreground font-normal my-4">
                        This bundle is active for the next 30 days .
                    </p>
                ) : (
                    <p className="text-base text-foreground font-normal my-4">
                        Select Duration
                    </p>
                )}
                {enabled ? (
                    <div className="w-full flex items-center justify-between gap-6">
                        {durations.map((d) => {
                            const active = d.key === duration.key;

                            return (
                                <div
                                    key={d.key}
                                    onClick={() => setDuration(d)}
                                    className={clsx(
                                        "border border-primary p-4 rounded-xl cursor-pointer w-full text-center transition-all duration-300 transform",
                                        active
                                            ? "bg-primary text-white scale-105"
                                            : "bg-transparent text-black"
                                    )}
                                >
                                    <p className="text-base font-medium">{d.label}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : ''}

                {/* Billing Cycle */}
                <div className="mt-6">
                    <p className="text-base text-black mb-2">
                        Billing Cycle
                    </p>
                    {(() => {
                        const { startDate, renewDate } = getBillingCycleDates();
                        return (
                            <>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm text-foreground">
                                        Start Date
                                    </p>
                                    <p className="text-sm text-black">
                                        {startDate}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-foreground">
                                        Renew Date
                                    </p>
                                    <p className="text-sm text-black">
                                        {renewDate}
                                    </p>
                                </div>
                            </>
                        );
                    })()}
                </div>

            </div>
            <br />
            {/* PAYMENT METHOD */}
            <h6 className="text-base lg:text-lg font-normal text-black mb-0 flex items-center gap-2">
                Select Payment Method
            </h6>
            <div className="grid grid-cols-3 gap-4 mt-2">
                {methods.map((m, i) => {
                    const selected = !m.disabled;
                    const styles = selected ? 'border border-primary bg-primary/10' : 'border border-gray-200'
                    return (
                        <div key={i} className={`relative w-full  p-4 rounded-xl ${styles}`}>
                            <span className="mb-2 block">
                                {m.icon}
                            </span>
                            <span className={`absolute top-4 right-4 w-5 h-5 border border-black rounded-full  flex items-center justify-center ${selected ? 'bg-black' : ''}`}>
                                {selected ? <Check size={15} className="text-white" /> : ''}
                            </span>
                            <h6 className="text-sm lg:text-lg text-black">{m.title}</h6>
                            <p className="text-foreground text-xs lg:text-sm mt-6">{m.text}</p>
                        </div>
                    )
                })}
            </div>
            <br />
            {/* PAYMENT CURRENCY */}
            <h6 className="text-base lg:text-lg font-normal text-black mb-0 flex items-center gap-2">
                Select Payment Currency
            </h6>
            <Select
                label=""
                options={currencies}
                value={currency}
                onChange={(value) => setCurrency(value)}
                placeholder="Select a Currency"
                error={''}
                disabled
            />
            <br />
            <div className="w-full flex items-center justify-between border border-gray-300 p-4 rounded-xl">
                <p className="text-base text-foreground">
                    You Pay
                </p>
                <h6 className="text-lg text-black">${bundle?.totalFirstDiscountedPrice}</h6>
            </div>
            <div className="mt-6 pb-10 flex flex-col gap-2">
                <Button disabled={prepare} loading={loading} onClick={approveSubscription} className="" variant="secondary" size="full">
                    Approve
                </Button>
                <Button disabled={!prepare} loading={loading} onClick={handleSubscribe} className="" variant="dark" size="full">
                    Subscribe
                </Button>
            </div>
            <PaymentSuccess open={success} subscription={subscription} />
        </div>
    );
};

export default PaymentForm;
