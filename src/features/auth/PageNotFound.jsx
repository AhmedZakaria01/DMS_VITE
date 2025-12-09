import { Link } from "react-router-dom";
import pageNotFoundImage from "../../../src/assets/page_not_found.png";
import { useTranslation } from "react-i18next";

function PageNotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center px-6">
      <div className=" w-full">
        <div>
          {/* Image Section */}
          <div>
            <img
              src={pageNotFoundImage}
              className="w-full vh-100"
              alt={t("pageNotFound")}
            />
          </div>
        </div>
      </div>
      <div className="absolute top-5 left-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("Back To Home")}
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
