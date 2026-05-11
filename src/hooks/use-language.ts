import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const isRtl = currentLanguage.startsWith('ar');

  useEffect(() => {
    const html = document.documentElement;
    html.dir = isRtl ? 'rtl' : 'ltr';
    html.lang = currentLanguage;
  }, [currentLanguage, isRtl]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return { currentLanguage, isRtl, changeLanguage };
};
