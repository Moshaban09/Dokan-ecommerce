import { BestSellingSection } from "../components/BestSellingSection";
import { BrowseByCategorySection } from "../components/BrowseByCategorySection";
import { ExploreProductsSection } from "../components/ExploreProductsSection";
import { FeaturesBar } from "../components/FeaturesBar";
import { FlashSalesSection } from "../components/FlashSalesSection";
import { HeroSection } from "../components/HeroSection";
import { NewArrivalSection } from "../components/NewArrivalSection";
import { PromoBanner } from "../components/PromoBanner";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/common/PageContainer";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.home"));
  return (
    <PageContainer className="animate-fade-in space-y-20 pb-20">
      <HeroSection />

      <FlashSalesSection />
      <div className="container mx-auto px-4">
        <Separator className="opacity-30" />
      </div>

      <BrowseByCategorySection />
      <div className="container mx-auto px-4">
        <Separator className="opacity-30" />
      </div>

      <BestSellingSection />

      <PromoBanner />

      <ExploreProductsSection />
      <div className="container mx-auto px-4">
        <Separator className="opacity-30" />
      </div>

      <NewArrivalSection />

      <FeaturesBar />
    </PageContainer>
  );
};

export default HomePage;
