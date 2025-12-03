/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { hasAdminRole } from "../../features/auth/roleUtils";
import { useSelector } from "react-redux";
import usePermission from "../../features/auth/usePermission";

export default function Sidebar({
  desktopSidebarExpanded,
  setDesktopSidebarExpanded,
}) {
  // check admin or user
  const { user } = useSelector((state) => state.authReducer);
  const userRoles = user?.roles || [];

  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const canViewAudit = usePermission("screens.auditlog.view");
  const canViewFileCategory = usePermission("screens.categories.view");
  const canViewRole = usePermission("screens.roles.view");
  const canViewUser = usePermission("screens.users.view");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");

  // Fixed navigation array with proper conditional rendering
  const navigation = [
    { name: t("home"), link: "/", icon: "🏠" },
    // Admin only items
    // ...(hasAdminRole(userRoles) ? [
    ...(canViewUser ? [{ name: t("users"), link: "/users", icon: "🙍‍♂️" }] : []),
    ...(canViewRole ? [{ name: t("roles"), link: "/roles", icon: "👥" }] : []),
    // ] : []),
    // Conditionally include audit trail based on permission
    ...(canViewAudit
      ? [{ name: t("auditTrail"), link: "/audit", icon: "📈" }]
      : []),
    {
      name: t("search"),
      link: "/search",
      icon: "🔍",
    },

    ...(canViewFileCategory
      ? [
          {
            name: t("fileCategory"),
            link: "/category",
            icon: "📁",
          },
        ]
      : [])
      //,
    // {
    //   name: t("docTypeForm"),
    //   link: "/docTypeForm",
    //   icon: "📋",
    // },
    // { name: t("settings"), link: "/settings", icon: "⚙️" },
  ];

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom={isRTL ? "translate-x-full" : "-translate-x-full"}
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo={isRTL ? "translate-x-full" : "-translate-x-full"}
            >
              <Dialog.Panel
                className={`relative flex w-full max-w-xs flex-1 ${
                  isRTL ? "ml-16" : "mr-16"
                }`}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className={`absolute top-0 flex w-16 justify-center pt-5 ${
                      isRTL ? "right-full" : "left-full"
                    }`}
                  >
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">{t("close_sidebar")}</span>
                      <div className="h-6 w-6 text-white">✕</div>
                    </button>
                  </div>
                </Transition.Child>
                {/* Mobile sidebar content - positioned below navbar */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6 pb-4 shadow-xl ">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <span
                      className={`text-xl font-semibold text-gray-900 ${
                        isRTL ? "mr-3" : "ml-3"
                      }`}
                    >
                      {t("menu")}
                    </span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.link}
                                onClick={handleNavClick}
                                className={`w-full group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200 ${
                                  isRTL ? "" : ""
                                } ${
                                  activeNavItem === item.name
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop sidebar - RTL/LTR positioning */}
      <div
        className={`hidden lg:fixed lg:top-20 lg:bottom-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
          isRTL ? "lg:right-0" : "lg:left-0"
        } ${desktopSidebarExpanded ? "lg:w-72" : "lg:w-16"}`}
      >
        <div
          className={`flex grow flex-col gap-y-5 overflow-hidden border-gray-200 bg-gradient-to-b from-slate-100 via-blue-50 to-slate-200 px-3 pb-4 ${
            isRTL ? "border-l" : "border-r"
          }`}
        >
          {/* <div
          className={`flex grow flex-col gap-y-5 overflow-hidden border-gray-200 bg-gradient-to-b from-indigo-50 via-slate-200 to-indigo-400 px-3 pb-4 ${
            isRTL ? "border-l" : "border-r"
          }`}
        > */}
          {/* Brand/Logo section */}
          {/* <div className="flex h-12 shrink-0 items-center justify-center mt-4">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">DMS</span>
            </div>
          </div> */}
          {/* Toggle button */}
          <div className="flex justify-center">
            <button
              onClick={() => setDesktopSidebarExpanded(!desktopSidebarExpanded)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
            >
              <div className="h-5 w-5 font-bold">☰</div>
            </button>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.link}
                        onClick={handleNavClick}
                        className={`w-full group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                          isRTL ? "text-right" : ""
                        } ${
                          activeNavItem === item.name
                            ? "bg-gradient-to-r from-indigo-300 to-purple-200 text-black shadow-lg"
                            : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-400 hover:to-slate-500 hover:shadow-md"
                        } ${!desktopSidebarExpanded ? "justify-center" : ""}`}
                        title={!desktopSidebarExpanded ? item.name : ""}
                      >
                        <span className="text-lg shrink-0">{item.icon}</span>
                        {desktopSidebarExpanded && (
                          <span className="whitespace-nowrap">{item.name}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile toggle button - RTL/LTR positioning */}
      <div
        className={`lg:hidden fixed top-24 z-30 ${
          isRTL ? "right-2" : "left-2"
        }`}
      >
        <button
          type="button"
          className="p-2 rounded-md bg-gradient-to-r from-white to-gray-50 shadow-lg text-gray-700 hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">{t("open_sidebar")}</span>
          <div className="h-5 w-5 font-bold">☰</div>
        </button>
      </div>
    </>
  );
}
