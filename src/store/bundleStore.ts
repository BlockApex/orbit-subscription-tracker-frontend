import { create } from 'zustand';

// ---------- TYPES ----------

interface BundlRestrictions {
  minimumBundleItems: number;
  mandatoryListOfServices: string[];
}

interface Offer {
  type: string;
  amount: number;
  period: string;
  bundlRestrictions: BundlRestrictions;
  allowedCustomerTypes: string[];
  termsAndConditions: string;
}

interface RequiredFormField {
  fieldName: string;
  fieldType: string;
}

interface Service {
  _id: string;
  name: string;
  logo: string;
  description: string;
  allowedCustomerTypes: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  category: string;
}

interface Package {
  name: string;
  description: string;
  amount: number;
  frequency: string;
  isActive: boolean;
  requiredFormFields: RequiredFormField[];
  offers: Offer[];
  _id: string;
}

interface BundleItem {
  service: Service;
  package: Package;
  applicableOffers: Offer[];
}

export interface Bundle {
  packages: BundleItem[];
  frequency: string;
  totalFirstDiscountedPrice: number;
  totalOriginalPrice: number;
  priceEveryInterval: number[];
}

// ---------- STORE INTERFACE ----------

interface BundleState {
  bundle: Bundle | null;
  setBundle: (bundle: Bundle) => void;
  clearBundle: () => void;
}

// ---------- STORE ----------

export const useBundleStore = create<BundleState>((set) => ({
  bundle: null,
  setBundle: (bundle) => set({ bundle }),
  clearBundle: () => set({ bundle: null }),
}));
