"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, MoveRight, Search } from "lucide-react";
import Input from "@/components/common/Input";
import Image from "next/image";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";
import { Button } from "@/components/common/Button";
import { getCategories, getMerchants, getMyPaymentMethods, getPaymentRails, searchMerchant } from "@/services/misc.service";
import toast from "react-hot-toast";
import { Spinner } from "@/components/common/Spinner";
import Merchant from "@/components/Merchant";
import { useMiscStore } from "@/store/miscStore";
import { createSubscription, deleteSubscription, updateSubscription } from "@/services/subscription.service";



export interface MerchantType {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  default_category_id?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  custom?: boolean;

}

export interface BillingCycle {
  name: string;
  value: string;
}

export interface Subscription {
  _id?: string;
  merchant: MerchantType | { _id?: string; name: string; logo?: string; website?: string, custom?: boolean }; // supports custom
  packageName?: string;
  category: string;
  frequency: string;
  price: string;
  paymentMethod: string;
  isOnFreeTrial: boolean;
  nextPaymentDate: string;
  active?: boolean;
  isEdit?: boolean;
}




const ImportManualSubscription: React.FC = () => {
  const router = useRouter();
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

  const isEditing = selectedItem && "frequency" in selectedItem;

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


  const handleAddSubscription = async (subs: Subscription) => {
    const toastId = "add-subs";

    toast.loading(subs.isEdit ? "Updating subscription..." : "Saving subscription...", { id: toastId });

    try {
      // Prepare payload
      const data: Omit<Subscription, "merchant"> & {
        currency: string;
        merchant: string | {
          name: string;
          logo?: string;
          website?: string;
          custom?: boolean;
        };
      } = {
        ...subs,
        currency: "691f1f84c2b239c4a506fd0c"
      };

      if (subs.merchant && typeof subs.merchant !== "string" && subs.merchant.custom) {
        data.merchant = {
          name: subs.merchant.name,
          logo: subs.merchant.logo,
          website: subs.merchant.website,
          custom: true,
        };
      } else if (typeof subs.merchant !== "string") {
        data.merchant = subs.merchant._id!;
      }

      // Remove modal-only fields
      delete data.isEdit;
      delete data.active;
      delete data._id; // Don't send _id in body for create/update if it's the subscription ID

      if (subs.isEdit && subs._id) {
        // Update existing subscription
        const response = await updateSubscription(subs._id, data);
        setSubscriptions(prev =>
          prev.map(s => s._id === subs._id ? { ...response, frequency: response.frequency.text || response.frequency } : s)
        );
        toast.success("Subscription updated!", { id: toastId });
      } else {
        // Create new subscription
        const response = await createSubscription(data);
        setSubscriptions(prev => [...prev, { ...response, frequency: response.frequency.text || response.frequency }]);
        setSearchTerm("");
        toast.success("Subscription saved!", { id: toastId });
      }

    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save subscription",
        { id: toastId }
      );
    }
  };


  const removeSubscription = async (m: MerchantType | Subscription) => {
    // Check if it's a saved subscription (has _id and is in subscriptions list)
    // The current UI passes 'm' which is the merchant object from the subscription
    // We need to find the subscription ID associated with this merchant if we are deleting by merchant
    // However, the UI calls removeSubscription(m) where m is s.merchant.
    // But wait, the list renders subscriptions.
    // Let's check how removeSubscription is called: onClick={() => removeSubscription(m as MerchantType)}
    // We should probably change the call to pass the subscription object or ID.

    // Let's assume we can find the subscription by merchant ID for now, or better, update the call site.
    // But since I can only edit this block, I will try to find the subscription in the state.

    const sub = subscriptions.find(s => s.merchant._id === m._id);

    if (!sub || !sub._id) {
      // If no _id, it might be a local optimistic update or something, but here we assume all in list are saved.
      // If it's just removing from local list before save? No, the list is 'Existing Subscriptions'.
      // So they should have _id.
      setSubscriptions(prev => prev.filter(s => s.merchant._id !== m._id));
      return;
    }

    const toastId = "delete-subs";
    toast.loading("Deleting subscription...", { id: toastId });

    try {
      await deleteSubscription(sub._id);
      setSubscriptions(prev => prev.filter(s => s._id !== sub._id));
      toast.success("Subscription deleted", { id: toastId });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete subscription",
        { id: toastId }
      );
    }
  };

  const subscribedMerchantIds = new Set(subscriptions.map(s => s.merchant._id));

  const filteredMerchants =
    merchants?.filter(
      m => m._id && !subscribedMerchantIds.has(m._id) && m.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );


  const handleRoute = () => {
    router.push('/success')
  }
  return (
    <main className="w-full min-h-screen bg-white relative overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center gap-4 py-5 sticky top-0 z-10">
        {/* <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
          <ChevronLeft className="text-white" />
        </button> */}
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

        <div className="w-full max-h-[600px] lg:max-h-[500px] overflow-y-scroll flex flex-col gap-4 pb-12">
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
              <div key={s._id} className="w-full bg-primary/20 flex items-center border border-primary p-4 rounded-xl">
                <button
                  onClick={() => removeSubscription(m as MerchantType)}
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
                      <p className="flex items-center gap-2 text-base text-black">{m.name}</p>
                      <small className="text-sm text-foreground">
                        {`$${s.price}/${s.frequency}`}
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
            searchResults.map((m, i) => <Merchant key={i} c={m} handleOpenModal={handleOpenModal} />)
          ) : null}

          {loading ? (
            <div className="w-full flex items-center justify-center py-4"><Spinner /></div>
          ) : filteredMerchants && filteredMerchants.length > 0 ? (
            filteredMerchants.map((m, i) => <Merchant key={i} c={m} handleOpenModal={handleOpenModal} />)
          ) : (
            <p className="text-center text-gray-500 py-4">No merchant found</p>
          )}
        </div>
      </div>

      {/* Checkout Section */}
      {subscriptions.length ? (
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
                  {subscriptions.length} {subscriptions.length > 1 ? "Subscriptions" : "Subscription"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 p-4">
              <Button onClick={handleRoute} variant="light" size="sm" className="flex items-center gap-2" disabled={subscriptions.length === 0}>
                Continue <MoveRight size={18} />
              </Button>
            </div>
          </div>
        </section>
      ) : ''}

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
