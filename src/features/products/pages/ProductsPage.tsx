import { useEffect, useState } from "react";
import { ProductService } from "../api/product-service";
import type { Product, CategoryItem } from "../types";
import { ProductCard } from "../components/ProductCard";
import { SectionLabel } from "@/components/common/SectionLabel";
import { cn } from "@/lib/utils";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Loader2 } from "lucide-react";
import { CATEGORY_TRANSLATION_MAP } from "../constants";

export default function ProductsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("products.allProducts"));
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  const getTranslatedCategory = (slug: string) => {
    const key = CATEGORY_TRANSLATION_MAP[slug];
    return key ? t(key) : slug.replace(/-/g, " ");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          ProductService.getProducts({ limit: 200 }),
          ProductService.getCategories()
        ]);
        setProducts(productsRes.products ?? []);
        setCategories(categoriesRes);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsProductsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleCategoryClick = async (slug: string | null) => {
    setSelectedCategory(slug);
    setIsProductsLoading(true);
    try {
      if (slug) {
        const response = await ProductService.getProductsByCategory(slug, { limit: 200 });
        setProducts(response.products ?? []);
      } else {
        const response = await ProductService.getProducts({ limit: 200 });
        setProducts(response.products ?? []);
      }
    } catch (error) {
      console.error("Failed to filter products by category:", error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-33.75 py-10 md:py-20 flex flex-col gap-10 text-black min-h-125">
      <Breadcrumb 
        items={[
          { label: t("common.home"), to: "/" },
          { label: t("products.breadcrumb.products"), active: !selectedCategory, to: selectedCategory ? "/products" : undefined },
          ...(selectedCategory ? [{ label: getTranslatedCategory(selectedCategory), active: true }] : [])
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-60 shrink-0 h-fit lg:sticky lg:top-32">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between lg:justify-start gap-3 border-b border-black/5 pb-4">
              <h2 className="font-inter font-semibold text-lg text-black uppercase tracking-widest">
                {t("home.categories")}
              </h2>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">
                {categories.length}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3">
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  "text-start text-sm md:text-base transition-all duration-200 py-1 flex items-center gap-2 group cursor-pointer",
                  selectedCategory === null 
                    ? "text-primary font-bold" 
                    : "text-black/60 hover:text-black"
                )}
              >
                {selectedCategory === null && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                <span className={cn(selectedCategory !== null && "group-hover:translate-x-1 transition-transform")}>
                  {t("products.allProducts")}
                </span>
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={cn(
                    "text-start text-sm md:text-base transition-all duration-200 py-1 flex items-center gap-2 group cursor-pointer",
                    selectedCategory === cat.slug 
                      ? "text-primary font-bold" 
                      : "text-black/60 hover:text-black"
                  )}
                >
                  {selectedCategory === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  <span className={cn(selectedCategory !== cat.slug && "group-hover:translate-x-1 transition-transform truncate")}>
                    {getTranslatedCategory(cat.slug)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <SectionLabel text={selectedCategory ? `${t("products.category.title")}: ${getTranslatedCategory(selectedCategory)}` : t("home.explore.label")} />

          <div className="mt-6">
            {isProductsLoading ? (
              <div className="flex flex-col items-center justify-center min-h-125 w-full text-center text-black/50">
                <Loader2 className="animate-spin" size={40} />
                <p>{t("products.search.loading")}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-black/50 text-lg font-poppins">
                {t("products.errors.noProductsInCategory")}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7.5">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
