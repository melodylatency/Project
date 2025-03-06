import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/ticketModalSlice";

const Footer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
          <p className="dark:text-gray-300 text-sm underline opacity-70 cursor-pointer">
            <span onClick={() => dispatch(openModal())}>
              Create support ticket
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
