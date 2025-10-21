import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../src/assets/logo.png";
import profileImg from "../../src/assets/logom.png";
import Cookies from "js-cookie";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();


  const logoutRequest = async () => {
    try {
      Cookies.remove("token");
      Cookies.remove("userId");
      Cookies.remove("userName");
      navigate("/login");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove cookie even if server call fails
      Cookies.remove("token");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-800 h-20 shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center h-full px-6">
        {/* Left Side - Brand Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            title="DMS - Document Management System"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
          >
            <div className="relative">
              <img
                className="h-12 w-auto object-contain drop-shadow-sm"
                src={logo}
                alt="DMS Logo"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-xl tracking-wide">
                {t("navbar.documentManagement")}
              </h1>
              <p className="text-indigo-100 text-xs -mt-1">{t("navbar.system")}</p>
            </div>
          </Link>
        </div>

        {/* Center - Profile Section */}
        <div className="flex items-center">
          <div className="relative">{/* // Insert LOGO Here */}</div>
        </div>

        {/* Right Side - Controls */}
        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Language Toggle */}
          <LanguageSwitcher />

          {/* Logout Button */}
          <button
            onClick={logoutRequest}
            className={`flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500/80 backdrop-blur-sm transition-all duration-200 text-white border border-white/20 hover:border-red-400/50 ${
              isRTL ? "flex-row-reverse gap-2" : "gap-2"
            }`}
            title="Sign out"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium">{t("navbar.logout")}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
