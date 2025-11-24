"use client"
import axios from "axios";

// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https:172.18.0.33:2000';
export const BASE_URL = 'https://subs-tracker-production.up.railway.app';

export const CHAIN = process.env.NEXT_PUBLIC_CHAIN || 'devnet';
export const USDC_ADDRESS = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
export const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'

export const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from Zustand / Redux
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const categories = [
  { id: 1, label: "All" },
  { id: 2, label: "Featured" },
  { id: 3, label: "AI" },
  { id: 4, label: "Dev" },
  { id: 5, label: "Design" },
  { id: 6, label: "Productivity" },
  { id: 7, label: "Entertainment" },
  { id: 8, label: "Utility" },
];

export const perks = [
  { id: 1, label: "Free Trial" },
  { id: 2, label: "100% Refund Policy" },
  { id: 3, label: "Proration Rules" },
  { id: 4, label: "Family Sharing" },
  { id: 5, label: "Student Discount" },
]