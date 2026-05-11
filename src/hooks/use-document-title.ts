import { useEffect } from "react";
import { useTranslation } from "react-i18next";


export function useDocumentTitle(title: string, includeSiteName = true) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const brandName = t("nav.brand");
    const fullTitle = includeSiteName ? `${title} | ${brandName}` : title;
    document.title = fullTitle;
  }, [title, includeSiteName, t, i18n.language]);
}
