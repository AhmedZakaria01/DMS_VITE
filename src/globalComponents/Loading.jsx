/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

/**
 * Loading Component - A flexible, reusable loading spinner
 *
 * @param {string} variant - Display style: "inline", "banner", "fullscreen", "spinner-only", "card"
 * @param {string} size - Spinner size: "sm", "md", "lg", "xl"
 * @param {string} message - Custom loading message
 * @param {string} color - Color theme: "blue", "green", "gray", "white"
 * @param {string} className - Additional CSS classes
 *
 * @example
 * // Banner loading (for table updates)
 * <Loading variant="banner" message="Refreshing categories..." />
 *
 * @example
 * // Inline loading (for small sections)
 * <Loading variant="inline" size="sm" message="Loading children..." />
 *
 * @example
 * // Card loading (for empty states)
 * <Loading variant="card" size="lg" message="Loading categories..." />
 *
 * @example
 * // Fullscreen loading (for page loads)
 * <Loading variant="fullscreen" size="xl" message="Initializing application..." />
 *
 * @example
 * // Spinner only (for custom layouts)
 * <Loading variant="spinner-only" size="md" color="green" />
 */
const Loading = ({
  variant = "inline",
  size = "md",
  message,
  color = "blue",
  className = "",
}) => {
  const { t } = useTranslation();

  // Size configurations
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  // Color configurations
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    gray: "text-gray-600",
    white: "text-white",
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]}`;
  const defaultMessage = t("loading") || "Loading...";
  const displayMessage = message || defaultMessage;

  // Variant: Inline - Simple spinner with text (for small sections)
  if (variant === "inline") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <Loader2 className={`${spinnerClass} animate-spin`} />
        <span className={`text-sm font-medium ${colorClasses[color]}`}>
          {displayMessage}
        </span>
      </div>
    );
  }

  // Variant: Banner - Horizontal bar with spinner (for table updates)
  if (variant === "banner") {
    return (
      <div className={`px-6 py-3 bg-blue-50 border-b border-blue-100 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className={`h-5 w-5 text-blue-600 animate-spin`} />
          <span className="text-sm text-blue-700 font-medium">
            {displayMessage}
          </span>
        </div>
      </div>
    );
  }

  // Variant: Fullscreen - Centered overlay (for page loads)
  if (variant === "fullscreen") {
    return (
      <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
        <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 border border-gray-200">
          <Loader2 className={`${sizeClasses[size] || 'h-12 w-12'} text-blue-600 animate-spin`} />
          <p className="text-gray-700 font-medium text-lg">{displayMessage}</p>
        </div>
      </div>
    );
  }

  // Variant: Spinner Only - Just the animated spinner
  if (variant === "spinner-only") {
    return (
      <Loader2 className={`${spinnerClass} animate-spin ${className}`} />
    );
  }

  // Variant: Card - Centered in a card container (for empty states)
  if (variant === "card") {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}>
        <Loader2 className={`${spinnerClass} animate-spin`} />
        <p className={`${colorClasses[color]} font-medium`}>{displayMessage}</p>
      </div>
    );
  }

  // Default: return inline variant
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${spinnerClass} animate-spin`} />
      <span className={`text-sm font-medium ${colorClasses[color]}`}>
        {displayMessage}
      </span>
    </div>
  );
};

export default React.memo(Loading);
