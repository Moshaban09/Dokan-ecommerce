import { PageContainer } from "@/components/common/PageContainer";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const questions = [
  "shipping",
  "returns",
  "payment",
  "coupons",
  "account",
  "tracking",
  "cancel",
] as const;

export default function FaqPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("legal.faq.title"));

  return (
    <PageContainer className="py-20 flex flex-col text-black">
      <Breadcrumb
        items={[
          { label: t("common.home"), to: "/" },
          { label: t("legal.faq.title"), active: true }
        ]}
        className="mb-20"
      />

      <div className="max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] md:text-[54px] font-semibold leading-tight tracking-[0.04em] font-inter">
            {t("legal.faq.title")}
          </h1>
          <p className="text-base leading-[26px] font-poppins">{t("legal.faq.intro")}</p>
        </div>

        <div className="flex flex-col divide-y divide-black/10 border-y border-black/10">
          {questions.map((key) => (
            <details key={key} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-base font-medium font-poppins">
                {t(`legal.faq.${key}.q`)}
                <ChevronDown
                  size={20}
                  className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="mt-4 text-base leading-[26px] font-poppins opacity-80">
                {t(`legal.faq.${key}.a`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
