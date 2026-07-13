import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth";
import { AccountSidebar } from "./AccountSidebar";
import { Breadcrumb } from "@/components/common/Breadcrumb";

interface BreadcrumbItem {
  label: string;
  to?: string;
  active?: boolean;
}

interface AccountLayoutProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  children: ReactNode;
}

export function AccountLayout({ title, breadcrumbItems, children }: AccountLayoutProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="max-w-360 mx-auto px-4 py-20 min-h-[50vh]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <Breadcrumb items={breadcrumbItems} className="mb-0" />
        <div className="text-sm text-black whitespace-nowrap">
          {t("account.welcome")}{" "}
          <span className="text-primary font-medium">
            {user?.name || t("account.profile.guest")}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
        <AccountSidebar />

        <div className="w-full md:w-3/4 shadow-[0_1px_13px_0_rgba(0,0,0,0.05)] bg-white px-8 md:px-14 py-10 rounded">
          <h2 className="text-primary font-medium text-xl mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
