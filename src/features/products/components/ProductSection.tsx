import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { SectionLabel } from "@/components/common/SectionLabel";
import { buttonVariants } from "@/components/ui/variants";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { useLanguage } from "@/hooks/use-language";
import type { Product } from "../types";

interface ProductSectionProps {
  title: string;
  label: string;
  products: Product[];
  isLoading: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  children?: ReactNode; 
  variant?: "scroll" | "grid";
  className?: string;
}

export const ProductSection = ({
  title,
  label,
  products,
  isLoading,
  viewAllLink,
  viewAllText = "View All",
  children,
  variant = "scroll",
  className,
}: ProductSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isRtl } = useLanguage();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    const scrollLeft = Math.abs(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);
  };

  useEffect(() => {
    if (isLoading) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(updateScrollState);
    });
    return () => cancelAnimationFrame(id);
  }, [products, isLoading]);

  const scroll = (dir: "prev" | "next") => {
    if (!scrollRef.current) return;
    
    const firstChild = scrollRef.current.firstElementChild as HTMLElement;
    const cardWidth = firstChild?.offsetWidth || 270;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    
    let moveAmount = dir === "next" ? scrollAmount : -scrollAmount;
    
    if (isRtl) {
      moveAmount = -moveAmount;
    }

    scrollRef.current.scrollBy({
      left: moveAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("py-15 pb-4 container mx-auto px-4", className)}>
      <SectionLabel text={label} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 md:gap-20">
          <h2 className="text-[20px] xs:text-[24px] md:text-[36px] font-bold tracking-[0.04em] font-inter leading-tight text-black">
            {title}
          </h2>
          {children && <div className="mt-2 sm:mt-0">{children}</div>}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          {viewAllLink && variant === "grid" && (
            <Link
              to={viewAllLink}
              className={cn(
                buttonVariants({ variant: "default" }),
                "px-8 md:px-12 py-3 md:py-4 h-auto rounded-lg text-sm md:text-[16px] font-medium font-poppins transition-all duration-300 hover:bg-primary hover:-translate-y-1"
              )}
            >
              {viewAllText}
            </Link>
          )}


          {variant === "scroll" && (
            <div className="flex gap-2 ml-auto sm:ml-0">
              <IconButton
                onClick={() => scroll("prev")}
                disabled={!canScrollLeft}
                aria-label={isRtl ? "السابق" : "Previous"}
                variant="default"
                size="sm"
                className="md:w-11.5 md:h-11.5"
              >
                {isRtl ? <ArrowRight size={20} className="md:size-6" /> : <ArrowLeft size={20} className="md:size-6" />}
              </IconButton>
              <IconButton
                onClick={() => scroll("next")}
                disabled={!canScrollRight}
                aria-label={isRtl ? "التالي" : "Next"}
                variant="default"
                size="sm"
                className="md:w-11.5 md:h-11.5"
              >
                {isRtl ? <ArrowLeft size={20} className="md:size-6" /> : <ArrowRight size={20} className="md:size-6" />}
              </IconButton>
            </div>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={cn(
          "scrollbar-hide snap-x snap-mandatory scroll-smooth",
          variant === "scroll"
            ? "flex gap-4 md:gap-7.5 overflow-x-auto pb-6"
            : "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7.5 pb-6"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-67.5 snap-start">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "min-w-60 md:min-w-67.5 snap-start",
                  variant === "grid" && "min-w-0"
                )}
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>

      {viewAllLink && variant === "scroll" && (
        <div className="flex justify-center mt-14">
          <Link
            to={viewAllLink}
            className={cn(
              buttonVariants({ variant: "default" }),
              "px-12 py-4 h-auto rounded-lg text-[16px] font-medium font-poppins transition-all duration-300 hover:bg-primary hover:-translate-y-1"
            )}
          >
            {viewAllText}
          </Link>
        </div>
      )}
    </section>
  );
};
