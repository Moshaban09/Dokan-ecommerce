import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export const TopHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-black text-white text-[14px] py-3 px-4">
      <div className="max-w-360 mx-auto flex items-center justify-center relative">
        <div className="flex items-center gap-2">
          <p className="hidden sm:block text-white/90">
            {t("topHeader.promo")}
          </p>
          <p className="sm:hidden text-white/90">{t("topHeader.promoMobile")}</p>
          <Link
            to="/"
            className="font-semibold transition-all relative py-1 after:absolute after:bottom-0 after:start-0 after:h-[1px] after:bg-white after:w-full sm:after:w-0 sm:hover:after:w-full after:transition-all after:duration-300 ms-2"
          >
            {t("topHeader.shopNow")}
          </Link>
        </div>
      </div>
    </div>
  );
};

