'use client';
import React, { useEffect, useState } from 'react';
import { LogOut, Wallet2 } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuthStore } from '@/app/store/authStore';;
import toast from 'react-hot-toast';
import LoginModal from '../LoginModal';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Api } from '@/app/config';

const Wallet = () => {
    const { publicKey, disconnect, connected } = useWallet();
    const { isAuthenticated, setAuthenticated } = useAuthStore();
    const { setVisible } = useWalletModal();

    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await disconnect();
            setAuthenticated(false);
            delete Api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
            toast.success('Logged out successfully.');
        } catch (error) {
            console.log(error)
            toast.error('Failed to logout. Try again.',);
        }
    };


    useEffect(() => {
        if (connected && !isAuthenticated) {
            setOpen(true)
        }
    }, [connected, isAuthenticated])

    return (
        <div className="flex flex-col items-center gap-3">
            {isAuthenticated && connected ? (
                <div className="flex items-center gap-2">
                    <p className="wallet_button">
                        <Wallet2 size={15} />
                        {publicKey?.toBase58().slice(0, 4)}...
                        {publicKey?.toBase58().slice(-4)}
                    </p>
                    <button className="wallet_button" onClick={handleLogout}>
                        <LogOut />
                    </button>
                </div>
            ) : (
                <button
                    className="wallet_button"
                    onClick={() => {
                        setVisible(true)
                    }}
                >
                    <Wallet2 size={15} />
                    Connect
                </button>
            )}
            {/* <button className="wallet_button" onClick={handleLogout}>
                <LogOut />
            </button> */}
            <LoginModal open={open} setOpen={setOpen} />
        </div>
    );
};

export default Wallet;
