import { useTranslation } from "react-i18next";
import { ProductSection } from "@/features/products";
import { CountdownTimer } from "./CountdownTimer";
import { useProducts } from "@/features/products/hooks/use-products";

export const FlashSalesSection = () => {
  const { t } = useTranslation();
  const { products, isLoading } = useProducts({
    limit: 10,
    sortBy: "discountPercentage",
    order: "desc",
  });

  return (
    <ProductSection
      title={t("home.flashSales.title")}
      label={t("home.flashSales.label")}
      products={products}
      isLoading={isLoading}
      viewAllLink="/products"
      viewAllText={t("home.flashSales.viewAll")}
      variant="scroll"
    >
      <CountdownTimer variant="inline" durationHours={24} />
    </ProductSection>
  );
};
