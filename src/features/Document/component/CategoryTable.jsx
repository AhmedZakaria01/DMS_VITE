/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Folder,
  FolderOpen,
  Upload,
  X,
  Eye,
  FileText,
  Image,
  File,
  ArrowLeft,
  Download,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { setCategoryName } from "../../Category/categorySlice";

const CategoryTable = ({
  currentDocTypeId,
  currentParentCategoryId,
  onDocumentTypeChange,
  onCategoryUpdate,
  initialCategories,
}) => {
  const { t } = useTranslation();

  // Static data
  const staticDocumentTypes = [
    { id: 1, name: "Invoices" },
    { id: 2, name: "Contracts" },
    { id: 3, name: "Employee Records" },
    { id: 4, name: "Technical Documentation" },
  ];

  const staticScanners = [
    { id: 1, name: "HP ScanJet Pro 3000" },
    { id: 2, name: "Canon imageFORMULA DR-C225" },
    { id: 3, name: "Epson WorkForce ES-500W" },
    { id: 4, name: "Fujitsu ScanSnap iX1600" },
    { id: 5, name: "Brother ADS-2700W" },
  ];

  const staticCategories = [
    {
      id: 1,
      name: "Finance Categories",
      documentTypeId: 1,
      parentId: null,
      children: [
        {
          id: 11,
          name: "Vendor Invoices",
          documentTypeId: 1,
          parentId: 1,
          children: [
            {
              id: 111,
              name: "International Vendors",
              documentTypeId: 1,
              parentId: 11,
              children: [],
            },
            {
              id: 112,
              name: "Local Vendors",
              documentTypeId: 1,
              parentId: 11,
              children: [],
            },
          ],
        },
        {
          id: 12,
          name: "Customer Invoices",
          documentTypeId: 1,
          parentId: 1,
          children: [
            {
              id: 121,
              name: "Corporate Clients",
              documentTypeId: 1,
              parentId: 12,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Legal Categories",
      documentTypeId: 2,
      parentId: null,
      children: [
        {
          id: 21,
          name: "Employment Contracts",
          documentTypeId: 2,
          parentId: 2,
          children: [],
        },
        {
          id: 22,
          name: "Vendor Agreements",
          documentTypeId: 2,
          parentId: 2,
          children: [],
        },
      ],
    },
    {
      id: 3,
      name: "HR Categories",
      documentTypeId: 3,
      parentId: null,
      children: [
        {
          id: 31,
          name: "Employee Files",
          documentTypeId: 3,
          parentId: 3,
          children: [
            {
              id: 311,
              name: "Onboarding Documents",
              documentTypeId: 3,
              parentId: 31,
              children: [],
            },
          ],
        },
      ],
    },
  ];

  // Local state
  const [documentTypeId, setDocumentTypeId] = useState(
    currentDocTypeId || null
  );
  const [scannerId, setScannerId] = useState(null);
  const [parentCategories, setParentCategories] = useState(
    initialCategories || []
  );
  const [childrenByParentId, setChildrenByParentId] = useState({});
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [newCategoryName, setNewCategoryName] = useState({});
  const [loading, setLoading] = useState(false);
  const [childLoading, setChildLoading] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState({});
  const [previewFiles, setPreviewFiles] = useState({});

  // Right panel state - tabs for files and preview
  const [rightPanelTab, setRightPanelTab] = useState("files"); // 'files' or 'preview'
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // Update when props change
  useEffect(() => {
    if (currentDocTypeId) {
      setDocumentTypeId(currentDocTypeId);
    }
  }, [currentDocTypeId]);

  useEffect(() => {
    if (initialCategories) {
      setParentCategories(initialCategories);
    }
  }, [initialCategories]);

  // Handle document type selection
  const handleDocumentTypeChange = (selectedDocTypeId) => {
    const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
    setDocumentTypeId(docTypeId);

    // Clear previous data when changing document type
    setExpanded({});
    setShowAddForm({});
    setNewCategoryName({});
    setChildrenByParentId({});
    setPreviewFiles({});
    setRightPanelTab("files");
    setCurrentPreviewFile(null);
    setCurrentCategoryId(null);

    if (docTypeId) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filteredCategories = staticCategories.filter(
          (category) => category.documentTypeId === docTypeId
        );
        setParentCategories(filteredCategories);
        setLoading(false);

        // Call parent callback if provided
        if (onDocumentTypeChange) {
          onDocumentTypeChange(docTypeId);
        }
      }, 500);
    } else {
      setParentCategories([]);
    }
  };

  // Handle scanner selection
  const handleScannerChange = (selectedScannerId) => {
    const scanId = selectedScannerId ? parseInt(selectedScannerId) : null;
    setScannerId(scanId);
    console.log("Scanner selected:", scanId);
    // You can add more logic here when a scanner is selected
  };

  // Toggle Expand and fetch children if needed
  const toggleExpand = (item, level = 0) => {
    const { id } = item;
    const isCurrentlyExpanded = expanded[id];

    const collapseChildren = (parentId) => {
      const children = childrenByParentId[parentId] || [];
      children.forEach((child) => {
        collapseChildren(child.id);
      });
    };

    if (!isCurrentlyExpanded) {
      // For level 0 (parent categories): Close all other categories (accordion behavior)
      if (level === 0) {
        const collapseAll = () => {
          Object.keys(expanded).forEach((categoryId) => {
            if (expanded[categoryId]) {
              const categoryIdNum = parseInt(categoryId);
              const children = childrenByParentId[categoryIdNum] || [];
              children.forEach((child) => {
                collapseChildren(child.id);
              });
            }
          });
          setExpanded({});
        };
        collapseAll();
      }

      // Simulate fetching children with delay
      if (!childrenByParentId[id]) {
        setChildLoading((prev) => ({ ...prev, [id]: true }));

        setTimeout(() => {
          // Find the category in our static data and get its children
          const findCategoryChildren = (categories, targetId) => {
            for (const category of categories) {
              if (category.id === targetId) {
                return category.children || [];
              }
              if (category.children && category.children.length > 0) {
                const found = findCategoryChildren(category.children, targetId);
                if (found) return found;
              }
            }
            return [];
          };

          const children = findCategoryChildren(staticCategories, id);
          setChildrenByParentId((prev) => ({ ...prev, [id]: children }));
          setChildLoading((prev) => ({ ...prev, [id]: false }));
        }, 300);
      }

      // Expand this category
      if (level === 0) {
        setExpanded({ [id]: true });
      } else {
        setExpanded((prev) => ({ ...prev, [id]: true }));
      }
    } else {
      // When collapsing, recursively collapse all nested children
      collapseChildren(id);
      setExpanded((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Toggle Add Input
  const toggleAddForm = (categoryId) => {
    if (!documentTypeId) {
      alert(
        t("pleaseSelectDocTypeFirst") || "Please select a document type first"
      );
      return;
    }

    // Close all other forms first
    const newShowAddForm = Object.keys(showAddForm).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    // Toggle the current form
    setShowAddForm({
      ...newShowAddForm,
      [categoryId]: !showAddForm[categoryId],
    });

    // Reset the input for the current category
    setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
  };

  const handleAddCategory = (parentCategoryId = null) => {
    const categoryName = newCategoryName[parentCategoryId || "root"];

    if (!categoryName?.trim()) {
      alert(t("pleaseEnterCategoryName") || "Please enter a category name");
      return;
    }

    if (!documentTypeId) {
      alert(
        t("pleaseSelectDocTypeFirst") || "Please select a document type first"
      );
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    // Simulate API call
    setTimeout(() => {
      const newCategory = {
        id: Date.now(), // Generate unique ID
        name: categoryName.trim(),
        documentTypeId: documentTypeId,
        parentId: parentCategoryId,
        children: [],
      };

      // Update the appropriate state based on whether it's a root or child category
      if (parentCategoryId === null) {
        // Add to root categories
        const updatedCategories = [...parentCategories, newCategory];
        setParentCategories(updatedCategories);

        // Call parent callback if provided
        if (onCategoryUpdate) {
          onCategoryUpdate(updatedCategories);
        }
      } else {
        // Add to children
        const updatedChildren = {
          ...childrenByParentId,
          [parentCategoryId]: [
            ...(childrenByParentId[parentCategoryId] || []),
            newCategory,
          ],
        };
        setChildrenByParentId(updatedChildren);
      }

      setCreateLoading(false);
      setShowAddForm({});
      setNewCategoryName({});

      console.log("Category created:", newCategory);
      alert(
        t("categoryCreatedSuccessAlert", { categoryName }) ||
          `Category "${categoryName}" created successfully!`
      );
    }, 1000);
  };

  const handleInputChange = (categoryId, value) => {
    // setNewCategoryName(prev => ({ ...prev, [categoryId]: value }));
    setCategoryName(value);
  };

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

  // Handle file selection
  const handleFileSelect = (categoryId, categoryName) => {
    if (!documentTypeId) {
      alert(
        t("pleaseSelectDocTypeFirst") || "Please select a document type first"
      );
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";

    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      // Store files with metadata
      const filesWithMetadata = files.map((file) => ({
        file: file,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file), // Create object URL for preview
      }));

      // Store files for this category
      setPreviewFiles((prev) => ({
        ...prev,
        [categoryId]: {
          files: filesWithMetadata,
          categoryName,
        },
      }));

      console.log(
        `Files selected for category ${categoryId}:`,
        filesWithMetadata
      );
    };

    fileInput.click();
  };

  // Handle file upload after preview
  const handleUploadConfirmed = (categoryId) => {
    const previewData = previewFiles[categoryId];
    if (!previewData || previewData.files.length === 0) return;

    setUploadLoading((prev) => ({ ...prev, [categoryId]: true }));

    // Simulate file upload process
    setTimeout(() => {
      setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));

      // Show success message
      alert(
        t("filesUploadedSuccess", {
          count: previewData.files.length,
          category: previewData.categoryName,
        }) ||
          `Successfully uploaded ${previewData.files.length} file(s) to "${previewData.categoryName}"`
      );

      console.log(
        `Uploaded ${previewData.files.length} file(s) to category ${categoryId}:`,
        previewData.files
      );

      // Clean up object URLs
      previewData.files.forEach((fileData) => {
        if (fileData.url) {
          URL.revokeObjectURL(fileData.url);
        }
      });

      // Clear preview after upload
      setPreviewFiles((prev) => {
        const newPreviewFiles = { ...prev };
        delete newPreviewFiles[categoryId];
        return newPreviewFiles;
      });
    }, 1500);
  };

  // Cancel file upload
  const handleCancelUpload = (categoryId) => {
    const previewData = previewFiles[categoryId];

    // Clean up object URLs
    if (previewData && previewData.files) {
      previewData.files.forEach((fileData) => {
        if (fileData.url) {
          URL.revokeObjectURL(fileData.url);
        }
      });
    }

    setPreviewFiles((prev) => {
      const newPreviewFiles = { ...prev };
      delete newPreviewFiles[categoryId];
      return newPreviewFiles;
    });
  };

  // Remove individual file from preview
  const handleRemoveFile = (categoryId, fileIndex) => {
    setPreviewFiles((prev) => {
      const previewData = prev[categoryId];
      if (!previewData) return prev;

      const updatedFiles = [...previewData.files];
      const removedFile = updatedFiles[fileIndex];

      // Clean up object URL
      if (removedFile.url) {
        URL.revokeObjectURL(removedFile.url);
      }

      updatedFiles.splice(fileIndex, 1);

      if (updatedFiles.length === 0) {
        const newPreviewFiles = { ...prev };
        delete newPreviewFiles[categoryId];
        return newPreviewFiles;
      }

      return {
        ...prev,
        [categoryId]: {
          ...previewData,
          files: updatedFiles,
        },
      };
    });
  };

  // Show individual file preview - switch to preview tab
  const handleShowFilePreview = (categoryId, fileData) => {
    setCurrentPreviewFile(fileData);
    setCurrentCategoryId(categoryId);
    setRightPanelTab("preview");
  };

  // Go back to files tab
  const handleBackToFiles = () => {
    setRightPanelTab("files");
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

  // Render Right Panel with Tabs (Files and Preview)
  const renderRightPanel = () => {
    if (!hasAnyFiles) return null;

    return (
      <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
        {/* Tabs Header */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex">
            <button
              onClick={() => setRightPanelTab("files")}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                rightPanelTab === "files"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{t("files") || "Files"}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {totalFilesCount}
                </span>
              </div>
            </button>
            <button
              onClick={() => setRightPanelTab("preview")}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                rightPanelTab === "preview"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{t("preview") || "Preview"}</span>
                {currentPreviewFile && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    1
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {rightPanelTab === "files" ? (
            // Files Tab Content
            <div className="h-full overflow-y-auto bg-gray-50">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("uploadedFiles") || "Uploaded Files"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {totalFilesCount} {t("filesSelected") || "file(s) selected"}
                </p>
              </div>

              <div className="p-4 space-y-6">
                {Object.entries(previewFiles).map(
                  ([categoryId, previewData]) => (
                    <div
                      key={categoryId}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      {/* Category Header */}
                      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Folder className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">
                              {previewData.categoryName}
                            </h4>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {previewData.files.length}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCancelUpload(categoryId)}
                            disabled={uploadLoading[categoryId]}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title={t("clearFiles") || "Clear files"}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Files List */}
                      <div className="p-3 space-y-2">
                        {previewData.files.map((fileData, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {getFileIcon(fileData)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {fileData.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(fileData.size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleShowFilePreview(categoryId, fileData)
                                }
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title={t("previewFile") || "Preview file"}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveFile(categoryId, index)
                                }
                                disabled={uploadLoading[categoryId]}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title={t("removeFile") || "Remove file"}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center gap-2">
                        <button
                          onClick={() => handleUploadConfirmed(categoryId)}
                          disabled={uploadLoading[categoryId]}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          {uploadLoading[categoryId] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>{t("uploading") || "Uploading..."}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>{t("Save") || "Saved"}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCancelUpload(categoryId)}
                          disabled={uploadLoading[categoryId]}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {t("cancel") || "Cancel"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            // Preview Tab Content
            <div className="h-full flex flex-col bg-white">
              {currentPreviewFile && currentCategoryId ? (
                <>
                  {/* Preview Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={handleBackToFiles}
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
                            "Preview is not available for this file type"}
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
                        <span className="font-medium">Last modified:</span>{" "}
                        {new Date(
                          currentPreviewFile.lastModified
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          currentPreviewFile.lastModified
                        ).toLocaleTimeString()}
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
                      "Click the preview button on any file to view it here"}
                  </p>
                  <button
                    onClick={() => setRightPanelTab("files")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t("goToFiles") || "Go to Files"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render file list for a category in table tab
  // This function is no longer needed as files are displayed in the right panel
  const renderCategoryFilesList = (categoryId) => {
    // Files are now shown in the right panel, not under categories
    return null;
  };

  const renderAddForm = (categoryId) => {
    if (!showAddForm[categoryId]) return null;

    return (
      <tr className="bg-gray-50">
        <td colSpan={3} className="px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newCategoryName[categoryId] || ""}
              onChange={(e) => handleInputChange(categoryId, e.target.value)}
              placeholder={t("enterCategoryName") || "Enter category name"}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddCategory(categoryId === "root" ? null : categoryId);
                }
              }}
              autoFocus
            />
            <button
              onClick={() =>
                handleAddCategory(categoryId === "root" ? null : categoryId)
              }
              disabled={createLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">
                {createLoading ? t("adding") || "Adding..." : t("add") || "Add"}
              </span>
            </button>
            <button
              onClick={() => toggleAddForm(categoryId)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <span className="text-sm">{t("cancel") || "Cancel"}</span>
            </button>
          </div>
          {createError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{createError}</span>
              </div>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const renderRows = (items, level = 0) => {
    return items.flatMap((item) => {
      const id = item.id;
      const children = childrenByParentId[id] || [];
      const hasChildren = children.length > 0;
      const isOpen = expanded[id];
      const isLoadingChildren = childLoading[id];
      const hasBeenFetched = Object.prototype.hasOwnProperty.call(
        childrenByParentId,
        id
      );
      const isUploading = uploadLoading[id];
      const hasFiles = previewFiles[id];

      // Check if this category has children in static data
      const findHasChildren = (categories, targetId) => {
        for (const category of categories) {
          if (category.id === targetId) {
            return category.children && category.children.length > 0;
          }
          if (category.children && category.children.length > 0) {
            const found = findHasChildren(category.children, targetId);
            if (found !== null) return found;
          }
        }
        return null;
      };

      const categoryHasChildren =
        findHasChildren(staticCategories, id) || hasChildren;

      const rows = [
        <tr
          key={id}
          className={`transition-all duration-200 ${
            level === 0 ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white"
          } hover:bg-gray-50`}
        >
          <td className="py-4 px-6 whitespace-nowrap text-gray-700" colSpan={2}>
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              style={{ paddingLeft: `${level * 24}px` }}
              onClick={() => toggleExpand(item, level)}
            >
              {/* Chevron Arrow - only show for categories with children */}
              {categoryHasChildren ? (
                isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )
              ) : (
                <div className="w-4 h-4 flex-shrink-0" />
              )}

              {/* Folder Icon */}
              {isOpen ? (
                <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              ) : (
                <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}

              <span className="font-medium text-sm">{item.name}</span>

              {hasFiles && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {previewFiles[id].files.length} files
                </span>
              )}

              {isLoadingChildren && (
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                  <span className="text-xs">
                    {t("loading") || "Loading..."}
                  </span>
                </div>
              )}
            </div>
          </td>
          <td className="py-4 px-6 whitespace-nowrap text-right">
            <div className="flex items-center gap-2 justify-end">
              {/* Scan Button - Always visible but disabled when no scanner selected */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(
                    `Scan initiated for category ${id} with scanner ${scannerId}`
                  );
                  alert(
                    t("scanInitiated") || `Scan initiated for "${item.name}"`
                  );
                }}
                disabled={!documentTypeId || isUploading || !scannerId}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={
                  !scannerId
                    ? t("selectScannerFirst") || "Select scanner first"
                    : !documentTypeId
                    ? t("selectDocTypeFirst") || "Select document type first"
                    : t("scanToCategory", { category: item.name }) ||
                      `Scan to ${item.name}`
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

              {/* Upload Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileSelect(id, item.name);
                }}
                disabled={!documentTypeId || isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={
                  !documentTypeId
                    ? t("selectDocTypeFirst") || "Select document type first"
                    : t("uploadFilesToCategory", { category: item.name }) ||
                      `Upload files to ${item.name}`
                }
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">
                  {t("uploadFiles") || "Upload Files"}
                </span>
              </button>
            </div>
          </td>
        </tr>,
      ];

      // Add form row if shown
      if (showAddForm[id]) {
        rows.push(renderAddForm(id));
      }

      // Add children rows if expanded
      if (isOpen) {
        if (isLoadingChildren) {
          rows.push(
            <tr key={`loading-${id}`} className="bg-gray-50">
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                <div
                  className="flex items-center justify-center gap-2"
                  style={{ paddingLeft: `${(level + 1) * 24}px` }}
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">
                    {t("loadingChildren") || "Loading children..."}
                  </span>
                </div>
              </td>
            </tr>
          );
        } else if (hasChildren) {
          rows.push(...renderRows(children, level + 1));
        } else if (hasBeenFetched) {
          rows.push(
            <tr key={`empty-${id}`} className="bg-gray-50">
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
                  <span className="text-sm">
                    {t("noChildCategories") || "No child categories found"}
                  </span>
                </div>
              </td>
            </tr>
          );
        }
      }

      return rows;
    });
  };

  const renderEmptyState = () => {
    if (!documentTypeId) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Folder className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("noDocTypeSelected") || "No Document Type Selected"}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("selectDocTypeFromDropdown") ||
              "Please select a document type from the dropdown above to view categories"}
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <Folder className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("noCategoriesFound") || "No Categories Found"}
        </h3>
        <p className="text-gray-500 mb-6">
          {t("getStartedCreating") ||
            "Get started by creating your first category"}
        </p>
        <button
          onClick={() => toggleAddForm("root")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base">
            {t("createFirstCategory") || "Create First Category"}
          </span>
        </button>
      </div>
    );
  };

  // Loading state
  if (loading && documentTypeId) {
    return (
      <section className="">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("categories") || "Categories"}
            </h2>
          </div>
          <div className="px-6 py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {t("loadingCategories") || "Loading categories..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Check if there are any files uploaded
  const hasAnyFiles = Object.keys(previewFiles).length > 0;
  const totalFilesCount = Object.values(previewFiles).reduce(
    (sum, data) => sum + data.files.length,
    0
  );

  return (
    <>
      <section className="">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Document Type Selector */}
          <div className="px-2 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("categories") || "Categories"}
                </h2>
                {documentTypeId && (
                  <p className="text-gray-600 text-sm mt-1">
                    {t("manageCategoriesFor") ||
                      "Manage categories for selected document type"}
                    {hasAnyFiles && (
                      <span className="ml-2 text-blue-600 font-medium">
                        • {totalFilesCount}{" "}
                        {t("filesSelected") || "file(s) selected"}
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Document Type Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
                    {t("documentType") || "Document Type"}:
                  </label>
                  <select
                    value={documentTypeId || ""}
                    onChange={(e) => handleDocumentTypeChange(e.target.value)}
                    className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
                  >
                    <option value="" className="text-sm">
                      {t("selectDocumentType") || "Select Document Type"}
                    </option>
                    {staticDocumentTypes.map((docType) => (
                      <option
                        key={docType.id}
                        value={docType.id}
                        className="text-sm"
                      >
                        {docType.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scanners Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
                    {t("scanner") || "Scanner"}:
                  </label>
                  <select
                    value={scannerId || ""}
                    onChange={(e) => handleScannerChange(e.target.value)}
                    className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
                  >
                    <option value="" className="text-sm">
                      {t("selectScanner") || "Select Scanner"}
                    </option>
                    {staticScanners.map((scanner) => (
                      <option
                        key={scanner.id}
                        value={scanner.id}
                        className="text-sm"
                      >
                        {scanner.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Root Category Button */}
                <button
                  onClick={() => toggleAddForm("root")}
                  disabled={!documentTypeId}
                  className="px-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                  title={
                    !documentTypeId
                      ? t("selectDocTypeFirst") || "Select document type first"
                      : t("addRootCategory") || "Add root category"
                  }
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">
                    {t("addRootCategory") || "Add Root Category"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content - 2-Column Layout with Tabs on Right */}
          <div className="min-h-[600px]">
            <div className="flex">
              {/* Left Side - Categories Table */}
              <div
                className={`${
                  hasAnyFiles ? "w-1/2" : "w-full"
                } transition-all duration-300 overflow-x-auto ${
                  hasAnyFiles ? "border-r border-gray-200" : ""
                }`}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th
                        scope="col"
                        colSpan={2}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("categoryName") || "Category Name"}
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Add root form */}
                    {showAddForm["root"] && renderAddForm("root")}

                    {/* Categories or empty state */}
                    {documentTypeId &&
                    parentCategories &&
                    parentCategories.length > 0 ? (
                      renderRows(parentCategories)
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-0">
                          {renderEmptyState()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right Side - Tabbed Panel (Files / Preview) */}
              {renderRightPanel()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

CategoryTable.defaultProps = {
  currentDocTypeId: null,
  currentParentCategoryId: null,
  onDocumentTypeChange: () => {},
  onCategoryUpdate: () => {},
  initialCategories: [],
};

export default React.memo(CategoryTable);
