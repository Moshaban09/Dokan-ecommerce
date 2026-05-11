import { useState, useEffect } from "react";
import {
  Store,
  DollarSign,
  ShoppingBag,
  Coins,
  Truck,
  Headphones,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { SocialIcons } from "@/components/common/SocialIcons";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";

import team1Img from "@/assets/team/team_1.png";
import team2Img from "@/assets/team/team_3.png";
import team3Img from "@/assets/team/team_will.png";
import aboutStoryImg from "@/assets/about_story.png";

export default function AboutPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.about"));
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Store,
      value: "10.5k",
      label: t("about.stats.sellers"),
    },
    {
      icon: DollarSign,
      value: "33k",
      label: t("about.stats.sales"),
    },
    {
      icon: ShoppingBag,
      value: "45.5k",
      label: t("about.stats.customers"),
    },
    {
      icon: Coins,
      value: "25k",
      label: t("about.stats.gross"),
    },
  ];

  const team = [
    {
      image: team1Img,
      name: t("about.team.members.member1"),
      role: t("about.team.founder"),
    },
    {
      image: team2Img,
      name: t("about.team.members.member2"),
      role: t("about.team.director"),
    },
    {
      image: team3Img,
      name: t("about.team.members.member3"),
      role: t("about.team.designer"),
    },
  ];

  const featuresList = [
    {
      icon: Truck,
      title: t("home.features.delivery.title"),
      description: t("home.features.delivery.desc"),
    },
    {
      icon: Headphones,
      title: t("home.features.service.title"),
      description: t("home.features.service.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("home.features.guarantee.title"),
      description: t("home.features.guarantee.desc"),
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-[135px] py-10 md:py-20 flex flex-col gap-20 md:gap-32 text-black">
      <Breadcrumb 
        items={[
          { label: t("common.home"), href: "/" },
          { label: t("nav.about"), active: true }
        ]} 
        className="-mb-10 md:-mb-20"
      />

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
        <div className="w-full lg:w-1/2 lg:pe-20">
          <h1 className="text-[40px] md:text-[54px] font-semibold leading-tight tracking-[0.04em] font-inter mb-6 md:mb-10">
            {t("about.story.title")}
          </h1>
          <div className="flex flex-col gap-6 text-[16px] leading-[26px] font-poppins">
            <p>{t("about.story.p1")}</p>
            <p>{t("about.story.p2")}</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative lg:-me-[135px]">
          <div className="aspect-[705/609] w-full bg-[#EB7BA3] rounded-s-[4px] overflow-hidden flex items-center justify-center">
            <img
              src={aboutStoryImg}
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group border border-black/30 rounded-[4px] p-8 flex flex-col items-center gap-6 hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-colors">
                <stat.icon size={32} className="text-white group-hover:text-black transition-colors" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-[32px] font-bold leading-[30px] font-inter group-hover:text-white mb-3">
                {stat.value}
              </h3>
              <p className="text-[16px] font-poppins group-hover:text-white">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div key={index} className="flex flex-col gap-6">
            <div className="aspect-[370/430] w-full bg-secondary rounded-[4px] flex items-end justify-center overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-[32px] font-medium leading-[30px] tracking-[0.04em] font-inter">
                  {member.name}
                </h3>
                <p className="text-[16px] font-poppins opacity-70">{member.role}</p>
              </div>

                      <SocialIcons className="flex gap-4 text-black" iconSize={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3 -mt-10 md:-mt-20">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-500 cursor-pointer",
              i === activeDot
                ? "bg-primary ring-[3px] ring-gray-300 ring-offset-[1px]"
                : "bg-gray-300"
            )}
            onClick={() => setActiveDot(i)}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 py-10">
        {featuresList.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center gap-6 max-w-[260px]">
            <div className="w-20 h-20 rounded-full bg-black/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                <feature.icon size={32} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[20px] font-semibold font-poppins uppercase">
                {feature.title}
              </h3>
              <p className="text-[14px] font-poppins">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

