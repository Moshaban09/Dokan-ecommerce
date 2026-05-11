import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", name: "English", label: "EN" },
    { code: "ar", name: "العربية", label: "AR" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
          isOpen ? "bg-gray-100" : "hover:bg-gray-50"
        )}
        aria-label={t("nav.selectLanguage")}
      >
        <Globe size={20} className="text-black/70" />
        <span className="text-sm font-semibold text-black">
          {currentLanguage.label}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-black/40 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-black/5 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col gap-0.5">
            <div className="px-3 py-2 text-[10px] font-bold text-black/40 uppercase tracking-widest">
              {t("nav.selectLanguage")}
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all text-start cursor-pointer group",
                  i18n.language === lang.code
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/5"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lang.name}</span>
                  <span className={cn(
                    "text-[10px]",
                    i18n.language === lang.code ? "text-white/60" : "text-black/40"
                  )}>
                    {lang.code === 'ar' ? 'Arabic' : 'English'}
                  </span>
                </div>
                {i18n.language === lang.code && (
                  <Check size={16} className="text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
