import { Heart, Minus, Plus, RefreshCcw, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { SectionLabel } from "@/components/common/SectionLabel";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import { ProductService } from "../api/product-service";
import { ProductCard } from "../components/ProductCard";
import { RatingStars } from "../components/RatingStars";
import type { Product } from "../types";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CATEGORY_TRANSLATION_MAP } from "..";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useDocumentTitle(product?.title || t("products.breadcrumb.products"));

  const CLOTHING_CATEGORIES = [
    "mens-shirts", "womens-dresses", "womens-tops",
    "womens-shoes", "mens-shoes", "tops", "clothing",
    "shirts", "shoes", "fashion", "bags-purses",
  ];
  const showVariants = product
    ? CLOTHING_CATEGORIES.includes(product.category)
    : false;

  const COLORS = [
    { name: t("products.details.colors.blue"), value: "bg-[#AEC6CF]" },
    { name: t("products.details.colors.red"), value: "bg-[#E06666]" },
  ];

  const SIZES = [
    { label: t("products.details.sizes.xs"), value: "XS" },
    { label: t("products.details.sizes.s"), value: "S" },
    { label: t("products.details.sizes.m"), value: "M" },
    { label: t("products.details.sizes.l"), value: "L" },
    { label: t("products.details.sizes.xl"), value: "XL" },
  ];

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].name);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();

  useEffect(() => {
    if (!id) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setQuantity(1);

      try {
        const data = await ProductService.getProductById(Number(id));
        setProduct(data);
        setSelectedImage(data.thumbnail);

        if (data.category) {
          try {
            const relatedData = await ProductService.getProductsByCategory(
              data.category,
              { limit: 10 },
            );
                      const filtered = (relatedData.products ?? []).filter((p) => p.id !== data.id);
            filtered.sort((a, b) => {
              const aSameBrand = a.brand && data.brand && a.brand.toLowerCase() === data.brand.toLowerCase();
              const bSameBrand = b.brand && data.brand && b.brand.toLowerCase() === data.brand.toLowerCase();
                          if (aSameBrand && !bSameBrand) return -1;
              if (!aSameBrand && bSameBrand) return 1;
              const aSharedTags = (a.tags || []).filter(tag => (data.tags || []).includes(tag)).length;
              const bSharedTags = (b.tags || []).filter(tag => (data.tags || []).includes(tag)).length;
                          return bSharedTags - aSharedTags;
            });

            setRelatedProducts(filtered.slice(0, 4));
          } catch (err) {
            console.error("Failed to fetch related products:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(t("products.errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center min-h-125 items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-125 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">
          {error || t("products.errors.notFound")}
        </h2>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary text-white hover:-translate-y-1 transition-all"
        >
          {t("common.returnToHome")}
        </Button>
      </div>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);
  const isWishlisted = isWished(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleWishlist = () => {
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

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product.id, quantity);
    toast.success(t("products.addedToCart"), {
      description: t("products.checkCart"),
      action: {
        label: t("products.viewCart"),
        onClick: () => navigate("/cart"),
      },
    });
  };

  const translationKey = CATEGORY_TRANSLATION_MAP[product.category];
  const categoryName = translationKey ? t(translationKey) : product.category.replace("-", " ");

  const breadcrumbItems = [
    { label: t("common.home"), to: "/" },
    { label: t("products.breadcrumb.products"), to: "/products" },
    { label: categoryName, to: `/category/${product.category}` },
    { label: product.title, active: true },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-33.75 py-6 md:py-20 flex flex-col gap-12 md:gap-35 text-black">
      <Breadcrumb items={breadcrumbItems} className="mb-2 md:-mb-10" />

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-7 w-full lg:w-[60%] shrink-0">
          <div className="flex md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
            {[
              product.thumbnail,
              ...(product.images || []).filter(
                (img) => img !== product.thumbnail,
              ),
            ]
              .slice(0, 4)
              .map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "w-20 h-20 xs:w-24 xs:h-24 md:w-42.5 md:h-34.5 shrink-0 bg-secondary rounded-sm flex items-center justify-center p-2 md:p-4 border-2 transition-all cursor-pointer",
                    selectedImage === img
                      ? "border-black"
                      : "border-transparent hover:border-black/20",
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </button>
              ))}
          </div>

          <div className="w-full h-64 xs:h-80 md:h-150 md:w-125 lg:w-150 bg-secondary rounded-sm flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product.title}
              className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-[40%]">
          <h1 className="text-xl md:text-[24px] font-semibold tracking-wide font-inter mb-2 md:mb-4">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
            <RatingStars rating={product.rating} />
            <span className="text-[14px] text-black/50">
              {t("products.details.reviews", { count: product.reviews?.length || 150 })}
            </span>
            <span className="hidden xs:inline text-black/50">|</span>
            <span
              className={cn(
                "text-[14px]",
                isOutOfStock ? "text-primary" : "text-success",
              )}
            >
              {isOutOfStock ? t("products.details.outOfStock") : t("products.details.inStock")}
            </span>
          </div>

          <p className="text-2xl md:text-[24px] font-inter mb-4 md:mb-6">
            {t("common.currency")}
            {product.discountPercentage > 0
              ? discountedPrice.toFixed(2)
              : product.price.toFixed(2)}
          </p>

          <p className="text-[14px] text-black/80 leading-relaxed mb-6 border-b pb-6 border-black/10">
            {product.description}
          </p>

          {showVariants && (
            <div className="flex items-center gap-6 mb-6">
              <span className="text-lg md:text-[20px] font-inter">{t("products.details.colours")}</span>
              <div className="flex items-center gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Select ${color.name} color`}
                    className={cn(
                      "w-5 h-5 rounded-full outline-offset-2 transition-all cursor-pointer",
                      color.value,
                      selectedColor === color.name
                        ? "outline outline-black"
                        : "",
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {showVariants && (
            <div className="flex items-center gap-6 mb-8 md:mb-10">
              <span className="text-lg md:text-[20px] font-inter">{t("products.details.size")}</span>
              <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                {SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={cn(
                      "w-8 h-8 rounded flex items-center justify-center text-[13px] md:text-[14px] font-medium transition-all cursor-pointer",
                      selectedSize === size.value
                        ? "bg-primary text-white border-transparent"
                        : "bg-white text-black border border-black/50 hover:border-black",
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-10">
            <div className="flex items-center h-11 border border-black/50 rounded overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer border-r border-black/50"
              >
                <Minus size={18} strokeWidth={1.5} />
              </button>
              <div className="w-12 md:w-16 h-full flex items-center justify-center text-lg md:text-[20px] font-medium">
                {quantity}
              </div>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-full flex items-center justify-center bg-primary text-white hover:bg-primary transition-colors cursor-pointer"
              >
                <Plus size={18} strokeWidth={1.5} />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 min-w-35 h-11 bg-primary hover:bg-primary text-white text-sm md:text-[16px] font-medium rounded cursor-pointer hover:-translate-y-1 transition-all"
            >
              {t("products.details.buyNow")}
            </Button>


            <button
              onClick={handleWishlist}
              className="w-11 h-11 border border-black/50 rounded flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer group"
            >
              <Heart
                size={20}
                fill={isWishlisted ? "currentColor" : "none"}
                className={cn(
                  isWishlisted ? "text-primary group-hover:text-white" : "",
                )}
              />
            </button>
          </div>

          <div className="border border-black/50 rounded divide-y divide-black/50">
            <div className="flex items-center gap-4 p-4 md:p-6">
              <Truck strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
              <div>
                <h4 className="text-[14px] md:text-[16px] font-medium mb-1">{t("products.details.delivery.title")}</h4>
                <p className="text-[11px] md:text-[12px] font-medium underline cursor-pointer hover:text-black/70">
                  {t("products.details.delivery.hint")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 md:p-6">
              <RefreshCcw strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
              <div>
                <h4 className="text-[14px] md:text-[16px] font-medium mb-1">
                  {t("products.details.return.title")}
                </h4>
                <p className="text-[11px] md:text-[12px] font-medium">
                  {t("products.details.return.desc")}{" "}
                  <span className="underline cursor-pointer hover:text-black/70 whitespace-nowrap">
                    {t("products.details.return.details")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex items-center">
          <SectionLabel text={t("products.specifications.title")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 border border-black/10 rounded-lg p-6 md:p-8 bg-secondary/10">
          <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
            <span className="text-black/50">{t("products.specifications.sku")}</span>
            <span className="font-medium">{product.sku || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
            <span className="text-black/50">{t("products.specifications.weight")}</span>
            <span className="font-medium">{product.weight}g</span>
          </div>
          {product.dimensions && (
            <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
              <span className="text-black/50">{t("products.specifications.dimensions")}</span>
              <span className="font-medium text-end">
                {product.dimensions.width}W x {product.dimensions.height}H x {product.dimensions.depth}D cm
              </span>
            </div>
          )}
          <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
            <span className="text-black/50">{t("products.specifications.warranty")}</span>
            <span className="font-medium text-end">{product.warrantyInformation}</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
            <span className="text-black/50">{t("products.specifications.shipping")}</span>
            <span className="font-medium text-end">{product.shippingInformation}</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
            <span className="text-black/50">{t("products.specifications.returnPolicy")}</span>
            <span className="font-medium text-end">{product.returnPolicy}</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-2 text-sm md:text-base">
            <span className="text-black/50">{t("products.specifications.minOrder")}</span>
            <span className="font-medium">{product.minimumOrderQuantity}</span>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-6 md:gap-10 mb-10 md:mb-20">
          <div className="flex items-center justify-between">
            <SectionLabel text={t("products.details.relatedItems")} />
          </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7.5">
            {relatedProducts.map((p, idx) => (
              <div 
                key={p.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
