export interface Slide {
  id: number;
  productId: number;
  brand: string;
  brandType: "phones" | "laptops" | "watches" | "shoes" | "audio";
  title: string;
  cta: string;
}
