import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { AccountLayout } from "../components/AccountLayout";

export default function CancellationsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("account.cancellations.title"));

  return (
    <AccountLayout
      title={t("account.cancellations.title")}
      breadcrumbItems={[
        { label: t("common.home"), to: "/" },
        { label: t("account.sidebar.manageAccount"), to: "/account" },
        { label: t("account.cancellations.title"), active: true },
      ]}
    >
      <div className="flex flex-col items-center justify-center min-h-[30vh]">
        <p className="text-center font-normal text-[16px] text-black max-w-2xl">
          {t("account.cancellations.empty")}
        </p>
      </div>
    </AccountLayout>
  );
}
