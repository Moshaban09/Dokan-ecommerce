import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { AccountLayout } from "../components/AccountLayout";

export default function ReviewsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("account.reviews.title"));

  return (
    <AccountLayout
      title={t("account.reviews.title")}
      breadcrumbItems={[
        { label: t("common.home"), to: "/" },
        { label: t("account.sidebar.manageAccount"), to: "/account" },
        { label: t("account.reviews.title"), active: true },
      ]}
    >
      <div className="flex flex-col items-center justify-center min-h-[30vh]">
        <p className="text-center font-normal text-[16px] text-black max-w-2xl">
          {t("account.reviews.empty")}
        </p>
      </div>
    </AccountLayout>
  );
}
