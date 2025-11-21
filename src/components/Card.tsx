import { CopyIcon, Eye } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CardProps {
    showOptions?: boolean;
    last4Digits?: string; // 👈 optional, dynamic last 4 digits
}

const Card: React.FC<CardProps> = ({ showOptions = false, last4Digits = "1234" }) => {
    return (
        <div className="w-[300px] min-h-[350px] bg-black rounded-xl card-bg  relative flex-shrink-0 text-white">
            {/* Top icons */}
            <section className="flex items-center justify-between gap-4 px-4 py-6">
                <Image src="/assets/visa.svg" alt="visa" width={50} height={50} />
                <Image src="/assets/mock/bundle/1.png" alt="bundle" width={40} height={40} />
            </section>
            <section className="w-full min-h-[250px] relative">
                {/* Card logo */}
                <div className="absolute bottom-0 right-0">
                    <Image src="/assets/card-logo.svg" alt="card logo" width={150} height={150} />
                    <Image
                        src="/assets/chip.svg"
                        alt="chip"
                        width={60}
                        height={60}
                        className="absolute bottom-0 right-7"
                    />
                </div>
            </section>
            {showOptions ? (
                <div>
                    <section className="w-full px-4 py-6 ">
                        <div className="flex items-center justify-between">
                            <p className="flex flex-col gap-2">
                                {Array(3)
                                    .fill(0)
                                    .map((_, i) => (
                                        <span key={i} className="flex gap-2">
                                            {Array(4)
                                                .fill(0)
                                                .map((_, j) => (
                                                    <span
                                                        key={j}
                                                        className="w-2 h-2 bg-white rounded-full inline-block"
                                                    ></span>
                                                ))}
                                        </span>
                                    ))}
                                <span className="text-lg font-semibold tracking-[0.1em]">
                                    {last4Digits.split("").join(" ")}
                                </span>
                            </p>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p>
                                        Exp Date
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>/
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p>
                                        CVC
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>
                                        <span
                                            className="w-2 h-2 bg-white rounded-full inline-block"
                                        ></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="w-full px-4 py-6 flex items-center justify-between gap-4">
                        <button className="w-full flex items-center gap-2 bg-dark px-4 py-2 rounded-xl">
                            Copy
                            <CopyIcon size={16} />
                        </button>
                        <button className="w-full flex items-center gap-2 bg-dark px-4 py-2 rounded-xl">
                            Reveal
                            <Eye size={16} />
                        </button>
                    </section>
                </div>
            ) : ''}
        </div>
    );
};

export default Card;
