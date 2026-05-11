import { buttonVariants } from "@/components/ui/variants";
import { useProducts } from "@/features/products/hooks/use-products";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

interface TimeUnit {
  value: number;
  label: string;
}

export const PromoBanner = () => {
  const { t } = useTranslation();
  const { products } = useProducts({ limit: 10, sortBy: "discountPercentage", order: "desc" });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 5);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits: TimeUnit[] = [
    { value: timeLeft.days, label: t("home.promo.days") },
    { value: timeLeft.hours, label: t("home.promo.hours") },
    { value: timeLeft.minutes, label: t("home.promo.minutes") },
    { value: timeLeft.seconds, label: t("home.promo.seconds") },
  ];

  const promoProduct = products[0];

  return (
    <section className=" container mx-auto px-4">
      <div className="bg-black rounded-lg overflow-hidden relative min-h-[400px] md:min-h-[500px] flex items-center">
        {}
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-14 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex flex-col gap-6 md:gap-8 max-w-xl text-center lg:text-start items-center lg:items-start">
            <span className="text-success font-semibold font-poppins text-[16px]">
              {t("home.promo.label")}
            </span>
            <h2 className="text-white text-[32px] md:text-[48px] font-semibold font-inter leading-tight tracking-[0.04em] whitespace-pre-line">
              {t("home.promo.title")}
            </h2>

            {}
            <div className="flex gap-4 md:gap-6">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-lg"
                >
                  <span className="text-black font-bold text-[16px] md:text-[20px] font-poppins leading-none">
                    {unit.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-black text-[10px] md:text-[11px] font-normal font-poppins">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to={`/product/${promoProduct?.id || ""}`}
              className={cn(buttonVariants({ variant: "success" }), "px-12 py-4 h-auto rounded-lg text-[16px] font-medium font-poppins transition-all duration-300 hover:-translate-y-1 mt-4")}
            >
              {t("home.promo.buyNow")}
            </Link>
          </div>

          <div className="relative w-full max-w-lg lg:max-w-xl group">
             {}
             <div className="absolute inset-0 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-700" />
            {promoProduct && (
              <img
                src={promoProduct.thumbnail}
                alt={promoProduct.title}
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-700"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
