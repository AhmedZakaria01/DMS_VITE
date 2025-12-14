/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Image,
  File,
} from "lucide-react";

const FilePreviewTab = ({
  currentPreviewFile,
  currentCategoryId,
  previewFiles,
  onBackToFiles,
  onSetRightPanelTab,
}) => {
  const { t } = useTranslation();

  // Get file icon based on file type
  const getFileIcon = (file) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <Image className="w-5 h-5 text-green-600" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else if (fileType.includes("document") || fileType.includes("word")) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else if (fileType.includes("sheet") || fileType.includes("excel")) {
      return <FileText className="w-5 h-5 text-green-600" />;
    } else {
      return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Download file
  const handleDownloadFile = (fileData) => {
    const link = document.createElement("a");
    link.href = fileData.url;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {currentPreviewFile && currentCategoryId ? (
        <>
          {/* Preview Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={onBackToFiles}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t("backToFiles") || "Back to Files"}</span>
              </button>
              <h3 className="text-lg font-bold text-gray-900">
                {t("filePreview") || "File Preview"}
              </h3>
            </div>

            <div className="flex items-start gap-3">
              {getFileIcon(currentPreviewFile)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentPreviewFile.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {previewFiles[currentCategoryId]?.categoryName}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{formatFileSize(currentPreviewFile.size)}</span>
                  <span>•</span>
                  <span>{currentPreviewFile.type}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleDownloadFile(currentPreviewFile)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>{t("download") || "Download"}</span>
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            {currentPreviewFile.type.startsWith("image/") ? (
              <div className="flex justify-center items-start h-full">
                <img
                  src={currentPreviewFile.url}
                  alt={currentPreviewFile.name}
                  className="max-w-full h-auto rounded shadow-lg"
                />
              </div>
            ) : currentPreviewFile.type === "application/pdf" ? (
              <div className="h-full">
                <embed
                  src={currentPreviewFile.url}
                  type="application/pdf"
                  className="w-full h-full min-h-[500px] rounded shadow-lg border border-gray-200"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-lg shadow p-6">
                <FileText className="w-16 h-16 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  {t("previewNotAvailable") || "Preview Not Available"}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {t("previewNotAvailableDesc") ||
                    "This file type cannot be previewed. Please download to view."}
                </p>
                <div className="text-xs text-gray-600 space-y-1 text-left bg-gray-50 p-3 rounded">
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {currentPreviewFile.type}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span>{" "}
                    {formatFileSize(currentPreviewFile.size)}
                  </p>
                  <p>
                    <span className="font-medium">Modified:</span>{" "}
                    {new Date(
                      currentPreviewFile.lastModified
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
            <div className="text-xs text-gray-600">
              <p>
                <span className="font-medium">
                  {t("lastModified") || "Last Modified"}:
                </span>{" "}
                {new Date(currentPreviewFile.lastModified).toLocaleDateString()}{" "}
                at{" "}
                {new Date(currentPreviewFile.lastModified).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </>
      ) : (
        // No file selected for preview
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <Eye className="w-20 h-20 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t("noFileSelected") || "No File Selected"}
          </h3>
          <p className="text-gray-500 mb-4">
            {t("selectFileToPreview") ||
              "Select a file from the files tab to preview"}
          </p>
          <button
            onClick={() => onSetRightPanelTab("files")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("goToFiles") || "Go to Files"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePreviewTab;
