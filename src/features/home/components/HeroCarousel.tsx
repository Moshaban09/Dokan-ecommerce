import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Gamepad2, Camera, Laptop, Shirt } from "lucide-react";
import type { Slide } from "../types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import appleIconImg from "@/assets/apple_icon.png";
import iphoneImg from "@/assets/hero_endframe_cutout.webp";
import ps5Img from "@/assets/ps5_hero_cutout.webp";
import cameraImg from "@/assets/camera_hero_cutout.webp";
import laptopImg from "@/assets/laptop_hero_cutout.webp";
import sneakerImg from "@/assets/sneakers_hero_cutout.webp";

const BrandIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case "apple":
      return <img src={appleIconImg} alt="Apple" className="w-5 h-5 object-contain" />;
    case "sony":
      return <Gamepad2 className="w-5 h-5 text-white" />;
    case "canon":
      return <Camera className="w-5 h-5 text-white" />;
    case "laptop":
      return <Laptop className="w-5 h-5 text-white" />;
    case "fashion":
      return <Shirt className="w-5 h-5 text-white" />;
    default:
      return null;
  }
};

interface HeroCarouselProps {
  slides?: Slide[];
}

export const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();
  const [current, setCurrent] = useState(0);

  const defaultSlides: Slide[] = [
    {
      id: 1,
      brand: t("home.heroSlides.iphone.brand"),
      brandType: "apple",
      title: t("home.heroSlides.iphone.title"),
      cta: t("home.heroSlides.iphone.cta"),
      image: iphoneImg,
    },
    {
      id: 2,
      brand: t("home.heroSlides.ps5.brand"),
      brandType: "sony",
      title: t("home.heroSlides.ps5.title"),
      cta: t("home.heroSlides.ps5.cta"),
      image: ps5Img,
    },
    {
      id: 3,
      brand: t("home.heroSlides.camera.brand"),
      brandType: "canon",
      title: t("home.heroSlides.camera.title"),
      cta: t("home.heroSlides.camera.cta"),
      image: cameraImg,
    },
    {
      id: 4,
      brand: t("home.heroSlides.laptop.brand"),
      brandType: "laptop",
      title: t("home.heroSlides.laptop.title"),
      cta: t("home.heroSlides.laptop.cta"),
      image: laptopImg,
    },
    {
      id: 5,
      brand: t("home.heroSlides.fashion.brand"),
      brandType: "fashion",
      title: t("home.heroSlides.fashion.title"),
      cta: t("home.heroSlides.fashion.cta"),
      image: sneakerImg,
    },
  ];

  const activeSlides = slides || defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="flex-1 lg:pt-10">
      <div className="relative bg-sand w-full overflow-hidden group h-115 md:h-105 lg:h-110 mx-auto lg:max-w-268 rounded-2xl border border-border">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${isRtl ? (current * 100) : -(current * 100)}%)`
          }}
        >
          {activeSlides.map((slide) => (
            <div
              key={slide.id}
              className={cn(
                "min-w-full h-full bg-linear-to-br from-sand to-[#F8F3E9] flex flex-col items-center justify-center lg:justify-between px-6 lg:px-16 gap-3 lg:gap-0 pt-6 pb-20 lg:py-0",
                isRtl ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              <div className={cn(
                "flex flex-col gap-3 lg:gap-5 text-black max-w-lg z-10 text-center items-center shrink-0",
                isRtl ? "lg:text-right lg:items-end" : "lg:text-left lg:items-start"
              )}>
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-primary flex items-center justify-center">
                    <BrandIcon type={slide.brandType} />
                  </span>
                  <span className="font-poppins font-medium text-sm lg:text-base leading-6 text-primary">
                    {slide.brand}
                  </span>
                </div>
                <h2 className="font-inter font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight lg:leading-[1.15] whitespace-pre-line">
                  {slide.title}
                </h2>
                <Link
                  to="/products"
                  className="group/btn mt-1 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white font-poppins font-medium text-sm lg:text-base px-6 py-3 transition-colors"
                >
                  {slide.cta}
                  <ArrowRight
                    size={18}
                    className={cn(
                      "transition-transform duration-300 group-hover/btn:translate-x-1",
                      isRtl && "rotate-180 group-hover/btn:-translate-x-1"
                    )}
                  />
                </Link>
              </div>

              <div className="relative flex-1 w-full lg:w-1/2 h-full flex items-center justify-center">
                <div className="absolute size-44 md:size-64 lg:size-80 rounded-full bg-white shadow-[0_20px_60px_rgba(15,90,70,0.12)]" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="relative h-full max-h-[160px] md:max-h-[260px] lg:max-h-[330px] w-auto max-w-[85%] object-contain drop-shadow-[0_16px_20px_rgba(30,42,37,0.25)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 inset-x-0 flex justify-center z-20">
          <div className="flex gap-2.5 px-3 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-border">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  i === current
                    ? "w-6 bg-primary"
                    : "w-2.5 bg-black/20 hover:bg-black/40",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
