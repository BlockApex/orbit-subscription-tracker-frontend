import { create } from "zustand";

// Payment Rail
export interface PaymentRail {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// User Payment Method
export interface PaymentMethod {
  _id: string;
  owner: string;
  paymentRail: PaymentRail;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  _id: string;
  name: string;
  icon: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MiscStore {
  paymentRails: PaymentRail[];           // Available rails
  paymentMethods: PaymentMethod[];       // User-added payment methods
  categories: Category[];                // Categories
  setRails: (rails: PaymentRail[]) => void;
  setMethods: (methods: PaymentMethod[]) => void;
  addMethod: (method: PaymentMethod) => void;
  updateMethod: (method: PaymentMethod) => void;
  removeMethod: (id: string) => void;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
}

export const useMiscStore = create<MiscStore>((set) => ({
  paymentRails: [],
  paymentMethods: [],
  categories: [],
  
  setRails: (rails) => set({ paymentRails: rails }),
  
  setMethods: (methods) => set({ paymentMethods: methods }),
  addMethod: (method) =>
    set((state) => ({ paymentMethods: [...state.paymentMethods, method] })),
  
  updateMethod: (method) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.map((m) =>
        m._id === method._id ? { ...m, ...method } : m
      ),
    })),
  
  removeMethod: (id) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.filter((m) => m._id !== id),
    })),

  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c._id !== id),
    })),
}));
