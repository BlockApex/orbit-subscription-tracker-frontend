import React, { useState } from 'react'
import { Modal } from './common/Modal'
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuthStore } from '../store/authStore';
import { getVerificationMessage, login } from '../services/auth.service';
import bs58 from 'bs58';
import toast from 'react-hot-toast';
import { Button } from './common/Button';
import Image from 'next/image';


interface LoginModalProps {
    open: boolean;
    setOpen: (o: boolean) => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ open, setOpen }) => {
    const { publicKey, signMessage, disconnect } = useWallet();
    const {  setAuthenticated } = useAuthStore();
    const [loading, setLoading] = useState(false);


    const handleLogin = async () => {
        if (!signMessage || !publicKey) {
            console.error("Wallet does not support message signing");
            return;
        }
        try {
            setLoading(true);
            // Get verification message from backend
            const response = await getVerificationMessage();
            if (!response?.message) throw new Error('Failed to get verification message');
            // Sign it
            const encodedMessage = new TextEncoder().encode(response.message);
            const signature = await signMessage(encodedMessage);

            // Convert and send to backend
            const publicKeyBase58 = publicKey.toBase58();
            const signatureBase58 = bs58.encode(signature);
            const authResponse = await login(publicKeyBase58, signatureBase58);
            localStorage.setItem('token' , authResponse.token)
            console.log('✅ Auth response:', authResponse);
            setAuthenticated(true);
            setOpen(false);
            toast.success('Login successful!');
        } catch (err: unknown) {
            console.error('❌ Login error:', err);
            toast.error('Login failed');
            disconnect();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title='' isOpen={open} onClose={() => setOpen(false)}>
            <div className="w-full flex flex-col items-center justify-center p-4">
                {/* ✅ Success Illustration */}
                <Image
                    src="/assets/logo.svg"
                    alt="Success"
                    width={120}
                    height={120}
                    className="mb-4"
                />
                <p className='text-base text-foreground text-center my-6'>
                    Wallet is connected please sign a message to login
                </p>
                <Button loading={loading} variant='dark' size='full' onClick={handleLogin}>
                    Login
                </Button>
            </div>
        </Modal>
    )
}

export default LoginModal