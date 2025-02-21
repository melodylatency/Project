import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-teal-400 dark:bg-gray-800">
      <div className="flex justify-center py-3">
        <p className="dark:text-gray-400 text-lg">
          {t("brand")} &copy; {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
