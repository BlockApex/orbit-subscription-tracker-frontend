import { Bundle, Subscription } from "../types/bundle.types";

export const isColorDark = (hex: string): boolean => {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5;
};

export const hexToRGBA = (hex: string, alpha = 0.35): string => {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export const lightenColor = (hex: string, percent = 20): string => {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  return `rgb(${r}, ${g}, ${b})`;
};



export const shortenTx = (tx: string, start = 4, end = 6) => {
  if (!tx) return '';
  return `${tx.slice(0, start)}....${tx.slice(-end)}`;
};



export function isSubscription(item: Subscription|Bundle): item is Subscription & { isSubscription: true } {
  return (item as Subscription).bundle !== undefined && (item as {isSubscription:boolean}).isSubscription === true;
}

export const truncateText = (text: string, maxLength: number = 20): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};



export function capitalizeFirstLetter(str:string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}