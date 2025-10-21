import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    // Apply RTL/LTR direction dynamically
    document.body.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-white border border-white/20 hover:border-white/30 ${
        currentLanguage === 'ar' ? "flex-row-reverse gap-2" : "gap-2"
      }`}
      title={`Switch to ${currentLanguage === 'en' ? 'Arabic' : 'English'}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span className="text-sm font-medium">
        {currentLanguage === 'en' ? 'عربي' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;