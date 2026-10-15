import { PageContainer } from "@/components/common/PageContainer";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";

const sections = ["collect", "use", "storage", "cookies", "rights"] as const;

export default function PrivacyPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("legal.privacy.title"));

  return (
    <PageContainer className="py-20 flex flex-col text-black">
      <Breadcrumb
        items={[
          { label: t("common.home"), to: "/" },
          { label: t("legal.privacy.title"), active: true }
        ]}
        className="mb-20"
      />

      <div className="max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] md:text-[54px] font-semibold leading-tight tracking-[0.04em] font-inter">
            {t("legal.privacy.title")}
          </h1>
          <p className="text-sm font-poppins opacity-60">{t("legal.privacy.lastUpdated")}</p>
          <p className="text-base leading-[26px] font-poppins">{t("legal.privacy.intro")}</p>
        </div>

        {sections.map((key) => (
          <section key={key} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold font-poppins">
              {t(`legal.privacy.${key}.title`)}
            </h2>
            <p className="text-base leading-[26px] font-poppins">
              {t(`legal.privacy.${key}.body`)}
            </p>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
