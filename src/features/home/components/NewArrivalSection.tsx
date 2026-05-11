import { SectionLabel } from "@/components/common/SectionLabel";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/products/hooks/use-products";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { CATEGORY_TRANSLATION_MAP } from "@/features/products";

const ShopNowLink = ({ to }: { to: string }) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();
  return (
    <Link
      to={to}
      className="group/btn relative flex items-center gap-2.5 text-white text-[16px] font-medium font-poppins w-fit mt-auto transition-none!"
    >
      <span className="relative after:absolute after:-bottom-1.5 after:start-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all after:duration-400 after:ease-out hover:after:w-full">
        {t("home.shopNow")}
      </span>
      <ArrowRight
        size={18}
        className={cn(
          "transition-transform duration-400 ease-out group-hover/btn:translate-x-1.5",
          isRtl && "rotate-180 group-hover/btn:-translate-x-1.5"
        )}
      />
    </Link>
  );
};

export const NewArrivalSection = () => {
  const { t } = useTranslation();
  const { products: allProducts, isLoading } = useProducts({
    limit: 50,
    sortBy: "rating",
    order: "desc",
  });

  
  const products = [];
  const usedCategories = new Set();
  const excludedCategories = ["fragrances", "skin-care", "groceries"];

  if (allProducts.length > 0) {
    
    const priorityCategories = [
      "laptops",
      "smartphones",
      "mens-watches",
      "motorcycle",
      "furniture",
      "womens-bags",
      "sunglasses",
      "tablets",
    ];

    for (const cat of priorityCategories) {
      const found = allProducts.find(
        (p) => p.category === cat && !usedCategories.has(p.category),
      );
      if (found) {
        products.push(found);
        usedCategories.add(found.category);
      }
      if (products.length === 4) break;
    }

    
    if (products.length < 4) {
      for (const p of allProducts) {
        if (
          !usedCategories.has(p.category) &&
          !excludedCategories.includes(p.category) &&
          !p.title.toLowerCase().includes("water")
        ) {
          products.push(p);
          usedCategories.add(p.category);
        }
        if (products.length === 4) break;
      }
    }
  }

  const [large, medium, ...small] = products;

  if (isLoading) {
    return (
      <section className="py-15 container mx-auto px-4">
        <SectionLabel text={t("home.featured")} />
        <Skeleton className="h-10 w-48 mb-15" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-7.5 h-auto lg:h-150">
          <Skeleton className="md:col-span-2 lg:row-span-2 h-100 lg:h-full rounded-lg" />
          <Skeleton className="md:col-span-2 h-71 rounded-lg" />
          <Skeleton className="md:col-span-1 h-71 rounded-lg" />
          <Skeleton className="md:col-span-1 h-71 rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className=" container mx-auto px-4">
      <SectionLabel text={t("home.featured")} />
      <h2 className="text-[28px] md:text-[36px] font-bold tracking-[0.04em] font-inter leading-tight md:leading-12 text-black mb-10 md:mb-15">
        {t("home.newArrival")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-7.5">
        {}
        {large && (
          <div className="md:col-span-2 lg:row-span-2 relative rounded-lg overflow-hidden bg-black group h-112.5 lg:h-150">
            <img
              src={large.thumbnail}
              alt={large.title}
              className="absolute inset-0 w-full h-full object-contain p-10 opacity-90 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 start-0 p-6 md:p-8 z-10 w-full flex flex-col">
              <h3 className="text-white text-[20px] md:text-[24px] font-semibold font-inter mb-2">
                {large.title}
              </h3>
              <p className="text-primary-foreground text-[12px] md:text-[14px] font-normal font-poppins mb-4 max-w-70">
                {large.description}
              </p>
              <ShopNowLink to={`/product/${large.id}`} />
            </div>
          </div>
        )}

        {}
        {medium && (
          <div className="md:col-span-2 relative rounded-lg overflow-hidden bg-[#0D0D0D] group h-71">
            <img
              src={medium.thumbnail}
              alt={medium.title}
              className="absolute end-0 bottom-0 w-3/4 h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-0 start-0 p-6 z-10 w-full flex flex-col">
              <h3 className="text-white text-[20px] md:text-[24px] font-semibold font-inter mb-2">
                {medium.title}
              </h3>
              <p className="text-primary-foreground text-[12px] md:text-[14px] font-normal font-poppins mb-4 max-w-50">
                {CATEGORY_TRANSLATION_MAP[medium.category] ? t(CATEGORY_TRANSLATION_MAP[medium.category]) : medium.category} {t("home.collection")}
              </p>
              <ShopNowLink to={`/product/${medium.id}`} />
            </div>
          </div>
        )}

        {}
        {small.map((item) => (
          <div
            key={item.id}
            className="col-span-1 relative rounded-lg overflow-hidden bg-black group h-71 md:h-80 lg:h-71"
          >
            <div className="absolute inset-0 bg-radial from-white/5 to-transparent pointer-events-none" />
            <img
              src={item.thumbnail}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-contain p-6 md:p-10 lg:p-8 opacity-90 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute bottom-0 start-0 p-5 md:p-6 z-10 w-full flex flex-col">
              <h3 className="text-white text-[16px] md:text-[20px] font-semibold font-inter mb-1 line-clamp-1">
                {item.title}
              </h3>
              <ShopNowLink to={`/product/${item.id}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
