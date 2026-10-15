import { RatingStars } from "./RatingStars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { Check, Eye, Heart, Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { openMiniCart, useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'wishlist' | 'just-for-you';
  forceShowAddToCart?: boolean;
}

export const ProductCard = ({ product, className, variant = "default", forceShowAddToCart = false }: ProductCardProps) => {
  const { t } = useTranslation();
  const { addItem, items } = useCart();
  const { toggle, isWished } = useWishlist();

  const isWishlisted = isWished(product.id);
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    if (!isWishlisted) {
      toast.success(t("products.addedToWishlist"), {
        description: product.title
      });
    } else {
      toast.info(t("products.removedFromWishlist"), {
        description: product.title
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id);
    openMiniCart();
  };

  const inCart = items.some((i) => i.id === product.id);
  const iconButton =
    "w-8.5 h-8.5 rounded-full flex items-center justify-center cursor-pointer bg-white text-black shadow-sm transition-all hover:bg-primary hover:text-white";

  return (
    <div
      className={cn(
        "group relative flex flex-col w-full max-w-67.5 rounded-2xl border border-border bg-white p-2 transition-all duration-300 hover:border-primary hover:shadow-md",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-xl bg-secondary aspect-square flex items-center justify-center p-4 md:p-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {product.discountPercentage > 0 && (
          <Badge className="absolute top-2.5 inset-s-2.5 bg-sale hover:bg-sale text-white text-[12px] font-medium px-2.5 py-0.5 rounded-full border-none">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}

        <div className="absolute top-2.5 inset-e-2.5 flex flex-col gap-2 z-10">
          {variant === "wishlist" ? (
            <button
              onClick={handleWishlist}
              className={iconButton}
              aria-label={t("products.removedFromWishlist")}
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>
          ) : variant === "just-for-you" ? (
            <Link
              to={`/product/${product.id}`}
              className={iconButton}
              aria-label={t("products.quickView")}
            >
              <Eye size={18} strokeWidth={1.5} />
            </Link>
          ) : (
            <>
              <button
                onClick={handleWishlist}
                className={cn(
                  iconButton,
                  isWishlisted && "bg-sale/10 text-sale hover:bg-sale hover:text-white",
                )}
                aria-label={t("products.addedToWishlist")}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              </button>
              <Link
                to={`/product/${product.id}`}
                className={cn(iconButton, "md:opacity-0 md:group-hover:opacity-100")}
                aria-label={t("products.quickView")}
              >
                <Eye size={18} strokeWidth={1.5} />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-1.5 pt-3 pb-1.5 flex-1">
        <span className="text-[12px] font-poppins text-black/50 capitalize line-clamp-1">
          {product.category?.replace(/-/g, " ")}
        </span>
        <Link to={`/product/${product.id}`} className="flex flex-col gap-1.5">
          <h3 className="text-[15px] font-medium font-poppins leading-6 text-black line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {variant !== "wishlist" && (
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-[13px] font-medium text-black/50 font-poppins">
                ({product.reviews?.length || 88})
              </span>
            </div>
          )}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[16px] font-medium font-poppins text-primary">
              {t("common.currency")}{discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[13px] font-poppins text-black/50 line-through">
                {t("common.currency")}{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {!forceShowAddToCart &&
            (inCart ? (
              <span className="h-9 px-2.5 rounded-lg bg-primary/10 text-primary text-[12px] font-medium flex items-center gap-1 shrink-0">
                <Check size={14} />
                {t("products.inCart")}
              </span>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="size-9 p-0 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer shrink-0 transition-all active:scale-95"
                aria-label={t("products.addToCart")}
              >
                <ShoppingCart size={18} strokeWidth={1.75} />
              </Button>
            ))}
        </div>

        {forceShowAddToCart && (
          <Button
            onClick={handleAddToCart}
            className="w-full mt-1 bg-primary hover:bg-primary-dark text-white rounded-lg h-10 text-[14px] font-medium font-poppins cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ShoppingCart size={18} strokeWidth={1.5} /> {t("products.addToCart")}
          </Button>
        )}
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-2 w-full max-w-67.5">
    <Skeleton className="aspect-square w-full rounded-xl" />
    <div className="flex flex-col gap-2 px-1.5 pb-1.5">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
    </div>
  </div>
);
