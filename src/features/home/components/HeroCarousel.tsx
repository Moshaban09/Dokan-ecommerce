import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Footprints,
  Headphones,
  Laptop,
  Smartphone,
  Watch,
} from "lucide-react";
import type { Slide } from "../types";
import type { Product } from "@/features/products/types";
import { ProductService } from "@/features/products";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";

const BRAND_ICONS = {
  phones: Smartphone,
  laptops: Laptop,
  watches: Watch,
  shoes: Footprints,
  audio: Headphones,
} as const;

const SLIDE_PRODUCTS: { key: Slide["brandType"]; productId: number }[] = [
  { key: "phones", productId: 123 },
  { key: "laptops", productId: 78 },
  { key: "watches", productId: 98 },
  { key: "shoes", productId: 88 },
  { key: "audio", productId: 101 },
];

const productCache = new Map<number, Product>();

interface HeroCarouselProps {
  slides?: Slide[];
}

export const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState<Record<number, Product>>(() =>
    Object.fromEntries(productCache),
  );

  const defaultSlides: Slide[] = SLIDE_PRODUCTS.map(({ key, productId }, i) => ({
    id: i + 1,
    productId,
    brandType: key,
    brand: t(`home.heroSlides.${key}.brand`),
    title: t(`home.heroSlides.${key}.title`),
    cta: t(`home.heroSlides.${key}.cta`),
  }));

  const activeSlides = slides || defaultSlides;

  useEffect(() => {
    let ignore = false;
    const missing = activeSlides
      .map((s) => s.productId)
      .filter((id) => !productCache.has(id));
    if (missing.length === 0) return;

    Promise.allSettled(
      missing.map((id) => ProductService.getProductById(id)),
    ).then((results) => {
      results.forEach((r) => {
        if (r.status === "fulfilled") productCache.set(r.value.id, r.value);
      });
      if (!ignore) setProducts(Object.fromEntries(productCache));
    });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="flex-1 lg:pt-10">
      <div className="relative bg-sand w-full overflow-hidden group h-115 md:h-105 lg:h-110 mx-auto lg:max-w-268 rounded-2xl border border-border">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${isRtl ? current * 100 : -(current * 100)}%)`,
          }}
        >
          {activeSlides.map((slide) => {
            const Icon = BRAND_ICONS[slide.brandType];
            const product = products[slide.productId];

            return (
              <div
                key={slide.id}
                className={cn(
                  "min-w-full h-full bg-linear-to-br from-sand to-[#F8F3E9] flex flex-col items-center justify-center lg:justify-between px-6 lg:px-16 gap-3 lg:gap-0 pt-6 pb-20 lg:py-0",
                  isRtl ? "lg:flex-row-reverse" : "lg:flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex flex-col gap-3 lg:gap-5 text-black max-w-lg z-10 text-center items-center shrink-0",
                    isRtl
                      ? "lg:text-right lg:items-end"
                      : "lg:text-left lg:items-start",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-full bg-primary text-white flex items-center justify-center">
                      <Icon size={18} />
                    </span>
                    <span className="font-poppins font-medium text-sm lg:text-base leading-6 text-primary">
                      {slide.brand}
                    </span>
                  </div>
                  <h2 className="font-inter font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight lg:leading-[1.15] whitespace-pre-line">
                    {slide.title}
                  </h2>
                  <Link
                    to="/products"
                    className="group/btn mt-1 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white font-poppins font-medium text-sm lg:text-base px-6 py-3 transition-colors"
                  >
                    {slide.cta}
                    <ArrowRight
                      size={18}
                      className={cn(
                        "transition-transform duration-300 group-hover/btn:translate-x-1",
                        isRtl && "rotate-180 group-hover/btn:-translate-x-1",
                      )}
                    />
                  </Link>
                </div>

                <div className="relative flex-1 w-full lg:w-1/2 h-full flex items-center justify-center">
                  <div className="absolute size-44 md:size-64 lg:size-80 rounded-full bg-white shadow-[0_20px_60px_rgba(15,90,70,0.12)]" />
                  {product ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="relative size-30 md:size-44 lg:size-56 object-contain drop-shadow-[0_12px_14px_rgba(30,42,37,0.22)] transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Skeleton className="relative size-30 md:size-44 lg:size-56 rounded-full bg-sand" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-5 inset-x-0 flex justify-center z-20">
          <div className="flex gap-2.5 px-3 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-border">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  i === current
                    ? "w-6 bg-primary"
                    : "w-2.5 bg-black/20 hover:bg-black/40",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
