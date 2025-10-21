import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Navbar from "./globalComponents/Navbar";
import Sidebar from "./globalComponents/Sidebar/Sidebar";
import Breadcrumbs from "./globalComponents/Breadcrumbs";
  
function Layout() {
  const { t, i18n } = useTranslation();
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(false);
  const isRTL = i18n.language === "ar";

  // Essential useEffect for RTL/LTR document direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    document.body.className = isRTL ? "rtl" : "ltr";
  }, [i18n.language, isRTL]);

  return (
    <>
      <Navbar />
      <Sidebar
        desktopSidebarExpanded={desktopSidebarExpanded}
        setDesktopSidebarExpanded={setDesktopSidebarExpanded}
      />

      {/* Main content - RTL/LTR aware sidebar positioning */}
      <main
        className={`pt-20 transition-all duration-300 w-[90%] mx-auto ${
          desktopSidebarExpanded
            ? isRTL
              ? "lg:pr-72"
              : "lg:pl-72"
            : isRTL
            ? "lg:pr-16"
            : "lg:pl-16"
        }`}
      >
        <div className="p-4">
          {/* Add breadcrumbs here */}
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Layout;
