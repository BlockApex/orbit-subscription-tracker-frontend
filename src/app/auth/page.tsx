"use client";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const Login = () => {
    const router = useRouter();

    return (
        <main className="w-full bg-white min-h-screen relative overflow-hidden p-4 flex flex-col items-center justify-between">
            {/* Hero Image */}
            <div className="w-full lg:max-w-md mx-auto flex items-center justify-center mt-8 lg:mt-2">
                <Image
                    src="/assets/login.png"
                    alt="Login Main Image"
                    width={500}
                    height={500}
                    className="max-w-full h-auto"
                />
            </div>

            {/* Logo + Intro Text */}
            <div className="flex flex-col items-center gap-3 text-center mt-4">
                <Image src="/assets/logo.svg" alt="Logo" width={120} height={120} />
                <p className="text-base text-foreground max-w-sm">
                    "Track, manage, and stay on top of <span className="text-secondary font-medium">all your subscriptions</span> with SubTrack.
                    Plans, payments, and reminders — all in one app."
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center gap-4 w-full max-w-sm my-8">
                <Button onClick={()=>router.push('/countries')}  variant="primary" size="full" >Get Started</Button>
            </div>

            {/* Footer */}
            <p className="text-sm text-foreground text-center mb-4 max-w-md">
                By signing in, you agree to the{" "}
                <span className="text-secondary cursor-pointer hover:underline">
                    User Agreement
                </span>{" "}
                and{" "}
                <span className="text-secondary cursor-pointer hover:underline">
                    Privacy Policy
                </span>{" "}
                of HuddleUp Protocol — empowering transparency in social impact.
            </p>
        </main>
    );
};

export default Login;
