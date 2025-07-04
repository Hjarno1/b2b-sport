// src/types/Product.ts
export interface Product {
  id: number;
  parrentSku: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  width?: number;
  height?: number;
  length?: number;
  material?: string;
  seoUrl?: string;
  // UI‐only fields:
  images: string[]; // e.g. URLs you’ll attach from another table or service
  sizes: string[]; // if you have a sizes list column or related table
  customizable: boolean; // derived from some flag or logic
  price: number;
}
