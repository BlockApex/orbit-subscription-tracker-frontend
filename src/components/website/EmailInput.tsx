"use client"
import React, { useState } from 'react'
import Button from './Button'
import toast from 'react-hot-toast';
import { waitlist } from '@/app/services/auth.service';
import { AxiosError } from 'axios';

const EmailInput = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {

        if (!email.trim()) {
            toast.error("Please enter a valid email address");
            return;
        }
        try {
            setIsSubmitting(true);
            await waitlist(email);
            setIsSubmitting(false);
            toast.success("🎉 You’ve been added to the waitlist!");
            setEmail("");
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Something went wrong");
                return;
            }
            toast.error((err as Error)?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div
            className="
    flex items-center 
    justify-between 
    bg-white 
    border border-gray-300 
    rounded-2xl 
    overflow-hidden 
    transition-all duration-200
    focus-within:border-primary
    shadow-sm
    hover:shadow-md
  "
        >
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="
      flex-1 
      px-4 py-3 
      text-gray-700 
      placeholder-gray-400 
      outline-none 
      bg-transparent
    "
            />
            <Button onClick={handleSubmit}>
                {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>
        </div>

    )
}

export default EmailInput