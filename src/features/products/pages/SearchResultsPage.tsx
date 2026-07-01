import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ProductService } from "../api/product-service";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types";
import { Search, Loader2 } from "lucide-react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export default function SearchResultsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  useDocumentTitle(t("products.search.title", { query }));
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await ProductService.searchProducts(query);
        setProducts(response.products ?? []);
      } catch (error) {
        console.error("Failed to search products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 lg:px-33.75 py-10 md:py-20 font-poppins text-black min-h-[60vh]">
      <div className="flex flex-col gap-8 md:gap-10">
        <Breadcrumb 
          items={[
            { label: t("common.home"), to: "/" },
            { label: t("products.breadcrumb.products"), to: "/products" },
            { label: query || t("products.search.resultsTitle"), active: true }
          ]}
        />

        <div className="flex flex-col gap-4 text-start">
          <h1 className="text-2xl md:text-3xl font-semibold font-inter">
            {t("products.search.resultsTitle")}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-black/50 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Search size={18} />
              <span>
                {t("products.search.showingResults", { query: query || "..." })}
              </span>
            </div>
            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-black whitespace-nowrap">
              {t("products.search.itemsFound", { count: products.length })}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-black/50">
            <Loader2 className="animate-spin" size={40} />
            <p>{t("products.search.loading")}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7.5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 text-center py-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-full flex items-center justify-center text-black/20">
              <Search size={32} className="md:w-10 md:h-10" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl md:text-2xl font-semibold">{t("products.search.noResults")}</h2>
              <p className="text-sm md:text-base text-black/50 max-w-md">
                {t("products.search.noResultsDesc")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
