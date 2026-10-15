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
      return <img src={appleIconImg} alt="Apple" className="w-6 h-6 object-contain" />;
    case "sony":
      return <Gamepad2 className="w-6 h-6 text-white" />;
    case "canon":
      return <Camera className="w-6 h-6 text-white" />;
    case "laptop":
      return <Laptop className="w-6 h-6 text-white" />;
    case "fashion":
      return <Shirt className="w-6 h-6 text-white" />;
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
      <div className="relative bg-primary-dark w-full overflow-hidden group h-115 md:h-105 lg:h-110 mx-auto lg:max-w-268 rounded-lg border-0">
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
                "min-w-full h-full bg-linear-to-br from-primary to-primary-dark flex flex-col items-center justify-center lg:justify-between px-6 lg:px-16 gap-6 lg:gap-0 pt-10 pb-16 lg:py-0",
                isRtl ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              <div className={cn(
                "flex flex-col gap-3 lg:gap-5 text-white max-w-lg z-10 text-center items-center shrink-0",
                isRtl ? "lg:text-right lg:items-end" : "lg:text-left lg:items-start"
              )}>
                <div className="flex items-center gap-3 lg:gap-6">
                  <div className="scale-75 lg:scale-100">
                    <BrandIcon type={slide.brandType} />
                  </div>
                  <span className="font-poppins font-normal text-sm lg:text-base leading-6 opacity-90">
                    {slide.brand}
                  </span>
                </div>
                <h2 className="font-inter font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight lg:leading-15 whitespace-pre-line tracking-[0.04em]">
                  {slide.title}
                </h2>
                <div className="flex items-center gap-2 pt-2 group/btn cursor-pointer w-fit">
                  <div className="relative">
                    <Link
                      to="/products"
                      className="font-poppins font-medium text-sm lg:text-base leading-6 text-white transition-colors relative after:absolute after:-bottom-1.5 after:start-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all after:duration-400 after:ease-out hover:after:w-full"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                  <ArrowRight
                    size={20}
                    className={cn(
                      "lg:size-6 text-white transition-transform duration-400 ease-out group-hover/btn:translate-x-1.5",
                      isRtl && "rotate-180 group-hover/btn:-translate-x-1.5"
                    )}
                  />
                </div>
              </div>

              <div className="relative flex-1 w-full lg:w-1/2 h-full flex items-center justify-center overflow-hidden">
                <div className="absolute size-56 lg:size-80 rounded-full bg-white/10 blur-2xl" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={cn(
                    "relative h-full max-h-[200px] md:max-h-[280px] lg:max-h-[320px] w-auto max-w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-105",
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 inset-x-0 flex justify-center z-20">
          <div className="flex gap-3 px-3 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 border cursor-pointer",
                i === current
                  ? "!bg-white !border-white scale-125"
                  : "bg-white/30 border-transparent hover:bg-white/60",
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


