"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, MoveRight, Search } from "lucide-react";
import Input from "@/components/common/Input";
import Image from "next/image";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import { Button } from "@/components/common/Button";
import { getCategories, getMerchants, getMyPaymentMethods, getPaymentRails, searchMerchant } from "@/services/misc.service";
import toast from "react-hot-toast";
import { Spinner } from "@/components/common/Spinner";
import Merchant from "@/components/Merchant";
import { useMiscStore } from "@/store/miscStore";



export interface MerchantType {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  default_category_id?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillingCycle {
  name: string;
  value: string;
}

export interface Subscription {
  merchant: MerchantType | { _id: string; name: string; logo?: string; website?: string }; // supports custom
  monthlyPrice: number | string;
  billingCycle: BillingCycle;
  renewDate?: string;
  category?: string;
  freeTrial?: boolean;
  active?: boolean;
  isEdit?: boolean;
  paymentMethod?: string;
}




const ImportManualSubscription: React.FC = () => {
  const { setRails, setMethods, setCategories } = useMiscStore();
  const [merchants, setMerchants] = useState<MerchantType[] | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedItem, setSelectedItem] = useState<MerchantType | Subscription | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState<MerchantType[]>([]);
  const [searching, setSearching] = useState(false);

  const isEditing = selectedItem && "billingCycle" in selectedItem;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch merchants
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const data = await getMerchants();
        const paymentRails = await getPaymentRails();
        const methods = await getMyPaymentMethods();
        const categories = await getCategories();
        setCategories(categories);
        setMethods(methods);
        setRails(paymentRails);
        setMerchants(data);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch merchants");
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  // Search merchants
  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      return;
    }
    const fetchSearchResults = async () => {
      try {
        setSearching(true);
        const data = await searchMerchant(debouncedSearch);
        setSearchResults(data);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Search failed");
      } finally {
        setSearching(false);
      }
    };
    fetchSearchResults();
  }, [debouncedSearch]);

  const handleOpenModal = (item: MerchantType | Subscription | undefined) => {
    setSelectedItem(item || null);
    setOpen(true);
  };

  const handleAddSubscription = (subs: Subscription) => {
    if (subs.isEdit) {
      setSubscriptions(prev =>
        prev.map(s => s.merchant._id === subs.merchant._id ? subs : s)
      );
    } else {
      setSubscriptions(prev => [...prev, subs]);
    }
  };

  const removeSubscription = (m: MerchantType) => {
    setSubscriptions(prev => prev.filter(s => s.merchant._id !== m._id));
  };

  const subscribedMerchantIds = new Set(subscriptions.map(s => s.merchant._id));

  const filteredMerchants =
    merchants?.filter(
      m => !subscribedMerchantIds.has(m._id) && m.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

  return (
    <main className="w-full min-h-screen bg-gray-50 relative overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center gap-4 py-5 sticky top-0 bg-gray-50 z-10">
        <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
          <ChevronLeft className="text-white" />
        </button>
        <h5 className="text-xl font-normal text-gray-900">Companies</h5>
      </div>

      <div className="w-full flex flex-col gap-4 mt-4">
        <Input
          label=""
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search for company"
          className="text-black"
          icon={<Search className="text-dark" />}
        />

        <div className="w-full max-h-[600px] lg:max-h-[500px] overflow-y-scroll flex flex-col gap-4">
          {/* Add Custom Subscription */}
          <div
            onClick={() => handleOpenModal(undefined)}
            className="w-full flex items-center justify-between gap-4 bg-secondary/20 border border-gray-300 p-4 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Image src="/assets/custom-subs.svg" width={40} height={40} alt="Add Custom Subscription" className="rounded-xl" />
              <p>Add Custom Subscription</p>
            </div>
            <ChevronRight className="text-foreground" size={17} />
          </div>

          {/* Existing Subscriptions */}
          {subscriptions.map((s) => {
            const m = s.merchant;
            return (
              <div key={m._id} className="w-full bg-primary/20 flex items-center border border-primary p-4 rounded-xl">
                <button
                  onClick={() => removeSubscription(m)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-foreground me-3 bg-primary"
                >
                  <Check size={17} className="text-white" />
                </button>
                <div
                  onClick={() => handleOpenModal(s)}
                  className="w-full flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={(m as MerchantType).logo || '/assets/custom-subs.svg'}
                      width={40}
                      height={40}
                      alt={m.name}
                      className="rounded-xl"
                      unoptimized
                    />
                    <div>
                      <p className="flex items-center gap-2">{m.name}</p>
                      <small className="text-sm text-foreground">
                        {`$${s.monthlyPrice}/${s.billingCycle.name.toLowerCase().replace("ly", "")}`}
                      </small>
                    </div>
                  </div>
                  <ChevronRight className="text-foreground" size={17} />
                </div>
              </div>
            );
          })}

          {searching ? (
            <div className="w-full flex items-center justify-center py-4"><Spinner /></div>
          ) : searchResults.length > 0 ? (
            searchResults.map((m) => <Merchant key={m._id} c={m} handleOpenModal={handleOpenModal} />)
          ) : null}

          {loading ? (
            <div className="w-full flex items-center justify-center py-4"><Spinner /></div>
          ) : filteredMerchants && filteredMerchants.length > 0 ? (
            filteredMerchants.map((m) => <Merchant key={m._id} c={m} handleOpenModal={handleOpenModal} />)
          ) : (
            <p className="text-center text-gray-500 py-4">No merchant found</p>
          )}
        </div>
      </div>

      {/* Checkout Section */}
      <section className="w-full z-40 lg:max-w-3xl mx-auto flex items-center justify-center fixed bottom-0 left-0 right-0 p-2">
        <div className="w-full max-w-[100%] bg-primary shadow-2xl p-2 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 p-4">
            <div className="flex items-center -space-x-2">
              {subscriptions.length > 0 && (
                <>
                  <Image
                    key={subscriptions[0].merchant._id}
                    src={subscriptions[0].merchant.logo || '/assets/custom-subs.svg'}
                    alt={subscriptions[0].merchant.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-primary bg-white"
                    unoptimized
                  />
                  {subscriptions.length > 1 && (
                    <div
                      className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold border-2 border-primary z-10"
                      title={`And ${subscriptions.length - 1} more subscriptions`}
                    >
                      +{subscriptions.length - 1}
                    </div>
                  )}
                </>
              )}
            </div>
            {subscriptions.length > 0 && (
              <p className="text-sm lg:text-base text-white font-normal">
                {subscriptions.length} Subscriptions
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 p-4">
            <Button variant="light" size="sm" className="flex items-center gap-2" disabled={subscriptions.length === 0}>
              Continue <MoveRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      <AddSubscriptionModal
        open={open}
        setOpen={setOpen}
        item={selectedItem}
        isEditing={isEditing!}
        handleAddSubscription={handleAddSubscription}
      />
    </main>
  );
};

export default ImportManualSubscription;
