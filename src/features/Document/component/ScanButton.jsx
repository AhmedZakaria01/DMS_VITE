/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import { scan } from "../../../services/apiServices";

const ScanButton = ({
  categoryId,
  categoryName,
  scannerId,
  documentTypeId,
  isUploading,
}) => {
  const { t } = useTranslation();

  // Handle scan operation
  const handleScan = async (e) => {
    e.stopPropagation();

    if (!scannerId) {
      alert(t("selectScannerFirst") || "Please select a scanner first");
      return;
    }

    try {
      // Get the project root from environment variable
      const projectRoot = import.meta.env.VITE_PROJECT_ROOT;

      // Construct the full output path: <project_root>\public\Scanner
      const outputFolder = `${projectRoot}\\public\\Scanner`;

      const scanData = {
        scannerName: scannerId,
        outputFolder: outputFolder,
        outputType: "PDF",
        scanSubFolderName: categoryName,
      };

      console.log("Initiating scan with data:", scanData);
      const response = await scan(scanData);
      console.log("Scan completed successfully:", response);

      alert(
        t("scanSuccess") ||
          `Scan completed successfully for ${categoryName}! Files saved to Scanner folder.`
      );
    } catch (error) {
      console.error("Scan failed:", error);
      alert(
        t("scanFailed") ||
          `Scan failed: ${error.message || "Unknown error occurred"}`
      );
    }
  };

  return (
    <button
      onClick={handleScan}
      disabled={!documentTypeId || isUploading || !scannerId}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      title={
        !scannerId
          ? t("selectScannerFirst") || "Please select a scanner first"
          : !documentTypeId
          ? t("selectDocTypeFirst") || "Please select a document type first"
          : `Scan to ${categoryName}`
      }
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-sm">{t("scan") || "Scan"}</span>
    </button>
  );
};

export default ScanButton;
