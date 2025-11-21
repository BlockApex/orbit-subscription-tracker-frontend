import React from "react";
import Image from "next/image";

const features = [
    {
        icon: "/assets/landing/why/3.svg",
        title: "Track & control subscriptions you already pay for, from one dashboard.",
        position: "left-top",
    },
    {
        icon: "/assets/landing/why/2.svg",
        title: "Exclusive discounts for your bundles, bundl more, save more",
        position: "left-bottom",
    },
    {
        icon: "/assets/landing/why/1.svg",
        title: "Manage & swap subscriptions in one place with automatic retries and real-time alerts.",
        position: "top",
    },
    {
        icon: "/assets/landing/why/4.svg",
        title: "Optional yield to offset costs",
        position: "right-top",
    },
    {
        icon: "/assets/landing/why/5.svg",
        title: "Set spend caps, category budgets, and renewal reminders.",
        position: "right-bottom",
    },
];

const Why = () => {
    return (
        <div className="w-full max-w-full xl:max-w-screen-xl mx-auto relative overflow-hidden px-4 lg:px-10 py-12 mt-4">
            <div className="relative w-full flex flex-col items-center justify-center">
                {/* Desktop Layout */}
                <div className="hidden md:flex relative w-full items-center justify-center mt-10">
                    {/* Center Image */}
                    <div className="relative p-20 flex items-center justify-center">
                        {/* Background Image */}
                        <Image
                            src="/assets/landing/why/bg.png"
                            alt="Why Choose Bundl"
                            width={600}
                            height={500}
                            className="object-contain"
                        />
                        {/* Centered Text Overlay */}
                        <h1 className="absolute text-3xl lg:text-5xl font-normal text-black text-center pb-20">
                            Why People Choose Bundl
                        </h1>
                    </div>
                    {/* Floating Feature Boxes */}
                    {features.map((f, i) => {
                        const baseClass = "absolute p-3 md:p-4 text-left";
                        let textClass = "text-base text-black font-medium mt-2 max-w-[200px]";
                        let positionClass = "";
                        let txtPosition = "";

                        switch (f.position) {
                            case "left-top":
                                positionClass = "top-16 left-[0%]";
                                txtPosition = "items-start";
                                break;
                            case "left-bottom":
                                positionClass = "bottom-12 left-[0%]";
                                txtPosition = "items-start";
                                break;
                            case "right-top":
                                positionClass = "top-16 right-[0%]";
                                txtPosition = "items-start";
                                break;
                            case "right-bottom":
                                positionClass = "bottom-0 right-[0%]";
                                txtPosition = "items-start";
                                break;
                            case "top":
                                positionClass = "-top-10 left-1/2 -translate-x-1/2";
                                txtPosition = "items-center";
                                textClass += " text-center";
                                break;
                        }

                        return (
                            <div
                                key={i}
                                className={`${baseClass} ${positionClass} flex flex-col ${txtPosition} justify-center`}
                            >
                                <div className="w-12 h-12 bg-primary-web rounded-lg flex items-center justify-center">
                                    <Image src={f.icon} width={20} height={20} alt="icon" />
                                </div>
                                <p className={textClass}>{f.title}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Layout */}
                <div className="flex flex-col items-center justify-start gap-6 md:hidden mt-6 p-4">
                    <h1 className='text-3xl lg:text-5xl font-normal text-black text-left'>
                        Why People Choose Bundl
                    </h1>
                    <Image
                        src="/assets/landing/why/bg.png"
                        alt="Why Choose Bundl"
                        width={250}
                        height={250}
                        className="object-contain"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="w-full"
                            >
                                <div className="w-12 h-12 bg-primary-web rounded-lg flex items-center justify-center mb-2">
                                    <Image src={f.icon} width={20} height={20} alt="icon" />
                                </div>
                                <p className="text-base text-black font-medium">{f.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Why;
