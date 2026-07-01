import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAuth } from "@/features/auth";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";

import { AccountSidebar } from "../components/AccountSidebar";

export default function CancellationsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("account.cancellations.title"));
  const { user } = useAuth();

  return (
    <div className="max-w-360 mx-auto px-4 py-20 min-h-[50vh]">
      {}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <Breadcrumb
          items={[
            { label: t("common.home"), to: "/" },
            { label: t("account.sidebar.manageAccount"), to: "/account" },
            { label: t("account.cancellations.title"), active: true },
          ]}
          className="mb-0"
        />
        <div className="text-sm text-black whitespace-nowrap">
          {t("account.welcome")}{" "}
          <span className="text-primary font-medium">{user?.name || t("account.profile.guest")}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
        {}
        <AccountSidebar />

        {}
        <div className="w-full md:w-3/4 shadow-[0_1px_13px_0_rgba(0,0,0,0.05)] bg-white px-8 md:px-14 py-10 rounded">
          <h2 className="text-primary font-medium text-xl mb-6">
            {t("account.cancellations.title")}
          </h2>
          <div className="flex flex-col items-center justify-center min-h-[30vh]">
            <p className="text-center font-normal text-[16px] text-black max-w-2xl">
              {t("account.cancellations.empty")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
