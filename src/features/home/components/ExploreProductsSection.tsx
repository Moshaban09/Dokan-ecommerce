import { useTranslation } from "react-i18next";
import { ProductSection } from "@/features/products/components/ProductSection";
import { useProducts } from "@/features/products/hooks/use-products";

export const ExploreProductsSection = () => {
  const { t } = useTranslation();
  const { products, isLoading } = useProducts({ limit: 12 });

  return (
    <ProductSection
      label={t("home.explore.label")}
      title={t("home.explore.title")}
      products={products}
      isLoading={isLoading}
      viewAllLink="/products"
      viewAllText={t("home.explore.viewAll")}
      variant="scroll"
    />
  );
};

