import { cn } from "@/lib/utils";
import { Headphones, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FeaturesBar = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Truck,
      title: t("home.features.delivery.title"),
      desc: t("home.features.delivery.desc"),
    },
    {
      icon: Headphones,
      title: t("home.features.service.title"),
      desc: t("home.features.service.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("home.features.guarantee.title"),
      desc: t("home.features.guarantee.desc"),
    },
  ];

  return (
    <section className="py-10 pb-0 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
        {features.map(({ icon: Icon, title, desc }, index) => (
          <div
            key={title}
            className={cn(
              "flex flex-col items-center text-center group",
              index === 2 && "md:col-span-2 lg:col-span-1"
            )}
          >
            <div className="w-20 h-20 rounded-full bg-[#2F2E30]/30 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                <Icon size={32} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-[20px] font-bold font-inter mb-2 text-black">
              {title}
            </h3>
            <p className="text-[14px] font-normal font-poppins text-black/70">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
