import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-teal-400 dark:bg-gray-800">
      <div className="flex flex-col items-center py-3">
        <div className="flex">
          <p className="dark:text-gray-300 text-lg opacity-70">
            {t("brand")} &copy; {currentYear}
          </p>
        </div>
        <div className="flex">
          <p className="dark:text-gray-300 text-sm underline opacity-70">
            <Link to={"/ticket"}>Create support ticket</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
