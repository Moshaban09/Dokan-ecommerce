import { SectionLabel } from "@/components/common/SectionLabel";
import { ProductService } from "@/features/products";
import type { CategoryItem } from "@/features/products/types";
import { buttonVariants } from "@/components/ui/variants";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import {
  Activity,
  Armchair,
  ArrowLeft,
  ArrowRight,
  Bike,
  Camera,
  Car,
  Footprints,
  Gamepad2,
  Gem,
  Glasses,
  Headphones,
  LayoutGrid,
  Monitor,
  Palette,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Utensils,
  Watch,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";

const ICON_MAP: Record<string, React.ElementType> = {
  
  smartphones: Smartphone,
  laptops: Monitor,
  tablets: Monitor,
  "smart-watches": Watch,
  "mobile-accessories": Smartphone,

  
  beauty: Sparkles,
  fragrances: Wind,
  "skin-care": Sparkles,
  "mens-shirts": Shirt,
  "womens-dresses": Shirt,
  tops: Shirt,
  "mens-shoes": Footprints,
  "womens-shoes": Footprints,
  "womens-bags": ShoppingBag,
  "womens-jewellery": Gem,
  sunglasses: Glasses,

  
  furniture: Armchair,
  groceries: ShoppingBasket,
  "home-decoration": Palette,
  "kitchen-accessories": Utensils,
  "sports-accessories": Activity,

  
  vehicle: Car,
  motorcycle: Bike,

  
  lighting: Camera,
  gaming: Gamepad2,
  headphones: Headphones,
};

import { CATEGORY_TRANSLATION_MAP } from "@/features/products";

export const BrowseByCategorySection = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  useEffect(() => {
    ProductService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleNext = () => {
    if (startIndex + visibleCount < categories.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + visibleCount,
  );

  return (
    <section className="pb-4 container mx-auto px-4">
      <SectionLabel text={t("home.browseByCategory.label")} />

      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-semibold tracking-tight font-inter text-black">
          {t("home.browseByCategory.title")}
        </h2>
        <div className="flex gap-2">
          <IconButton
            onClick={handlePrev}
            disabled={startIndex === 0}
            size="sm"
            aria-label={isRtl ? "التالي" : "Previous"}
          >
            {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={startIndex + visibleCount >= categories.length}
            size="sm"
            aria-label={isRtl ? "السابق" : "Next"}
          >
            {isRtl ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {visibleCategories.map((cat) => {
          const Icon = ICON_MAP[cat.slug] || LayoutGrid;
          const translationKey = CATEGORY_TRANSLATION_MAP[cat.slug];
          const displayName = translationKey ? t(translationKey) : cat.name;

          return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center justify-center gap-4 h-[145px] rounded-[4px] border border-gray-300 bg-white text-black transition-all duration-300 group cursor-pointer hover:bg-primary hover:text-white hover:border-primary"
            >
              <Icon
                size={56}
                strokeWidth={1}
                className="text-black group-hover:text-white transition-colors duration-300"
              />
              <span className="text-base font-normal capitalize text-center px-2">
                {displayName}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          to="/products"
          className={cn(buttonVariants({ variant: "default" }), "px-12 py-4 h-auto rounded-lg text-[16px] font-medium font-poppins transition-all duration-300 hover:-translate-y-1")}
        >
          {t("home.browseByCategory.viewAll")}
        </Link>
      </div>
    </section>
  );
};
