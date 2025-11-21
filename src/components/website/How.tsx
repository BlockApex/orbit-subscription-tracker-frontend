"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Button from "./Button";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    tag: "Step 1",
    title: "Create your Bundle",
    description: "Pick the subscriptions you use. Bundl shows your all-in monthly cost and bundle savings in real time.",
    image: "/assets/landing/how/screen/1.png",
    list: (
      <ul className="text-base text-foreground-web list-disc ps-4 marker:text-primary-web marker:text-lg mt-6">
        <li>
          Search by category (AI, Entertainment, Design, etc.)
        </li>
        <li>
          Add/remove apps; see trial badges & discounts


        </li>
        <li>
          Works with your Solana wallet
        </li>
      </ul>
    )
  },
  {
    tag: "Step 2",
    title: "Choose how to pay",
    description: "Pay the way that fits your cashflow. You can switch anytime.",
    image: "/assets/landing/how/screen/2.png",
    list: (
      <ul className="text-base text-foreground-web list-disc ps-4 marker:text-primary-web marker:text-lg mt-6">
        <li>
          Smart Balance: Preload once; monthly costs auto-draw from balance; yield can offset fees
        </li>
        <li>
          Debit Wallet:  Autopay from wallet each cycle

        </li>
        <li>
          Yield-Only: Coming soon
        </li>
      </ul>
    )
  },
  {
    tag: "Step 3",
    title: "Confirm & activate",
    description: "Review your bundle, set billing cycle, and approve to start.",
    image: "/assets/landing/how/screen/3.png",
    list: (
      <ul className="text-base text-foreground-web list-disc ps-4 marker:text-primary-web marker:text-lg mt-6">

        <li>Selected apps & monthly total</li>
        <li>Payment method & next charge date</li>
        <li>One-tap approve in wallet</li>
      </ul>
    )
  },
  {
    tag: "Step 4",
    title: "Track & control everything",
    description: "One dashboard for all subscriptions on Bundl.",
    image: "/assets/landing/how/screen/4.png",
    list: (
      <ul className="text-base text-foreground-web list-disc ps-4 marker:text-primary-web marker:text-lg mt-6">

        <li>Pause / resume instantly</li>
        <li>Per-app limits & alerts</li>
        <li>Renewal reminders and spend analytics</li>
        <li>Import off-Bundl apps (beta) via email/statement parsing
        </li>
      </ul>
    )
  },
];

const How = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set all items invisible except the first
      textRefs.current.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));
      imageRefs.current.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${steps.length * 100}%`, // smoother progression
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      steps.forEach((_, i) => {
        if (i === 0) return;

        // Keep overlap so nothing disappears completely
        tl.to([textRefs.current[i - 1], imageRefs.current[i - 1]], {
          autoAlpha: 0.4, // keep slightly visible before switching
          duration: 0.5,
          ease: "power2.inOut",
        })
          .to([textRefs.current[i], imageRefs.current[i]], {
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.inOut",
          }, "<0.1") // slight overlap for smooth crossfade
          .to([textRefs.current[i - 1], imageRefs.current[i - 1]], {
            autoAlpha: 0, // fully fade out *after* next is visible
            duration: 0.3,
            ease: "power1.inOut",
          }, ">-0.2");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);


  return (
    <div className='w-full h-auto max-w-screen-2xl mx-auto relative overflow-hidden p-4 mt-4 hidden lg:block px-4 lg:px-10'>
      <section className='w-full flex flex-col lg:flex-row items-start lg:items-center justify-between'>
        <h1 className='text-3xl lg:text-5xl font-normal text-black'>
          How Bundl Works
        </h1>
        <div className="flex flex-col  lg:flex-row items-start lg:items-center gap-4">
          <p className="text-base text-foreground-web">
            No new Accounts, Just your Wallet
          </p>
          <Image src='/assets/landing/how/icons.svg' alt="icons" width={100} height={80} />
          <br className="block lg:hidden" />
          <Link href='/app'>
            <Button>
              Connect Now
            </Button>
          </Link>
        </div>
      </section>
      <div ref={containerRef} className="relative grid grid-cols-1 lg:grid-cols-2 w-full max-w-full lg:max-w-6xl mx-auto h-auto lg:h-screen  overflow-hidden">
        {/* Left Text */}
        <div className=" flex flex-col justify-center px-2 lg:px-12 relative">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { if (el) textRefs.current[i] = el }}
              className="relative lg:absolute left-0"
            >
              <span className="text-sm  text-black bg-primary-web/20 px-4 py-2 rounded-full">{step.tag}</span>
              <br />
              <br />

              <h2 className="text-3xl font-normal text-black mt-4">
                {step.title}</h2>
              <p className="text-base text-foreground-web mt-4">
                {step.description}
              </p>
              {step.list}
            </div>
          ))}
        </div>

        {/* Right Image */}
        <div className="w-full flex justify-center lg:justify-end items-center relative">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { if (el) imageRefs.current[i] = el }}
              className="relative lg:absolute right-0"
            >
              <Image src={step.image} alt={step.title} width={300} height={800} className="object-cover rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default How;
