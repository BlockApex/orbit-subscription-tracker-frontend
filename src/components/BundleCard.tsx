'use client';
import { Sparkle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { isColorDark, hexToRGBA, lightenColor, isSubscription, capitalizeFirstLetter } from "../utils";
import { Bundle, MyBundle } from "../types/bundle.types";

export interface BundleCardProps {
  bundle: Bundle | MyBundle;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const router = useRouter();
  // ✅ Normalize bundle data — unify access whether it's Subscription or Bundle
  const normalized = isSubscription(bundle) ? bundle.bundle : bundle;

  const maxVisible = 4;
  const visibleItems = normalized.selectedPackages.slice(0, maxVisible);
  const remainingCount = normalized.selectedPackages.length - maxVisible;
  const categories = [
    ...new Set(normalized.selectedPackages.map((p) => p.service?.category)),
  ];

  // 🧮 Calculate savings and percent (based on backend fields)
  const savings =
    normalized.totalOriginalPrice - normalized.totalFirstDiscountedPrice;
  const percent = (
    (savings / normalized.totalOriginalPrice) *
    100
  ).toFixed(1);

  // 🎨 Dynamic color logic
  const isDarkBg = isColorDark(normalized.color);
  const textColor = isDarkBg ? "text-white" : "text-black";
  const borderColor = isDarkBg ? "border-white" : "border-black";
  const shadowColor = hexToRGBA(normalized.color, 0.1);
  const lightBg = lightenColor(normalized.color, 35);


  const handleRoute = () => {
    let route;
    if (isSubscription(bundle) && bundle.status !== 'intended') {
      route = `/subscription/${bundle._id}`
    } else if (isSubscription(bundle) && bundle.status === 'intended') {
      route = `/bundles/${bundle.bundle._id}`
    } else {
      route = `/bundles/${bundle._id}`
    }
    router.push(route)
  }
  return (
    <div
      className="w-full h-auto p-4 rounded-xl transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: normalized.color,
        boxShadow: `0px 15px 30px ${shadowColor}`,
      }}
      onClick={() => handleRoute()}
    >
      <div className="flex items-center justify-between">
        <h5 className={`text-xl font-medium ${textColor}`}>
          {normalized.name}
        </h5>
      </div>

      <div className="flex items-center gap-2">
        {categories.length > 2 ? categories.slice(0, 2).map((c, i) => (
          <span
            key={i}
            className={`px-3 py-1 text-sm ${textColor} rounded-lg capitalize`}
            style={{ backgroundColor: lightBg }}
          >
            {c}
          </span>
        )) : categories.map((c, i) => (
          <span
            key={i}
            className={`px-3 py-1 text-sm ${textColor} rounded-lg capitalize`}
            style={{ backgroundColor: lightBg }}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="flex items-center mt-4">
        {visibleItems.map((item, i) => (
          <div
            key={i}
            className={`${i !== 0 ? "-ml-3" : ""} w-10 h-10 rounded-full border-2 ${borderColor} overflow-hidden`}
          >
            <Image
              src={item.service.logo}
              alt="service"
              width={40}
              height={40}
              className="object-cover bg-white"
            />
          </div>
        ))}

        {remainingCount > 0 && (
          <p className={`ms-4 text-base font-normal ${textColor}`}>
            +{remainingCount} services
          </p>
        )}
      </div>

      <div className="w-full flex items-baseline justify-between mt-4">
        <div>
          <p className={`text-base font-normal flex items-center gap-2 ${textColor}`}>
            <Sparkle size={16} /> $
            {normalized.totalFirstDiscountedPrice.toFixed(2)} /{normalized.frequency}
          </p>
          <small className={textColor}>
            Save ${savings.toFixed(2)} ({percent}%)
          </small>
        </div>

        {/* ✅ Conditionally show "Subscription" tag */}
        {isSubscription(bundle) && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md ${textColor}`}
            style={{ backgroundColor: lightBg }}
          >
            {capitalizeFirstLetter(bundle?.status === 'intended' ? 'draft' : bundle.status)}
          </span>
        )}
      </div>
    </div>
  );
};

export default BundleCard;
