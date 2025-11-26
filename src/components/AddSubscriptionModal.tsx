"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "./common/Modal";
import Input from "./common/Input";
import Switch from "./common/Switch";
import { Button } from "./common/Button";
import BillingCycle, { BillingCycleValue } from "./common/BillingCycle";
import { Select } from "./common/Select";
import { ImageUpload } from "./ImageUpload";
import Image from "next/image";
import { uploadImage } from "@/services/auth.service";
import { BASE_URL } from "@/config";
import toast from "react-hot-toast";
import { MerchantType, Subscription } from "@/app/import-subscriptions/manual/page";
import PaymentMethods from "./PaymentMethods";
import { useMiscStore } from "@/store/miscStore";

interface AddSubscriptionModalProps {
  open: boolean;
  setOpen: (o: boolean) => void;
  item: MerchantType | Subscription | null;
  isEditing: boolean;
  handleAddSubscription: (subs: Subscription) => void;
}

interface ClientErrors {
  name?: string;
  url?: string;
  price?: string;
  nextPaymentDate?: string;
  category?: string;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  open,
  setOpen,
  item,
  isEditing,
  handleAddSubscription,
}) => {
  const { categories: storeCategories, paymentMethods } = useMiscStore();

  const categoryOptions = storeCategories
    .filter((c) => !c.isDeleted)
    .map((c) => ({
      _id: c._id,
      title: `${c.icon} ${c.name}`,
    }));

  const [name, setName] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycleValue>({
    name: "Monthly",
    value: "monthly",
  });
  const [image, setImage] = useState<string>("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [packageName, setPackageName] = useState("");
  const [category, setCategory] = useState("");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isOnFreeTrial, setIsOnFreeTrial] = useState(false);
  const [active, setActive] = useState(true);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [loading, setLoading] = useState(false);

  const merchantDisplay = isEditing
    ? (item as Subscription).merchant
    : (item as MerchantType) || null;

  const closeModal = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    // RESET FIELDS
    setName("");
    setUrl("");
    setPrice("");
    setPackageName("");
    setBillingCycle({ name: "Monthly", value: "monthly" });
    setNextPaymentDate("");
    setCategory("");
    setIsOnFreeTrial(false);
    setActive(false);
    setImage("");
    setClientErrors({});
    setLoading(false);
    if (item) {
      if (isEditing) {
        const sub = item as Subscription;
        const m = sub.merchant;

        setPrice(String(sub.price));
        // Map frequency back to billing cycle object if needed, or just use it
        setBillingCycle({
          name: sub.frequency === "monthly" ? "Monthly" : sub.frequency, // Simple mapping
          value: sub.frequency,
        });
        // Format date to YYYY-MM-DD for input type="date"
        const dateVal = sub.nextPaymentDate ? new Date(sub.nextPaymentDate).toISOString().split('T')[0] : "";
        setNextPaymentDate(dateVal);

        // Handle category if it's populated as an object
        const catId = typeof sub.category === 'object' && sub.category !== null
          ? (sub.category as { _id: string })._id
          : sub.category;
        setCategory(catId || "");

        setIsOnFreeTrial(sub.isOnFreeTrial || false);
        setPackageName(sub.packageName || "");
        setActive(sub.active || false);
        setImage(m.logo || "");
      } else {
        const m = item as MerchantType;
        setName(m.name);
        setUrl(m.website || "");
        setImage(m.logo || "");
      }
    }
  }, [open, item, isEditing]);

  const validate = () => {
    const errors: ClientErrors = {};

    if (!merchantDisplay && !name.trim()) errors.name = "Subscription name is required";
    if (!merchantDisplay && url && !/^https?:\/\/.+/.test(url))
      errors.url = "Enter a valid URL";

    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      errors.price = "Enter a valid monthly price";

    if (!nextPaymentDate) errors.nextPaymentDate = "Next renewal date is required";
    if (!category) errors.category = "Select a category";

    setClientErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const subscription: Subscription = {
      _id: isEditing ? (item as Subscription)._id : undefined,
      merchant: (() => {
        // If editing, keep merchant as-is
        if (isEditing) return (item as Subscription).merchant;

        // If item exists (merchant from search)
        if (item) {
          const merchantItem = item as MerchantType;

          // If merchant has no _id → mark as custom
          if (!merchantItem._id) {
            return {
              custom: true,
              _id: Date.now().toString(),
              name: merchantItem.name,
              website: merchantItem.website || "",
              logo: merchantItem.logo || "",
            };
          }

          // Normal merchant selected from list
          return merchantItem;
        }

        // If no item → custom subscription
        return {
          custom: true,
          _id: Date.now().toString(),
          name,
          website: url,
          logo: image || "",
        };
      })(),

      price,
      frequency: billingCycle.value,
      nextPaymentDate,
      category,
      isOnFreeTrial,
      paymentMethod,
      packageName,
      active,
      isEdit: isEditing,
    };
    handleAddSubscription(subscription);
    closeModal();
  };

  const handleImageChange = async (file: File | null, previewUrl: string | null) => {
    setImage(previewUrl || "");
    if (!file) return;

    setLoading(true);
    try {
      const response = await uploadImage(file);
      setImage(BASE_URL + response.url);
    } catch (err) {
      setImage("");
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="" isOpen={open} onClose={closeModal} h={90}>
      <div className="w-full h-auto relative px-2 py-8">
        {merchantDisplay ? (
          <div className="w-full flex items-center justify-between gap-4 border border-gray-300 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <Image
                src={merchantDisplay.logo || ""}
                width={40}
                height={40}
                alt={merchantDisplay.name}
                className="rounded-xl"
                unoptimized
              />
              <div>
                <p>{merchantDisplay.name}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center mb-6">
            <ImageUpload value={image} onChange={handleImageChange} />
          </div>
        )}

        <div className="w-full h-auto flex flex-col gap-6">
          {!merchantDisplay && (
            <>
              <Input
                value={name}
                onChange={setName}
                label="Subscription Name"
                placeholder="Enter Subscription Name"
                error={clientErrors.name}
              />

              <Input
                value={url}
                onChange={setUrl}
                label="Subscription URL (Optional)"
                placeholder="Enter Subscription URL"
                error={clientErrors.url}
              />
            </>
          )}

          <Input
            value={packageName}
            onChange={setPackageName}
            label="Package Name (Optional)"
            placeholder="e.g. Premium"
          />

          <Input
            value={price}
            onChange={(v) => setPrice(String(v))}
            label="Monthly Price"
            placeholder="0.00"
            error={clientErrors.price}
          />

          <BillingCycle value={billingCycle} onChange={setBillingCycle} />

          <Input
            type="date"
            value={nextPaymentDate}
            onChange={setNextPaymentDate}
            label="Next Renewal Date"
            error={clientErrors.nextPaymentDate}
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder="Select Category"
            error={clientErrors.category}
          />

          <PaymentMethods
            methods={paymentMethods}        // all saved payment methods
            selectedPaymentId={paymentMethod}  // current selection
            onSelect={setPaymentMethod}        // updates modal state
          />
          <div className="flex items-center justify-between">
            <span>Free Trial</span>
            <Switch checked={isOnFreeTrial} onChange={setIsOnFreeTrial} />
          </div>
          {/* 
          <div className="flex items-center justify-between">
            <span>Active</span>
            <Switch checked={active} onChange={setActive} />
          </div> */}
        </div>

        <div className="w-full mt-10">
          <Button variant="primary" size="full" onClick={handleAdd}>
            {isEditing ? "Save Changes" : "Add Subscription"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubscriptionModal;
