import { Link } from "react-router";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export default function NotFoundPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("products.errors.404.title"));

  return (
    <div className="container mx-auto px-4 lg:px-33.75 py-10 md:py-20 flex flex-col gap-10 min-h-[70vh]">
      <Breadcrumb 
        items={[
          { label: t("common.home"), href: "/" },
          { label: t("products.errors.404.breadcrumb"), active: true }
        ]}
      />

      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 md:py-20">
        <h1 className="text-[72px] md:text-[110px] font-medium font-inter tracking-wider leading-none text-black mb-6 animate-in fade-in zoom-in duration-500">
          {t("products.errors.404.title")}
        </h1>
        <p className="text-sm md:text-base font-poppins text-black/70 mb-10 md:mb-20 max-w-lg">
          {t("products.errors.404.message")}
        </p>
        <Link to="/">
          <Button
            className="bg-primary hover:bg-primary/90 text-white px-12 py-6 h-auto text-base font-medium rounded-sm shadow-lg shadow-primary/20 transition-all duration-300 active:scale-95 hover:-translate-y-1 cursor-pointer"
          >
            {t("products.errors.404.backToHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
