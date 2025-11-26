"use client";
import React, { useState } from "react";
import { Modal } from "../common/Modal";
import Image from "next/image";
import { Service } from "@/types/bundle.types";

interface TierModalProps {
  open: boolean;
  setOpen: (o: boolean) => void;
  service: Service | null;
  onSelectPackage: (serviceId: string, pkgId: string) => void;
}

const TierModal: React.FC<TierModalProps> = ({ open, setOpen, service, onSelectPackage }) => {
  const [selectedTier] = useState<string | null>(null);

  if (!service) return null;

  return (
    <Modal title="" isOpen={open} onClose={() => setOpen(false)} h={80}>
      <div className="w-full h-auto relative px-2 py-8">
        <div className="w-full h-full flex items-start justify-between gap-4">
          <Image src={service.logo} alt={service.name} width={50} height={50} className="rounded-lg" />
          <div className="w-full">
            <h6 className="text-md font-normal text-black">{service.name}</h6>
            <p className="text-sm text-foreground font-normal">{service.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {service.packages.map((pkg) => {
            const isSelected = selectedTier === pkg._id;
            const discountOffer = pkg.offers.find((o) => o.type === "%discount");
            const freeOffer = pkg.offers.find((o) => o.type === "free");

            return (
              <div
                key={pkg._id}
                // onClick={() => setSelectedTier(pkg._id)}
                className={`w-full rounded-2xl border p-4 cursor-pointer transition-all 
                  ${isSelected ? "border-primary shadow-sm" : "border-gray-300"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg text-black">{pkg.name}</p>
                    <p className="text-base font-normal text-black">
                      ${pkg.amount.toFixed(2)}/{pkg.frequency}
                    </p>
                  </div>
                  <span
                    onClick={() => {
                      onSelectPackage(service._id, pkg._id);
                      setOpen(false);
                    }}
                    className={`px-6 py-1 border rounded-xl text-sm font-medium transition-all ${isSelected ? "bg-primary border-primary text-white" : "border-primary text-primary"
                      }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </span>
                </div>

                <hr className="border-b border-gray-200 my-4" />
                <p className="text-sm text-foreground">{pkg.description}</p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {discountOffer && (
                    <span className="px-3 py-1 text-primary text-xs bg-primary/20 rounded-lg">
                      {discountOffer.amount}% off
                    </span>
                  )}
                  {freeOffer && (
                    <span className="px-3 py-1 text-green-600 text-xs bg-green-100 rounded-lg">
                      {freeOffer.period} Free Trial
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default TierModal;
