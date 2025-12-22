/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { scan } from "../../../services/apiServices";

const ScanButton = ({
  categoryId,
  categoryName,
  scannerId,
  documentTypeId,
  isUploading,
  onScanComplete,
}) => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [outputType, setOutputType] = useState("PDF"); // PDF or IMAGE

  // Handle scan operation
  const handleScan = async (e) => {
    e.stopPropagation();

    if (!scannerId) {
      alert(t("selectScannerFirst") || "Please select a scanner first");
      return;
    }

    setIsScanning(true);
    try {
      // Get the project root from environment variable
      const projectRoot = import.meta.env.VITE_PROJECT_ROOT;

      // Construct the full output path: <project_root>\public\Scanner
      const outputFolder = `${projectRoot}\\public\\Scanner`;

      const scanData = {
        scannerName: scannerId,
        outputFolder: outputFolder,
        outputType: outputType, // Use selected output type (PDF or IMAGE)
        scanSubFolderName: categoryName,
      };

      console.log("🔵 Initiating scan with data:", scanData);
      const response = await scan(scanData);
      console.log("🔵 Scan completed successfully:", response);
      console.log("🔵 Scan response.data:", response.data);

      // Process scanned files and trigger upload
      if (response.data && onScanComplete) {
        const filePaths = response.data; // Array of file paths from scan API
        console.log("🔵 Scanned file paths:", filePaths);
        console.log("🔵 Calling onScanComplete with:", {
          categoryId,
          categoryName,
          filePaths,
        });

        // Call onScanComplete with the file paths
        // This will trigger handleScanComplete in DocumentCategoryTable
        // which will fetch each file and dispatch upload_File
        onScanComplete(categoryId, categoryName, filePaths);
        console.log("🔵 onScanComplete called successfully");
      } else {
        console.error("🔴 onScanComplete not called. response.data:", response.data, "onScanComplete:", onScanComplete);
      }

      alert(
        t("scanSuccess") ||
          `Scan completed successfully for ${categoryName}! Files saved to Scanner folder.`
      );
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setIsScanning(false);
    }
  };


  return (
    <div className="relative inline-block">
      {/* Main Scan Button with integrated dropdown */}
      <button
        onClick={handleScan}
        disabled={!documentTypeId || isUploading || !scannerId || isScanning}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg   transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 pr-2"
        title={
          !scannerId
            ? t("selectScannerFirst") || "Please select a scanner first"
            : !documentTypeId
            ? t("selectDocTypeFirst") || "Please select a document type first"
            : isScanning
            ? t("scanning") || "Scanning..."
            : `Scan to ${categoryName} as ${outputType}`
        }
      >
        {isScanning ? (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
        <span className="text-sm">
          {isScanning ? t("scanning") || "Scanning..." : t("scan") || "Scan"}
        </span>

        {/* Divider */}
        <div className="h-6 w-px bg-purple-500 mx-1"></div>

        {/* Output Type Selector - Compact */}
        <div className="relative flex items-center">
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            disabled={!documentTypeId || isUploading || !scannerId || isScanning}
            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none pr-5"
            title={t("selectOutputType") || "Select output type"}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="PDF" className="text-black">
              PDF
            </option>
            <option value="IMAGE" className="text-black">
              IMG
            </option>
          </select>
          <ChevronDown className="w-5 h-5 text-white absolute right-0 pointer-events-none" />
        </div>
      </button>
    </div>
  );
};

export default ScanButton;
