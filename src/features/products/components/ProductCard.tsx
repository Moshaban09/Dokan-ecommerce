import { RatingStars } from "./RatingStars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { Eye, Heart, Trash2, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useCart } from "@/features/cart";
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
  const navigate = useNavigate();
  const { addItem } = useCart();
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
    toast.success(t("products.addedToCart"), {
      description: t("products.checkCart"),
      action: {
        label: t("products.viewCart"),
        onClick: () => navigate("/cart"),
      },
    });
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col w-full max-w-67.5",
        className,
      )}
    >
      {}
      <div className="relative overflow-hidden rounded-lg bg-secondary aspect-square flex items-center justify-center p-4 md:p-8 mb-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />

        {}
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-3 inset-s-3 bg-primary hover:bg-primary text-white text-[12px] font-normal px-3 py-1 rounded-lg border-none">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}

        {}
        <div className="absolute top-3 inset-e-3 flex flex-col gap-2 z-10">
          {variant === "wishlist" ? (
            <button
              onClick={handleWishlist}
              className="w-8.5 h-8.5 rounded-full flex items-center justify-center cursor-pointer bg-white text-black transition-all hover:bg-primary hover:text-white shadow-sm"
              aria-label={t("products.removedFromWishlist")}
            >
              <Trash2 size={20} strokeWidth={1.5} />
            </button>
          ) : variant === "just-for-you" ? (
            <Link
              to={`/product/${product.id}`}
              className="w-8.5 h-8.5 rounded-full flex items-center justify-center cursor-pointer bg-white text-black transition-all hover:bg-primary hover:text-white shadow-sm"
              aria-label={t("products.quickView")}
            >
              <Eye size={20} strokeWidth={1.5} />
            </Link>
          ) : (
            <>
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-8.5 h-8.5 rounded-full flex items-center justify-center cursor-pointer bg-white transition-all hover:bg-primary hover:text-white shadow-sm",
                  isWishlisted ? "text-primary" : "text-black",
                )}
                aria-label={t("products.addedToWishlist")}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              </button>
              <Link
                to={`/product/${product.id}`}
                className="w-8.5 h-8.5 rounded-full flex items-center justify-center cursor-pointer bg-white text-black transition-all hover:bg-primary hover:text-white shadow-sm"
                aria-label={t("products.quickView")}
              >
                <Eye size={20} strokeWidth={1.5} />
              </Link>
            </>
          )}
        </div>

        {}
        <div className={cn(
          "absolute bottom-0 inset-x-0 transition-transform duration-300",
          forceShowAddToCart ? "translate-y-0" : "translate-y-0 md:translate-y-full md:group-hover:translate-y-0"
        )}>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-black text-white rounded-none rounded-b-lg h-12 text-[16px] font-medium font-poppins cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
            size="default"
          >
            <ShoppingCart size={20} strokeWidth={1.5} /> {t("products.addToCart")}
          </Button>
        </div>
      </div>

      {}
      <Link to={`/product/${product.id}`} className="flex flex-col gap-2">
        <h3 className="text-[16px] font-medium font-poppins leading-6 text-black line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-3">
          <span className="text-[16px] font-medium font-poppins text-primary">
            {t("common.currency")}{discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-[16px] font-medium font-poppins text-black/50 line-through">
              {t("common.currency")}{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {variant !== "wishlist" && (
          <div className="flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-[14px] font-semibold text-black/50 font-poppins">
              ({product.reviews?.length || 88})
            </span>
          </div>
        )}
      </Link>
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="aspect-square w-full rounded-lg" />
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);
