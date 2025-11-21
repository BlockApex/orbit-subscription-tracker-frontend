"use client";
import React from "react";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

const steps = [
  {
    tag: "Step 1",
    title: "Create your Bundle",
    description: "Pick the subscriptions you use. Bundl shows your all-in monthly cost and bundle savings in real time.",
    image: "/assets/landing/how/screen/1.png",
    list: (
      <ul className="text-base text-foreground-web flex flex-col gap-2 marker:text-primary-web marker:text-lg mt-6 text-center">
        <li>Search by category (AI, Entertainment, Design, etc.)</li>
        <li>Add/remove apps; see trial badges & discounts</li>
        <li>Works with your Solana wallet</li>
      </ul>
    ),
  },
  {
    tag: "Step 2",
    title: "Choose how to pay",
    description: "Pay the way that fits your cashflow. You can switch anytime.",
    image: "/assets/landing/how/screen/2.png",
    list: (
      <ul className="text-base text-foreground-web flex flex-col gap-2 marker:text-primary-web marker:text-lg mt-6 text-center">
        <li>Smart Balance: Preload once; monthly costs auto-draw from balance; yield can offset fees</li>
        <li>Debit Wallet: Autopay from wallet each cycle</li>
        <li>Yield-Only: Coming soon</li>
      </ul>
    ),
  },
  {
    tag: "Step 3",
    title: "Confirm & activate",
    description: "Review your bundle, set billing cycle, and approve to start.",
    image: "/assets/landing/how/screen/3.png",
    list: (
      <ul className="text-base text-foreground-web flex flex-col gap-2 marker:text-primary-web marker:text-lg mt-6 text-center">
        <li>Selected apps & monthly total</li>
        <li>Payment method & next charge date</li>
        <li>One-tap approve in wallet</li>
      </ul>
    ),
  },
  {
    tag: "Step 4",
    title: "Track & control everything",
    description: "One dashboard for all subscriptions on Bundl.",
    image: "/assets/landing/how/screen/4.png",
    list: (
      <ul className="text-base text-foreground-web flex flex-col gap-2 marker:text-primary-web marker:text-lg mt-6 text-center">
        <li>Pause / resume instantly</li>
        <li>Per-app limits & alerts</li>
        <li>Renewal reminders and spend analytics</li>
        <li>Import off-Bundl apps (beta) via email/statement parsing</li>
      </ul>
    ),
  },
];

const HowMob = () => {
  return (
    <div className="block lg:hidden w-full h-auto max-w-screen-md mx-auto relative overflow-hidden px-4 lg:px-10 mt-8">
      {/* Header */}
      <section className="w-full flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-3xl font-semibold text-black">How Bundl Works</h1>
        <p className="text-base text-foreground-web">No new Accounts, Just your Wallet</p>
        <Image src="/assets/landing/how/icons.svg" alt="icons" width={120} height={80} />
        <Link href='/app'>
               <Button>Connect Now</Button>
        </Link>
      </section>

      {/* Steps */}
      <div className="mt-10 flex flex-col gap-12">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center px-2">
            <span className="text-sm text-black bg-primary-web/20 px-4 py-2 rounded-full">
              {step.tag}
            </span>
            <Image
              src={step.image}
              alt={step.title}
              width={280}
              height={200}
              className="object-cover rounded-xl my-6"
            />
            <h2 className="text-2xl font-semibold text-black mt-2">{step.title}</h2>
            <p className="text-base text-foreground-web mt-3">{step.description}</p>
            <div className="text-left w-full flex items-center justify-center">{step.list}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowMob;
