import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDocumentTitle(title: string, includeSiteName = true) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const brandName = t("nav.brand");
    document.title = includeSiteName ? `${title} | ${brandName}` : title;
  }, [title, includeSiteName, t, i18n.language]);
}
