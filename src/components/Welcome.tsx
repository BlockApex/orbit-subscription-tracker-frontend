"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./common/Button";
import { ChevronRight } from "lucide-react";

const Welcome = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has already seen welcome screen
        const hasVisited = localStorage.getItem("has_visited");
        if (!hasVisited) {
            setShow(true);
        }
    }, []);

    const handleStart = () => {
        localStorage.setItem("has_visited", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="max-w-full lg:max-w-3xl mx-auto fixed inset-0 flex flex-col items-center justify-around bg-white z-50 p-4">
            <div className="flex flex-col items-center gap-8">
                <Image
                    src="/assets/logo-text.svg"
                    alt="App Logo"
                    width={200}
                    height={100}
                />
                <Image
                    src="/assets/welcome.png"
                    alt="Welcome Illustration"
                    width={600}
                    height={1000}
                    className="mt-12 lg:max-w-[400px]"
                />
            </div>

            <div className="w-full p-4 flex flex-col items-center gap-8">
                <Button
                    variant="dark"
                    size="full"
                    className="flex items-center gap-2 lg:max-w-lg"
                    onClick={handleStart}
                >
                    Start Bundling <ChevronRight size={15} />
                </Button>
                <Image
                    src="/assets/solana.svg"
                    alt="Solana Logo"
                    width={150}
                    height={100}
                />
            </div>
        </div>
    );
};

export default Welcome;
