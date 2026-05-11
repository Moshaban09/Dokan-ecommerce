export interface Slide {
  id: number;
  brand: string;
  brandType?: "apple" | "sony" | "canon" | "laptop" | "fashion";
  title: string;
  cta: string;
  image: string;
}
