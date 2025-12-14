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
  const canViewSearch = usePermission("screens.search.use");
  const canViewSettings = usePermission("screens.settings.view");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");

  // Icon mapping for each navigation item with colors
  const iconMap = {
    home: { emoji: "🏠", color: "text-blue-500" },
    users: { emoji: "👤", color: "text-purple-500" },
    roles: { emoji: "👥", color: "text-indigo-500" },
    auditTrail: { emoji: "📈", color: "text-green-500" },
    search: { emoji: "🔍", color: "text-amber-500" },
    fileCategory: { emoji: "📁", color: "text-orange-500" },
  };

  // Fixed navigation array with proper conditional rendering
  const navigation = [
    { name: t("home"), link: "/", iconKey: "home" },
    // Admin only items
    // ...(hasAdminRole(userRoles) ? [
    ...(canViewUser
      ? [{ name: t("users"), link: "/users", iconKey: "users" }]
      : []),
    ...(canViewRole
      ? [{ name: t("roles"), link: "/roles", iconKey: "roles" }]
      : []),
    // ] : []),
    // Conditionally include audit trail based on permission
    ...(canViewAudit
      ? [{ name: t("auditTrail"), link: "/audit", iconKey: "auditTrail" }]
      : []),
    ...(canViewSearch
      ? [
          {
            name: t("search"),
            link: "/search",
            iconKey: "search",
          },
        ]
      : []),

    ...(canViewFileCategory
      ? [
          {
            name: t("fileCategory"),
            link: "/category",
            iconKey: "fileCategory",
          },
        ]
      : []),
    //,
    // {
    //   name: t("docTypeForm"),
    //   link: "/docTypeForm",
    //   icon: "📋",
    // },
    //  ...(canViewSettings ?[{ name: t("settings"), link: "/settings", icon: "⚙️" }]:[]) ,
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
                      className="-m-2.5 p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">{t("close_sidebar")}</span>
                      <span className="text-2xl text-white">✕</span>
                    </button>
                  </div>
                </Transition.Child>
                {/* Mobile sidebar content - positioned below navbar */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 backdrop-blur-xl px-6 pb-4 shadow-2xl border-r border-white/20">
                  <div className="flex h-16 shrink-0 items-center pt-2">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                      <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <span
                      className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${
                        isRTL ? "mr-3" : "ml-3"
                      }`}
                    >
                      {t("menu")}
                    </span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-2">
                          {navigation.map((item) => {
                            const { emoji, bgColor } = iconMap[item.iconKey];
                            const isActive = activeNavItem === item.name;
                            return (
                              <li key={item.name}>
                                <Link
                                  to={item.link}
                                  onClick={handleNavClick}
                                  className={`w-full group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-300 ${
                                    isRTL ? "" : ""
                                  } ${
                                    isActive
                                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105"
                                      : "text-gray-700 hover:text-indigo-600 hover:bg-white/80 hover:shadow-md hover:scale-105"
                                  }`}
                                >
                                  <div
                                    className={`p-1.5 rounded-lg ${
                                      isActive ? "bg-white/20" : bgColor
                                    } transition-all duration-300`}
                                  >
                                    <span className="text-xl">{emoji}</span>
                                  </div>
                                  <span className="self-center">
                                    {item.name}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
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
        className={`hidden lg:fixed lg:top-20 lg:bottom-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          isRTL ? "lg:right-0" : "lg:left-0"
        } ${desktopSidebarExpanded ? "lg:w-72" : "lg:w-20"}`}
      >
        <div
          className={`flex grow flex-col gap-y-5 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100/50 backdrop-blur-xl px-3 pb-4 shadow-xl border border-gray-200/50 ${
            isRTL ? "border-l" : "border-r"
          }`}
        >
          {/* Toggle button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setDesktopSidebarExpanded(!desktopSidebarExpanded)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
              title={desktopSidebarExpanded ? t("collapse") : t("expand")}
            >
              <span className="text-xl font-bold">☰</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              <li>
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const { emoji, bgColor } = iconMap[item.iconKey];
                    const isActive = activeNavItem === item.name;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.link}
                          onClick={handleNavClick}
                          className={`relative group flex items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-300 ${
                            isRTL ? "text-right" : ""
                          } ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-white hover:shadow-md hover:scale-105"
                          } ${!desktopSidebarExpanded ? "justify-center" : ""}`}
                          title={!desktopSidebarExpanded ? item.name : ""}
                        >
                          {/* Active indicator bar */}
                          {isActive && (
                            <span
                              className={`absolute top-0 bottom-0 w-1 bg-white rounded-r-full ${
                                isRTL ? "right-0" : "left-0"
                              }`}
                            />
                          )}
                          <div
                            className={`p-1.5 rounded-lg ${
                              isActive ? "bg-white/20" : bgColor
                            } transition-all duration-300 group-hover:scale-110`}
                          >
                            <span className="text-xl">{emoji}</span>
                          </div>
                          {desktopSidebarExpanded && (
                            <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                              {item.name}
                            </span>
                          )}
                          {/* Tooltip for collapsed state */}
                          {!desktopSidebarExpanded && (
                            <div
                              className={`absolute ${
                                isRTL ? "right-full mr-2" : "left-full ml-2"
                              } px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl`}
                            >
                              {item.name}
                              <div
                                className={`absolute top-1/2 -translate-y-1/2 ${
                                  isRTL
                                    ? "left-full border-l-gray-900 border-l-4 border-y-transparent border-y-4 border-r-0"
                                    : "right-full border-r-gray-900 border-r-4 border-y-transparent border-y-4 border-l-0"
                                }`}
                              />
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
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
          className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">{t("open_sidebar")}</span>
          <span className="text-xl">☰</span>
        </button>
      </div>
    </>
  );
}
