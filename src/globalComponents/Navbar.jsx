import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../src/assets/logo.png";
import profileImg from "../../src/assets/logom.png";
import Cookies from "js-cookie";

function Navbar() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-500   to-indigo-600 h-14 shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center h-full px-5">
        {/* Logo and Profile - RTL aware */}
        <div
          className={`flex items-center ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Link to="/" title="Repos">
            <img className="w-[60px]" src={logo} alt="PRM Logo" />
          </Link>
          <div className={`flex items-center ${isRTL ? "mr-4" : "ml-4"}`}>
            <img
              src={profileImg}
              width={85}
              className="rounded-full shadow-sm transition-all duration-300"
              alt="Logo"
            />
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center">
          {/* Change Language */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center mx-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-white border border-white/20 ${
              isRTL ? "space-x-reverse flex-row-reverse" : "space-x-2"
            }`}
            title={`Switch to ${i18n.language === "en" ? "Arabic" : "English"}`}
          >
            <span className="text-sm font-medium">
              {i18n.language === "en" ? "عربي" : "English"}
            </span>
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
          </button>

          {/* Logout */}
          <button
            onClick={logoutRequest}
            className={`flex items-center mx-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-white border border-white/20 ${
              isRTL ? "space-x-reverse flex-row-reverse" : "space-x-2"
            }`}
          >
            <span className="text-sm font-medium">Logout</span>
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
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
