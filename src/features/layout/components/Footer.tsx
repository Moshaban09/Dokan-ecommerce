import { SendHorizontal } from "lucide-react";
import { Link } from "react-router";
import { SocialIcons } from "@/components/common/SocialIcons";
import { useTranslation } from "react-i18next";
import qrCodeImg from "@/assets/Qrcode 1.png";
import googlePlayImg from "@/assets/google-play-.png";
import appStoreImg from "@/assets/appstore.png";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#050505] text-primary-foreground mt-10 md:mt-20 pt-16 md:pt-24 border-t border-white/5">
      <div className="container mx-auto px-4 pb-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 text-start">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold font-inter tracking-wider">{t("nav.brand")}</h2>
          <div className="space-y-4">
            <p className="text-xl font-medium font-poppins">{t("footer.subscribe")}</p>
            <p className="text-sm font-normal font-poppins text-zinc-400">
              {t("footer.getOff")}
            </p>
          </div>
          <div className="relative flex items-center max-w-[280px] group">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-zinc-500 text-sm w-full focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pe-12"
            />
            <button
              className="absolute end-2 p-2 text-white hover:text-primary transition-colors cursor-pointer"
              aria-label={t("footer.subscribe")}
            >
              <SendHorizontal size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 space-y-6">
          <h3 className="text-xl font-medium font-poppins">{t("footer.support")}</h3>
          <ul className="space-y-4 text-sm font-normal font-poppins text-zinc-400">
            <li className="leading-relaxed">{t("footer.address")}</li>
            <li className="hover:text-white transition-colors cursor-pointer">support@dokan.com</li>
            <li className="hover:text-white transition-colors cursor-pointer">+88015-88888-9999</li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-1 space-y-6">
          <h3 className="text-xl font-medium font-poppins">{t("footer.account")}</h3>
          <ul className="space-y-4 text-sm font-normal font-poppins">
            {[
              { key: "myAccount", label: t("footer.myAccount") },
              { key: "loginRegister", label: t("footer.loginRegister") },
              { key: "cart", label: t("footer.cart") },
              { key: "wishlist", label: t("footer.wishlist") },
              { key: "shop", label: t("footer.shop") },
            ].map((item) => (
              <li key={item.key}>
                <Link
                  to="#"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1 md:col-span-1 space-y-6">
          <h3 className="text-xl font-medium font-poppins">{t("footer.quickLink")}</h3>
          <ul className="space-y-4 text-sm font-normal font-poppins">
            {[
              { key: "privacyPolicy", label: t("footer.privacyPolicy") },
              { key: "termsOfUse", label: t("footer.termsOfUse") },
              { key: "faq", label: t("footer.faq") },
              { key: "contact", label: t("footer.contact") },
            ].map((item) => (
              <li key={item.key}>
                <Link
                  to="#"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1 space-y-6">
          <h3 className="text-xl font-medium font-poppins">{t("footer.downloadApp")}</h3>
          <div className="space-y-4">
            <p className="text-xs font-medium font-poppins text-zinc-500">
              {t("footer.saveApp")}
            </p>
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-white/5 rounded-lg p-1.5 flex items-center justify-center border border-white/10 shrink-0">
                <img src={qrCodeImg} alt="QR Code" className="w-full h-full object-contain invert grayscale" />
              </div>
              <div className="flex flex-col gap-2 justify-between">
                <a href="#" className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
                  <img src={googlePlayImg} alt="Google Play" className="h-9 w-[110px] object-contain" />
                </a>
                <a href="#" className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
                  <img src={appStoreImg} alt="App Store" className="h-9 w-[110px] object-contain" />
                </a>
              </div>
            </div>
          </div>
          <SocialIcons className="flex gap-6 pt-4 border-t border-white/5" />
        </div>
      </div>

      <div className="border-t border-white/5 text-center py-6 text-xs font-normal font-poppins text-zinc-600 tracking-wider">
        &copy; {t("footer.copyright")}
      </div>
    </footer>
  );
};
