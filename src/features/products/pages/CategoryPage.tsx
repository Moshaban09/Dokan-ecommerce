import { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useParams, useNavigate } from "react-router";
import { ProductService } from "../api/product-service";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { SectionLabel } from "@/components/common/SectionLabel";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Loader2 } from "lucide-react";
import { CATEGORY_TRANSLATION_MAP } from "../constants";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { categoryName } = useParams<{ categoryName: string }>();
  
  const getTranslatedCategory = (slug?: string) => {
    if (!slug) return t("products.category.title");
    const key = CATEGORY_TRANSLATION_MAP[slug];
    return key ? t(key) : slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const displayTitle = getTranslatedCategory(categoryName);
  
  useDocumentTitle(displayTitle);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryName) return;
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ProductService.getProductsByCategory(categoryName, { limit: 100 });
        setProducts(response.products ?? []);
      } catch {
        setError(t("products.category.loadError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName, t]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[500px] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary text-white hover:-translate-y-1 transition-all">
          {t("products.errors.404.backToHome")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-10 lg:px-33.75 py-8 md:py-16 flex flex-col gap-8 md:gap-10 text-black min-h-[500px]">
      <div className="flex flex-col gap-4">
        <Breadcrumb 
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("products.breadcrumb.products"), href: "/products" },
            { label: displayTitle, active: true }
          ]}
        />
        <SectionLabel text={displayTitle} />
      </div>

      {isLoading ? (
        <div className="min-h-125 flex flex-col items-center justify-center gap-4 text-black/50">
          <Loader2 className="animate-spin" size={40} />
          <p>{t("products.search.loading")}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="min-h-[20vh] flex items-center justify-center text-black/50">
          {t("products.category.noProducts")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-7.5">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

