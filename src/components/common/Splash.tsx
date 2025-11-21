"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // splash for 2 seconds
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary-web z-50">
                <Image
                    src="/assets/splashlogo.png" // put your logo path here
                    alt="App Logo"
                    width={300}
                    height={100}
                    className="animate-pulse"
                />
            </div>
        );
    }

    return <>{children}</>;
}
