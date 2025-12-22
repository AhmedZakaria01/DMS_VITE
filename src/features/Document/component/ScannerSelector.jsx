/* eslint-disable react/prop-types */

import  { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getScanners } from "../../../services/apiServices";

const ScannerSelector = ({ scannerId, onScannerChange }) => {
  const { t } = useTranslation();
  const [scanners, setScanners] = useState([]);

  // Fetch scanners on component mount
  useEffect(() => {
    const fetchScanners = async () => {
      try {
        const response = await getScanners();
        if (response.data) {
          setScanners(response.data);
          console.log("Scanners fetched successfully:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch scanners:", error);
        setScanners([]);
      }
    };

    fetchScanners();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
        {t("scanner") || "Scanner"}:
      </label>
      <select
        value={scannerId || ""}
        onChange={(e) => onScannerChange(e.target.value)}
        className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
      >
        <option value="" disabled className="text-sm">
          {t("selectScanner") || "Select Scanner"}
        </option>
        {scanners.length > 0 ? (
          scanners.map((scanner, index) => (
            <option key={index} value={scanner} className="text-sm">
              {scanner}
            </option>
          ))
        ) : (
          <option disabled className="text-sm text-gray-400">
            {t("noScannersAvailable") || "No scanners available"}
          </option>
        )}
      </select>
    </div>
  );
};

export default ScannerSelector;
