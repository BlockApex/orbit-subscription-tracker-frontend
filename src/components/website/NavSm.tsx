"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "./Button";
import Image from "next/image";

const NavSm = () => {
    const ref = useRef<HTMLDivElement | null>(null); // ✅ typed ref
    const [, setOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleOutsideClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.document) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            if (typeof window !== "undefined" && window.document) {
                document.removeEventListener("mousedown", handleOutsideClick);
            }
        };
    }, []);

    useEffect(() => {
        setOpen(false);
    }, []);

    return (
        <nav className="w-full h-auto fixed top-0 z-40 overflow-hidden  block lg:hidden">
            <div className="flex items-center justify-between bg-white p-4">
                <Link aria-label="logo" href="/" className="flex items-center">
                    <section className='flex items-center gap-4'>
                        <Image src='/assets/landing/logo.svg' alt='Logo' width={40} height={40} />
                        <h2 className='text-2xl text-primary-web font-semibold'>Bundl</h2>
                    </section>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href='/app'>
                        <Button>
                            Launch App
                        </Button>
                    </Link>
                    <button onClick={toggleDrawer} aria-label="Toggle menu">
                        <Menu className="w-6 h-6 text-black" />
                    </button>
                </div>
            </div>

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 flex justify-between items-center">
                    <section className='flex items-center gap-4'>
                        <Image src='/assets/landing/logo.svg' alt='Logo' width={40} height={40} />
                        <h2 className='text-2xl text-primary-web font-semibold'>Bundl</h2>
                    </section>
                    <button onClick={toggleDrawer} aria-label="Close menu">
                        <X className='w-6 h-6 text-dark' />
                    </button>
                </div>
                <div className="w-full h-auto relative">
                    <div className="flex flex-col items-center gap-8">
                        <Link href='/' className='text-base text-foreground-web'>
                            Home
                        </Link>
                        <Link href='/' className='text-base text-foreground-web'>
                            Features
                        </Link>
                        <Link href='/' className='text-base text-foreground-web'>
                            How it works
                        </Link>
                        <Link href='/' className='text-base text-foreground-web'>
                            Merchant
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavSm;
