import { ChevronRight, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { SIDEBAR_CATEGORIES } from "../constants";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();

  return (
    <>
      <div className="lg:hidden w-full py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between w-full px-5 py-3.5 bg-black/5 hover:bg-black/10 rounded-xl transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Menu size={20} className="text-primary" />
            <span className="font-poppins font-medium text-sm text-black">
              {t("home.browseAllCategories")}
            </span>
          </div>
          <ChevronRight
            size={18}
            className={cn(
              "text-black/30 group-hover:translate-x-1 transition-transform",
              isRtl && "rotate-180 group-hover:-translate-x-1"
            )}
          />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(
            "absolute top-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl p-6 pt-12 overflow-y-auto duration-300",
            isRtl 
              ? "right-0 animate-in slide-in-from-right" 
              : "left-0 animate-in slide-in-from-left"
          )}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
              <h3 className="font-inter font-bold text-xl text-black">
                {t("home.categories")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col gap-6">
              {SIDEBAR_CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="flex items-center justify-between py-1 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-base font-normal text-black group-hover:text-primary transition-colors">
                      {t(cat.label)}
                    </span>
                    {cat.hasSub && (
                      <ChevronRight
                        size={20}
                        className={cn(
                          "text-black/20 group-hover:text-primary transition-all",
                          isRtl && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <aside className="hidden lg:block w-64 border-e border-black/10 pt-10 pe-4 shrink-0">
        <ul className="flex flex-col gap-7">
          {SIDEBAR_CATEGORIES.map((cat) => (
            <li key={cat.label}>
              <Link
                to={`/category/${cat.slug}`}
                className="flex items-center justify-between group transition-all"
              >
                <span className="text-base font-normal leading-6 text-black group-hover:text-primary transition-colors">
                  {t(cat.label)}
                </span>
                {cat.hasSub && (
                  <ChevronRight
                    size={24}
                    className={cn(
                      "text-black group-hover:text-primary transition-colors",
                      isRtl && "rotate-180"
                    )}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

