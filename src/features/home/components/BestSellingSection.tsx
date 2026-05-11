import { useTranslation } from "react-i18next";
import { ProductSection } from "@/features/products";
import { useProducts } from "@/features/products/hooks/use-products";

export const BestSellingSection = () => {
  const { t } = useTranslation();
  const { products, isLoading } = useProducts({
    limit: 8,
    sortBy: "rating",
    order: "desc",
  });

  return (
    <ProductSection
      title={t("home.bestSelling.title")}
      label={t("home.bestSelling.label")}
      products={products}
      isLoading={isLoading}
      viewAllLink="/products"
      viewAllText={t("home.bestSelling.viewAll")}
      variant="scroll"
    />
  );
};
