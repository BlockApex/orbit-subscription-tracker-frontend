"use client";
import React, { useState } from "react";
import Button from "./Button";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { waitlist } from "@/app/services/auth.service";
import { AxiosError } from "axios";

const CTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="w-full h-auto bg-primary-web relative overflow-hidden mt-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full h-[100px] absolute top-0">
        <Image src="/assets/landing/line.png" fill alt="CTA" className="object-cover" />
      </div>

      <section className="flex flex-col items-center justify-center gap-6 p-4 mt-10 lg:mt-20">
        <h1 className="text-3xl lg:text-5xl font-normal text-white text-center">
          Bundl turns subscription chaos into <br /> one simple stream.
        </h1>
        <p className="text-lg text-white text-center">
          No more random billing dates, surprise charges or failed payments.
        </p>

        <form
          onSubmit={handleSubmit}
          className="
            flex items-center 
            justify-between 
            bg-primary-web 
            border border-white 
            rounded-2xl 
            overflow-hidden 
            transition-all duration-200
            focus-within:border-white
            shadow-sm
            hover:shadow-md
            w-full max-w-md
          "
        >
          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              flex-1 
              px-4 py-3 
              text-white
              placeholder-white 
              outline-none
              bg-transparent
            "
          />
          <Button dark={true}>
            {isSubmitting ? "Submitting..." : "Join Waitlist"}
          </Button>
        </form>

        <p className="text-base text-white text-center">
          Get notified when Bundl goes live.
        </p>
      </section>

      <div className="w-full h-[700px] relative">
        <Image src="/assets/landing/cta.png" fill alt="CTA" className="object-cover" />
      </div>
    </div>
  );
};

export default CTA;
