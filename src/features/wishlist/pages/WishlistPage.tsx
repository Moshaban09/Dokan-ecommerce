import { SectionLabel } from "@/components/common/SectionLabel";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import { ProductService } from "@/features/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useWishlist } from "../hooks/use-wishlist";

const GRID = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7.5";

const ProductGridSkeleton = () => (
  <div className={GRID}>
    {Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className="aspect-square bg-gray-200 animate-pulse rounded-lg"
      />
    ))}
  </div>
);

async function getRecommendations(
  wishlistProducts: Product[],
): Promise<Product[]> {
  const wishlistIds = new Set(wishlistProducts.map((p) => p.id));

  if (wishlistProducts.length > 0) {
    const categories = [
      ...new Set(wishlistProducts.map((p) => p.category)),
    ].slice(0, 3);
    const responses = await Promise.all(
      categories.map((cat) =>
        ProductService.getProductsByCategory(cat, { limit: 8 }),
      ),
    );
    const seen = new Set(wishlistIds);
    const unique: Product[] = [];
    for (const p of responses.flatMap((r) => r.products ?? [])) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    return unique.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  const res = await ProductService.getProducts({ limit: 12 });
  return (res.products ?? []).filter((p) => !wishlistIds.has(p.id)).slice(0, 4);
}

export default function WishlistPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("wishlist.title"));
  const navigate = useNavigate();
  const { ids, toggle } = useWishlist();
  const { addItem } = useCart();

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [justForYouProducts, setJustForYouProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(ids.length > 0);
  const [isJustForYouLoading, setIsJustForYouLoading] = useState(true);

  const idsKey = [...ids].sort().join(",");

  useEffect(() => {
    const currentIds = idsKey ? idsKey.split(",").map(Number) : [];
    let ignore = false;

    const fetchWishlistProducts = async () => {
      if (currentIds.length === 0) {
        if (!ignore) {
          setWishlistProducts([]);
          setIsLoading(false);
        }
        return;
      }
      if (!ignore) setIsLoading(true);
      try {
        const results = await Promise.all(
          currentIds.map((id) => ProductService.getProductById(id)),
        );
        if (!ignore) setWishlistProducts(results);
      } catch (err) {
        console.error("Failed to fetch wishlist products:", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchWishlistProducts();
    return () => {
      ignore = true;
    };
  }, [idsKey]);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      if (!ignore) setIsJustForYouLoading(true);
      try {
        const products = await getRecommendations(wishlistProducts);
        if (!ignore) setJustForYouProducts(products);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        if (!ignore) setIsJustForYouLoading(false);
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [wishlistProducts]);

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((product) => {
      addItem(product.id);
      toggle(product.id);
    });
    toast.success(t("wishlist.moveSuccess"));
  };

  return (
    <div className="container mx-auto px-4 lg:px-33.75 py-10 md:py-20 font-poppins text-black">
      <div className="flex flex-col gap-6 md:gap-10 mb-16 md:mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-[18px] md:text-[20px] font-medium font-poppins">
            {t("wishlist.titleWithCount", { count: wishlistProducts.length })}
          </h2>
          <Button
            variant="outline"
            onClick={handleMoveAllToBag}
            disabled={wishlistProducts.length === 0}
            className="h-12 md:h-14 px-6 md:px-12 w-full sm:w-auto border border-black bg-white text-black font-medium hover:bg-black hover:text-white transition-colors rounded cursor-pointer text-sm md:text-base"
          >
            {t("wishlist.moveAllToBag")}
          </Button>
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : wishlistProducts.length === 0 ? (
          <div className="min-h-[20vh] flex items-center justify-center text-black/50">
            {t("wishlist.empty")}
          </div>
        ) : (
          <div className={GRID}>
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="wishlist"
                forceShowAddToCart={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <SectionLabel text={t("wishlist.justForYou")} />
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/products")}
            className="h-12 md:h-14 px-6 md:px-12 w-full sm:w-auto border border-black bg-white text-black font-medium hover:bg-black hover:text-white transition-colors rounded cursor-pointer text-sm md:text-base"
          >
            {t("wishlist.seeAll")}
          </Button>
        </div>

        {isJustForYouLoading ? (
          <ProductGridSkeleton />
        ) : (
          <div className={GRID}>
            {justForYouProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                forceShowAddToCart={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
