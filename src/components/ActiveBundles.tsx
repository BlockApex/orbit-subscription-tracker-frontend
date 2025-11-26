"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { recentActiveBundles } from '@/services/bundle.service';
import { Subscription } from '@/types/bundle.types';
import { Spinner } from '@/components/common/Spinner';
// import toast from 'react-hot-toast';
import { capitalizeFirstLetter } from '../utils';

const ActiveBundles = () => {
  const router = useRouter();
  const [bundles, setBundles] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true);
        const data = await recentActiveBundles();
        setBundles(data || []);
      } catch (err: unknown) {
        console.error(err);
        // toast.error("Failed to fetch active bundles");
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const hasBundles = bundles && bundles.length > 0;


  const handleRoute = (bundle: Subscription) => {
    router.push(bundle.status === 'intended' ? `/bundles/${bundle.bundle._id}` : `/subscription/${bundle._id}`)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-base text-foreground font-normal '>Active Bundles</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <Spinner />
        </div>
      ) : hasBundles ? (
        <div className='flex items-center flex-nowrap overflow-x-scroll gap-4 mt-2 cursor-pointer'>
          {bundles.map((bundle, i) => {
            const { bundle: innerBundle } = bundle; // extract nested bundle object
            const maxVisible = 4;
            const visibleItems = innerBundle.selectedPackages.slice(0, maxVisible);
            const remainingCount = innerBundle.selectedPackages.length - maxVisible;

            // 🎨 Style logic (use bundle.color if exists)
            const bgColor = innerBundle.color || '#1E293B';
            const textColor = 'text-white';
            const borderColor = 'border-white';
            const shadow = 'shadow-[0px_15px_28px_0px_rgba(0,0,0,0.1)]';

            return (
              <div
                className={`w-full h-auto p-4 rounded-xl min-w-[230px] ${shadow}`}
                key={i}
                style={{ backgroundColor: bgColor }}
                onClick={() => handleRoute(bundle)}

              >
                <div className="">
                  <span className='px-2 py-1 text-white text-xs rounded-xl bg-primary/30'>{capitalizeFirstLetter(bundle.status === 'intended' ? "Draft" : bundle.status)}</span>
                  <h5 className={`text-base font-medium ${textColor}`}>{innerBundle.name}</h5>
                </div>

                <div className="flex items-center mt-4">
                  {visibleItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`${idx !== 0 ? "-ml-3" : ""} w-7 h-7 rounded-full border-2 ${borderColor} overflow-hidden`}
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className='w-full h-auto p-4 rounded-xl border border-dashed border-gray-400 flex items-start gap-4'>
          <Image src='/assets/cactus.svg' alt='No active bundle' width={60} height={60} />
          <div className='flex flex-col'>
            <h5 className={`text-xl font-medium text-foreground`}>
              No active bundles yet
            </h5>
            <p className='text-base text-foreground'>
              Build one and invite friends to earn
            </p>
            <Link href='/create' className='text-base text-primary flex items-center gap-2 mt-1'>
              Create your first bundle <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBundles;
