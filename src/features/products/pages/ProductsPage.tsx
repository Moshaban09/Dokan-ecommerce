import { useEffect, useState } from "react";
import { ProductService } from "../api/product-service";
import type { Product, CategoryItem } from "../types";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { SectionLabel } from "@/components/common/SectionLabel";
import { cn } from "@/lib/utils";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_TRANSLATION_MAP } from "../constants";

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("products.allProducts"));
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  const getTranslatedCategory = (slug: string) => {
    const key = CATEGORY_TRANSLATION_MAP[slug];
    return key ? t(key) : slug.replace(/-/g, " ");
  };

  const fetchProducts = async (category: string | null, page: number) => {
    setIsProductsLoading(true);
    const skip = (page - 1) * PAGE_SIZE;
    try {
      const response = category
        ? await ProductService.getProductsByCategory(category, { limit: PAGE_SIZE, skip })
        : await ProductService.getProducts({ limit: PAGE_SIZE, skip });

      setProducts(response.products ?? []);
      setTotalProducts(response.total ?? 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // Initial load: fetch products + categories simultaneously
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const init = async () => {
      setIsProductsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          ProductService.getProducts({ limit: PAGE_SIZE, skip: 0 }),
          ProductService.getCategories(),
        ]);
        setProducts(productsRes.products ?? []);
        setTotalProducts(productsRes.total ?? 0);
        setCategories(categoriesRes);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsProductsLoading(false);
      }
    };
    init();
  }, []);

  const handleCategoryClick = (slug: string | null) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    fetchProducts(slug, 1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchProducts(selectedCategory, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build page number array (show at most 5 pages around current)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
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
        {/* Sidebar */}
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

        {/* Products Grid */}
        <div className="flex-1 flex flex-col gap-8">
          <SectionLabel text={selectedCategory ? `${t("products.category.title")}: ${getTranslatedCategory(selectedCategory)}` : t("home.explore.label")} />

          <div className="mt-2">
            {isProductsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7.5">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
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

          {/* ✅ Pagination */}
          {!isProductsLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-4 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-black/10 text-black/60 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-black/40 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-all",
                      currentPage === page
                        ? "bg-primary text-white border border-primary"
                        : "border border-black/10 text-black hover:border-black"
                    )}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded border border-black/10 text-black/60 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Total count info */}
          {!isProductsLoading && totalProducts > 0 && (
            <p className="text-center text-sm text-black/40">
              {t("products.pagination.showing", {
                from: (currentPage - 1) * PAGE_SIZE + 1,
                to: Math.min(currentPage * PAGE_SIZE, totalProducts),
                total: totalProducts,
                defaultValue: `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, totalProducts)} of ${totalProducts} products`
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
