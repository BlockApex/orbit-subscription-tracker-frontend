import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className='w-full h-auto max-w-screen-2xl mx-auto relative overflow-hidden p-2 lg:p-4 mt-4'>
            <div className="max-w-full lg:max-w-7xl mx-auto px-3 lg:px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Logo and social icons */}
                <div className="flex flex-col gap-4">
                    <section className='flex items-center gap-4'>
                        <Image src='/assets/landing/logo.svg' alt='Logo' width={60} height={60} />
                        <h2 className='text-3xl text-primary-web font-semibold'>Bundl</h2>
                    </section>
                    <div className="flex items-center gap-3 mt-2">
                        <Link href='https://x.com/bundlsubs' target="_blank">
                            <Image src="/assets/landing/social/1.svg" alt="X" width={50} height={50} />
                        </Link>
                        <Link href='https://www.legends.fun/products/f47715cc-cd61-414e-83b9-229786e48817' target="_blank">
                            <Image src="/assets/landing/social/2.svg" alt="Instagram" width={50} height={50} />
                        </Link>
                    </div>
                </div>

                {/* Navigation links */}
                <div>
                    <h4 className="font-semibold text-black mb-3">Home</h4>
                    <ul className="flex flex-col gap-2 text-base mt-4">
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Features</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">How it Works</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Merchant</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-black mb-3">Support</h4>
                    <ul className="flex flex-col gap-2 text-base mt-4">
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Help Center</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Contact Us</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Privacy Policy</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Terms of Service</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-black mb-3">Social</h4>
                    <ul className="flex flex-col gap-2 text-base mt-4">
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Twitter</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Facebook</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">LinkedIn</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Instagram</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-black mb-3">Legal</h4>
                    <ul className="flex flex-col gap-2 text-base mt-4">
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Cookie Policy</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Terms of Use</Link></li>
                        <li><Link href="https://x.com/bundlsubs" target="_blank">Disclaimer</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
