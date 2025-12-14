/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Folder,
  FolderOpen,
  Upload,
  X,
  Eye,
  FileText,
  Image,
  File,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryChilds,
  getParentCategories,
  upload_File,
  delete_File,
  createDocument,
} from "../documentViewerThunk";
import ScannerSelector from "./ScannerSelector";
import ScanButton from "./ScanButton";
import FilePreviewTab from "./FilePreviewTab";
import {
  clearAllFiles,
  setFileSecurityLevel,
  setFileAclRules,
  setDocumentData,
} from "../documentViewerSlice";
import Popup from "../../../globalComponents/Popup";
import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";
import ErrorAlert from "../../../globalComponents/Alerts/ErrorAlert";

const DocumentCategoryTable = ({ currentDocTypeId, docTypesList }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get data from Redux store - with nested children support
  const {
    parentCategories,
    childrenByParentId,
    currentChildren,
    currentChildrenParentId,
    status,
    error,
    childCategoriesLoading,
    loadingChildrenFor,
    completeJsonData,
  } = useSelector((state) => {
    return state.documentViewerReducer;
  });

  // Get filesMetaData from completeJsonData
  const filesMetaData = completeJsonData.filesMetaData;
  // Handle permissions button click for a specific file
  const handlePermissions = (categoryId, fileName) => {
    // Find the file in filesMetaData
    const file = filesMetaData.find(
      (f) =>
        String(f.categoryId) === String(categoryId) &&
        f.originalName === fileName
    );

    if (file) {
      // Set current file and load existing permissions
      setCurrentPermissionFile({
        categoryId,
        fileName,
        tempFileId: file.tempFileId,
      });
      setPermissionsData({
        aclRules: file.aclRules || [],
      });
      setOpenPermissions(true);
    } else {
      // File not uploaded yet, can't set permissions
      console.warn(
        "Cannot set permissions for file that hasn't been uploaded yet"
      );
    }
  };

  // Handle permissions data from UsersRolesPermissionsTable
  const handlePermissionsDataChange = (data) => {
    if (currentPermissionFile) {
      // Transform ACL rules to use permission codes instead of action names
      // Only include necessary fields: principalId, principalType, permissions, accessType
      const transformedAclRules = data.aclRules.map((rule) => ({
        principalId: rule.principalId,
        principalType: rule.principalType,
        permissions: rule.permissions.map((permission) => {
          // If permission is an object with a 'code' field, extract it
          if (typeof permission === "object" && permission.code) {
            return permission.code;
          }
          // If it's already a string (code), return it as-is
          return permission;
        }),
        accessType: rule.accessType,
      }));

      // Update the file's ACL rules in Redux
      dispatch(
        setFileAclRules({
          tempFileId: currentPermissionFile.tempFileId,
          aclRules: transformedAclRules,
        })
      );
      console.log(
        `Updated ACL rules for file ${currentPermissionFile.fileName}:`,
        transformedAclRules
      );
    }
    setPermissionsData(data);
    setOpenPermissions(false);
    setCurrentPermissionFile(null);
  };

  // Local state
  const [documentTypeId, setDocumentTypeId] = useState(
    currentDocTypeId || null
  );
  const [scannerId, setScannerId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [childLoading, setChildLoading] = useState({});
  const [uploadLoading, setUploadLoading] = useState({});
  const [previewFiles, setPreviewFiles] = useState({});
  // Permissions state
  const [openPermissions, setOpenPermissions] = useState(false);
  const [currentPermissionFile, setCurrentPermissionFile] = useState(null); // Track which file's permissions are being edited
  const [permissionsData, setPermissionsData] = useState({
    aclRules: [],
  });
  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  // Alert notification states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Right panel state
  const [rightPanelTab, setRightPanelTab] = useState("files");
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // Temporary security levels (before upload) - stored by categoryId_fileName
  const [tempSecurityLevels, setTempSecurityLevels] = useState({});

  // ✅ Track which categories we've fetched children for (for UI purposes)
  const [fetchedChildrenFor, setFetchedChildrenFor] = useState(new Set());

  // ✅ NEW: Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // ✅ NEW: Sorting and Search state
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Filter and Sort categories
  const filteredAndSortedCategories = useMemo(() => {
    if (!parentCategories || parentCategories.length === 0) {
      return [];
    }

    let filtered = [...parentCategories];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [parentCategories, searchQuery, sortOrder]);

  // ✅ Pagination calculations (use filtered and sorted data)
  const { paginatedCategories, totalPages, startIndex, endIndex } =
    useMemo(() => {
      if (
        !filteredAndSortedCategories ||
        filteredAndSortedCategories.length === 0
      ) {
        return {
          paginatedCategories: [],
          totalPages: 0,
          startIndex: 0,
          endIndex: 0,
        };
      }

      const totalItems = filteredAndSortedCategories.length;
      const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

      const paginated = filteredAndSortedCategories.slice(startIdx, endIdx);

      return {
        paginatedCategories: paginated,
        totalPages: totalPagesCount,
        startIndex: startIdx + 1,
        endIndex: endIdx,
      };
    }, [filteredAndSortedCategories, currentPage, itemsPerPage]);

  // ✅ Reset pagination when document type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [documentTypeId]);

  // ✅ Update when props change or Redux state changes
  useEffect(() => {
    if (currentDocTypeId) {
      setDocumentTypeId(currentDocTypeId);
      handleDocumentTypeChange(currentDocTypeId.toString());
    }
  }, [currentDocTypeId, docTypesList]);

  // ✅   Clear loading when Redux fetch completes
  useEffect(() => {
    // When Redux finishes loading, clear the local loading for that specific parent
    if (!childCategoriesLoading && currentChildrenParentId !== null) {
      setChildLoading((prev) => ({
        ...prev,
        [currentChildrenParentId]: false,
      }));
    }
  }, [childCategoriesLoading, currentChildrenParentId]);

  // ✅  Clear loading when children data appears
  useEffect(() => {
    // Clear loading for the current parent when children arrive
    if (
      currentChildren.length > 0 &&
      currentChildrenParentId &&
      childLoading[currentChildrenParentId]
    ) {
      setChildLoading((prev) => ({
        ...prev,
        [currentChildrenParentId]: false,
      }));
    }
  }, [currentChildren, currentChildrenParentId, childLoading]);

  // ✅ Clear loading state when fetch completes with error or success
  useEffect(() => {
    if (status === "success" || status === "failed") {
      // Clear any lingering loading states after a delay to ensure Redux state is updated
      setTimeout(() => {
        setChildLoading((prev) => {
          const hasAnyLoading = Object.values(prev).some((loading) => loading);
          if (hasAnyLoading) {
            return {};
          }
          return prev;
        });
      }, 100);
    }
  }, [status]);

  // Handle document type selection
  const handleDocumentTypeChange = (selectedDocTypeId) => {
    const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
    setDocumentTypeId(docTypeId);

    // Clear previous data when changing document type
    setExpanded({});
    setShowAddForm({});
    setPreviewFiles({});
    setRightPanelTab("files");
    setCurrentPreviewFile(null);
    setCurrentCategoryId(null);
    setFetchedChildrenFor(new Set());
    setChildLoading({});
    setCollapsedCategories({});
    setCurrentPage(1); // ✅ Reset pagination
    setSearchQuery(""); // ✅ Clear search
    setSortOrder("asc"); // ✅ Reset sort order

    // ✅ Clear all children and files in Redux when changing document type
    dispatch({ type: "document/clearAllChildren" });
    dispatch(clearAllFiles());

    // Handle Choosing a document type
    if (docTypeId) {
      setLoading(true);
      // ✅ Dispatch action to fetch parent categories
      dispatch(getParentCategories(docTypeId))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch parent categories:", error);
          setLoading(false);
        });
    }
  };

  // Handle scanner selection
  const handleScannerChange = (selectedScanner) => {
    const scannerName = selectedScanner || null;
    setScannerId(scannerName);
  };

  // ✅  Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(parseInt(newItemsPerPage));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // ✅ NEW: Sort handler - toggle between asc and desc
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // ✅ NEW: Search handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // ✅ NEW: Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // ✅ Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2; // Show 2 pages before and after current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // ✅ FIXED: Toggle expand function that always refetches children
  const toggleExpand = (item, level = 0) => {
    const { id } = item;
    const isCurrentlyExpanded = expanded[id];

    if (!isCurrentlyExpanded) {
      // Collapse all other top-level categories if this is a root category
      if (level === 0) {
        setExpanded({});
      }

      // ✅ Expand
      if (level === 0) {
        setExpanded({ [id]: true });
      } else {
        setExpanded((prev) => ({ ...prev, [id]: true }));
      }

      // ✅ ALWAYS refetch children data - no caching
      const currentlyLoading = childLoading[id];

      // Only check if currently loading, always refetch otherwise
      if (!currentlyLoading) {
        // Set loading state and track fetch
        setChildLoading((prev) => ({ ...prev, [id]: true }));
        setFetchedChildrenFor((prev) => new Set([...prev, id])); // Still track for UI purposes

        // ✅ Dispatch Redux action to fetch children (always fresh)
        dispatch(fetchCategoryChilds(id))
          .unwrap()
          .then(() => {
            // ✅ Force clear loading immediately after successful fetch
            setTimeout(() => {
              setChildLoading((prev) => ({ ...prev, [id]: false }));
            }, 50);
          })
          .catch((error) => {
            console.error("❌ Failed to refetch children for", id, ":", error);
            // Clear loading state on error
            setChildLoading((prev) => ({ ...prev, [id]: false }));
          });
      }
    } else {
      // Collapse - just update expanded state
      setExpanded((prev) => ({ ...prev, [id]: false }));
    }
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

  // Handle file selection and auto-upload
  const handleFileSelect = async (categoryId, categoryName) => {
    if (!documentTypeId) {
      alert(t("selectDocTypeFirst") || "Please select a document type first");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";

    fileInput.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const filesWithMetadata = files.map((file) => ({
        file: file,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file),
      }));

      // Add files to preview
      setPreviewFiles((prev) => ({
        ...prev,
        [categoryId]: {
          files: filesWithMetadata,
          categoryName,
        },
      }));

      // Start uploading files automatically
      setUploadLoading((prev) => ({ ...prev, [categoryId]: true }));
      setUploadProgress({ current: 0, total: files.length });

      console.log(
        `Uploading ${files.length} files for category ${categoryId}...`
      );

      // Upload files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check if this file has already been uploaded
        const alreadyUploaded = filesMetaData.some(
          (uploadedFile) =>
            String(uploadedFile.categoryId) === String(categoryId) &&
            uploadedFile.originalName === file.name
        );

        if (alreadyUploaded) {
          console.log(`File ${file.name} already uploaded, skipping...`);
          continue;
        }

        try {
          setUploadProgress({ current: i + 1, total: files.length });

          // Dispatch upload_File with file and categoryId
          const result = await dispatch(
            upload_File({ file, categoryId })
          ).unwrap();

          console.log(
            `File ${i + 1}/${files.length} uploaded successfully:`,
            result
          );

          // Transfer temporary security level to Redux if it exists
          const fileKey = `${categoryId}_${file.name}`;
          if (tempSecurityLevels[fileKey] !== undefined) {
            dispatch(
              setFileSecurityLevel({
                tempFileId: result.tempFileId,
                securityLevel: tempSecurityLevels[fileKey],
              })
            );
            // Remove from temporary storage
            setTempSecurityLevels((prev) => {
              const updated = { ...prev };
              delete updated[fileKey];
              return updated;
            });
            console.log(
              `Transferred security level ${tempSecurityLevels[fileKey]} for ${file.name}`
            );
          }
        } catch (error) {
          console.error(
            `Failed to upload file ${i + 1}/${files.length}:`,
            error
          );
          alert(
            `${t("fileUploadFailed") || "File upload failed"}: ${file.name}\n${
              error.message || error
            }`
          );
          setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));
          setUploadProgress({ current: 0, total: 0 });
          return;
        }
      }

      setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));
      setUploadProgress({ current: 0, total: 0 });
      console.log(
        `All ${files.length} files uploaded successfully for category ${categoryId}!`
      );
    };

    fileInput.click();
  };

  // Cancel file upload
  const handleCancelUpload = async (categoryId) => {
    const previewData = previewFiles[categoryId];

    if (previewData && previewData.files) {
      // Delete uploaded temp files from server
      const uploadedFilesForCategory = filesMetaData.filter(
        (file) => String(file.categoryId) === String(categoryId)
      );

      for (const fileInfo of uploadedFilesForCategory) {
        try {
          await dispatch(delete_File(fileInfo.tempFileId)).unwrap();
          console.log(`Deleted temp file: ${fileInfo.tempFileId}`);
        } catch (error) {
          console.error(
            `Failed to delete temp file ${fileInfo.tempFileId}:`,
            error
          );
        }
      }

      // Clean up temporary security levels for this category
      setTempSecurityLevels((prev) => {
        const updated = { ...prev };
        previewData.files.forEach((fileData) => {
          const fileKey = `${categoryId}_${fileData.name}`;
          delete updated[fileKey];
        });
        return updated;
      });

      // Revoke object URLs
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
  const handleRemoveFile = async (categoryId, fileIndex) => {
    const previewData = previewFiles[categoryId];
    if (!previewData) return;

    const removedFile = previewData.files[fileIndex];

    // Find the uploaded temp file for this specific file by matching originalName and categoryId
    const uploadedFileInfo = filesMetaData.find(
      (file) =>
        String(file.categoryId) === String(categoryId) &&
        file.originalName === removedFile.name
    );

    // Delete from server if it was uploaded
    if (uploadedFileInfo) {
      try {
        await dispatch(delete_File(uploadedFileInfo.tempFileId)).unwrap();
        console.log(`Deleted temp file: ${uploadedFileInfo.tempFileId}`);
      } catch (error) {
        console.error(
          `Failed to delete temp file ${uploadedFileInfo.tempFileId}:`,
          error
        );
      }
    }

    // Clean up temporary security level for this file
    const fileKey = `${categoryId}_${removedFile.name}`;
    setTempSecurityLevels((prev) => {
      const updated = { ...prev };
      delete updated[fileKey];
      return updated;
    });

    // Revoke object URL
    if (removedFile.url) {
      URL.revokeObjectURL(removedFile.url);
    }

    setPreviewFiles((prev) => {
      const previewData = prev[categoryId];
      if (!previewData) return prev;

      const updatedFiles = [...previewData.files];
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

  // Handle security level change
  const handleSecurityLevelChange = (categoryId, fileName, value) => {
    // Create a unique key for this file
    const fileKey = `${categoryId}_${fileName}`;

    // Find the tempFileId for this file
    const uploadedFile = filesMetaData.find(
      (file) =>
        String(file.categoryId) === String(categoryId) &&
        file.originalName === fileName
    );

    // Validate value (0-99 or empty)
    const numValue = parseInt(value);
    const isValid =
      (!isNaN(numValue) && numValue >= 0 && numValue <= 99) || value === "";

    if (!isValid && value !== "") {
      return; // Invalid input, do nothing
    }

    if (uploadedFile) {
      // File is uploaded - store in Redux
      dispatch(
        setFileSecurityLevel({
          tempFileId: uploadedFile.tempFileId,
          securityLevel: value === "" ? null : numValue,
        })
      );
    } else {
      // File not yet uploaded - store temporarily in local state
      setTempSecurityLevels((prev) => ({
        ...prev,
        [fileKey]: value === "" ? null : numValue,
      }));
      console.log(
        `Temporary security level for ${fileName}:`,
        value === "" ? null : numValue
      );
    }
  };

  // Handle Create Document button click
  const handleCreateDocument = async () => {
    console.log("📄 Complete JSON Data (Object):", completeJsonData);

    try {
      const result = await dispatch(createDocument(completeJsonData)).unwrap();
      console.log("✅ Document created successfully:", result);

      // Clear all data after successful creation
      dispatch(clearAllFiles());
      dispatch(
        setDocumentData({
          repoId: null,
          documentTypeId: "",
          title: "",
          securityLevel: 0,
          attributes: [],
          aclRules: [],
        })
      );

      // Clear local state
      setPreviewFiles({});
      setTempSecurityLevels({});
      setCurrentPreviewFile(null);
      setCurrentCategoryId(null);
      setRightPanelTab("files");

      // Show success alert notification
      setShowSuccessAlert(true);

      // Hide alert and navigate after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("❌ Failed to create document:", error);

      // Show error alert notification
      setErrorMessage(
        error || t("documentCreationFailed") || "Failed to create document"
      );
      setShowErrorAlert(true);

      // Hide error alert after 3 seconds
      setTimeout(() => {
        setShowErrorAlert(false);
        setErrorMessage("");
      }, 3000);
    }
  };

  // ✅ Helper function to prepare files for backend submission
  const prepareFilesForBackend = () => {
    const formData = new FormData();
    console.log(completeJsonData);

    // Add document type and attributes as JSON from Redux
    formData.append("repoId", completeJsonData.repoId);
    formData.append("documentTypeId", completeJsonData.documentTypeId);
    formData.append("title", completeJsonData.title);
    formData.append("attributes", JSON.stringify(completeJsonData.attributes));
    formData.append("aclRules", JSON.stringify(completeJsonData.aclRules));

    // Add files with their category IDs
    Object.entries(previewFiles).forEach(([categoryId, previewData]) => {
      previewData.files.forEach((fileData) => {
        // Append the actual File object
        formData.append(`files`, fileData.file);
        // Append category ID for this file (so backend knows which category it belongs to)
        formData.append(`fileCategoryIds`, categoryId);
      });
    });

    return formData;
  };

  // ✅ Example function to submit to backend
  const handleSubmitToBackend = async () => {
    try {
      const formData = prepareFilesForBackend();

      // Example API call
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);
        alert("Files uploaded successfully!");
      } else {
        console.error("Upload failed:", response.statusText);
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files!");
    }
  };

  // ✅ NEW: Toggle collapse/expand for category sections in Files tab
  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Check if there are any files uploaded
  const hasAnyFiles = Object.keys(previewFiles).length > 0;
  const totalFilesCount = Object.values(previewFiles).reduce(
    (sum, data) => sum + data.files.length,
    0
  );

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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("uploadedFiles") || "Uploaded Files"}
                  </h3>
                  {Object.values(uploadLoading).some((loading) => loading) && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                      <span className="text-sm font-medium">
                        {t("uploading") || "Uploading"} {uploadProgress.current}
                        /{uploadProgress.total}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {totalFilesCount} {t("filesSelected") || "files selected"} •{" "}
                  {filesMetaData.length} {t("uploaded") || "uploaded"}
                </p>
              </div>

              <div className="p-4 space-y-6">
                {Object.entries(previewFiles).map(
                  ([categoryId, previewData]) => {
                    const isCollapsed = collapsedCategories[categoryId];

                    return (
                      <div
                        key={categoryId}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        {/* ✅ UPDATED: Clickable Category Header with collapse/expand */}
                        <div
                          className="bg-blue-50 border-b border-blue-100 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => toggleCategoryCollapse(categoryId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* ✅ NEW: Collapse/Expand chevron */}
                              {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 text-blue-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-blue-600" />
                              )}
                              <Folder className="w-5 h-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-900">
                                {previewData.categoryName}
                              </h4>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {previewData.files.length}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent collapse/expand when clicking X
                                handleCancelUpload(categoryId);
                              }}
                              disabled={uploadLoading[categoryId]}
                              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              title={t("clearFiles") || "Clear files"}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* ✅ UPDATED: Collapsible Files List */}
                        {!isCollapsed && (
                          <>
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
                                  <div className="flex items-center gap-1">
                                    {/* Security Level Input - Always visible */}
                                    <input
                                      type="number"
                                      min="0"
                                      max="99"
                                      placeholder={
                                        t("securityLevel") || "Security Level"
                                      }
                                      value={(() => {
                                        // Check if file is uploaded
                                        const uploadedFile = filesMetaData.find(
                                          (file) =>
                                            String(file.categoryId) ===
                                              String(categoryId) &&
                                            file.originalName === fileData.name
                                        );

                                        // If uploaded, get from filesMetaData
                                        if (
                                          uploadedFile &&
                                          uploadedFile.securityLevel !== null &&
                                          uploadedFile.securityLevel !==
                                            undefined
                                        ) {
                                          return uploadedFile.securityLevel;
                                        }

                                        // Otherwise, get from temporary state
                                        const fileKey = `${categoryId}_${fileData.name}`;
                                        return (
                                          tempSecurityLevels[fileKey] ?? ""
                                        );
                                      })()}
                                      onChange={(e) =>
                                        handleSecurityLevelChange(
                                          categoryId,
                                          fileData.name,
                                          e.target.value
                                        )
                                      }
                                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      title={
                                        t("securityLevel") ||
                                        "Security Level (0-99)"
                                      }
                                    />
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() =>
                                          handleShowFilePreview(
                                            categoryId,
                                            fileData
                                          )
                                        }
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title={
                                          t("previewFile") || "Preview file"
                                        }
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

                                    {/* /////////////////marwa///////////////// */}
                                    {/* Permissions Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePermissions(
                                          categoryId,
                                          fileData.name
                                        )
                                      }
                                      className="w-full inline-flex items-center justify-center gap-1 px-1 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-small disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={(() => {
                                        const uploadedFile = filesMetaData.find(
                                          (file) =>
                                            String(file.categoryId) ===
                                              String(categoryId) &&
                                            file.originalName === fileData.name
                                        );
                                        return !uploadedFile; // Disabled if not uploaded
                                      })()}
                                      title={(() => {
                                        const uploadedFile = filesMetaData.find(
                                          (file) =>
                                            String(file.categoryId) ===
                                              String(categoryId) &&
                                            file.originalName === fileData.name
                                        );
                                        return uploadedFile
                                          ? t("configurePermissions") ||
                                              "Configure Permissions"
                                          : t("uploadFileFirst") ||
                                              "Upload file first to set permissions";
                                      })()}
                                    >
                                      <Shield className="w-4 h-4" />
                                      {(() => {
                                        const uploadedFile = filesMetaData.find(
                                          (file) =>
                                            String(file.categoryId) ===
                                              String(categoryId) &&
                                            file.originalName === fileData.name
                                        );
                                        const aclRulesCount =
                                          uploadedFile?.aclRules?.length || 0;
                                        return (
                                          aclRulesCount > 0 && (
                                            <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
                                              {aclRulesCount}
                                            </span>
                                          )
                                        );
                                      })()}
                                    </button>

                                    {/* /////////////////marwa///////////////// */}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center gap-2">
                              {/* Add action buttons if needed */}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            // Preview Tab Content
            <FilePreviewTab
              currentPreviewFile={currentPreviewFile}
              currentCategoryId={currentCategoryId}
              previewFiles={previewFiles}
              onBackToFiles={handleBackToFiles}
              onSetRightPanelTab={setRightPanelTab}
            />
          )}
        </div>
      </div>
    );
  };

  const renderAddForm = (categoryId) => {
    if (!showAddForm[categoryId]) return null;
  };

  // ✅ UPDATED: Support nested children from childrenByParentId
  const renderRows = (items, level = 0) => {
    return items.flatMap((item) => {
      const id = item.id;
      const isOpen = expanded[id];
      const isUploading = uploadLoading[id];
      const hasFiles = previewFiles[id];

      // ✅ Check if this specific category is being loaded
      const isLoadingChildren =
        childLoading[id] ||
        (childCategoriesLoading && loadingChildrenFor === id);
      const hasBeenFetched = fetchedChildrenFor.has(id);

      // ✅ Get children from childrenByParentId for this specific parent
      const categoryChildren = childrenByParentId[id] || [];
      const hasChildren =
        Array.isArray(categoryChildren) &&
        categoryChildren.length > 0 &&
        !isLoadingChildren;

      // ✅ Determine if category can have children
      const categoryHasChildren =
        item.hasChildren ||
        hasChildren ||
        item.childrenCount > 0 ||
        item.children?.length > 0 ||
        true; // Allow all categories to potentially have children

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
              {categoryHasChildren ? (
                isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )
              ) : (
                <div className="w-4 h-4 flex-shrink-0" />
              )}

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
            </div>
          </td>
          <td className="py-4 px-6 whitespace-nowrap text-right">
            <div className="flex items-center gap-2 justify-end">
              <ScanButton
                categoryId={id}
                categoryName={item.name}
                scannerId={scannerId}
                documentTypeId={documentTypeId}
                isUploading={isUploading}
              />
              {/* Upload Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileSelect(id, item.name);
                }}
                disabled={!documentTypeId || uploadLoading[id]}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={
                  !documentTypeId
                    ? t("selectDocTypeFirst") ||
                      "Please select a document type first"
                    : `Upload files to ${item.name}`
                }
              >
                {uploadLoading[id] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">
                      {uploadProgress.current}/{uploadProgress.total}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      {t("uploadFiles") || "Upload"}
                    </span>
                  </>
                )}
              </button>

              {/* Add Child Category Button */}
            </div>
          </td>
        </tr>,
      ];

      // Add form row if shown
      if (showAddForm[id]) {
        rows.push(renderAddForm(id));
      }

      // ✅ UPDATED: Render nested children from childrenByParentId
      if (isOpen) {
        if (isLoadingChildren) {
          // Show loading state only while actually loading
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
          // ✅ Recursively render children from childrenByParentId
          rows.push(...renderRows(categoryChildren, level + 1));
        } else if (hasBeenFetched && !isLoadingChildren) {
          // Show empty message only if we've fetched and got no results
          rows.push(
            <tr key={`empty-${id}`} className="bg-gray-50">
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
                  <span className="text-sm">
                    {t("noChildCategories") || "No child categories"}
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
            {t("noDocTypeSelected") || t("noDocumentTypeSelected")}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("selectDocTypeFromDropdown") ||
              "Please select a document type from the dropdown above"}
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
          {t("noCategoriesFound")}
        </h3>
        <p className="text-gray-500 mb-6">
          {t("getStartedCreating") ||
            "Get started by creating your first category"}
        </p>
      </div>
    );
  };

  // ✅ NEW: Pagination Component
  const renderPagination = () => {
    if (!parentCategories || parentCategories.length === 0) {
      return null;
    }

    const pageNumbers = getPageNumbers();

    return (
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        {/* Results Info */}
        <div className="flex-1 flex items-center justify-between">
          {/* <div className="text-sm text-gray-700">
            {t("showing") || "Showing"}{" "}
            <span className="font-medium">{startIndex}</span> {t("to") || "to"}{" "}
            <span className="font-medium">{endIndex}</span> {t("of") || "of"}{" "}
            <span className="font-medium">{parentCategories.length}</span>{" "}
            {t("results") || "results"}
          </div> */}

          {/* Items per page selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-700">{t("Items per page")}:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              className="px-8 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Pagination Controls */}
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-6">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">{t("previous") || "Previous"}</span>
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                  : page === "..."
                  ? "border-gray-300 bg-white text-gray-700 cursor-default"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">{t("next") || "Next"}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    );
  };

  // ✅ Loading state - only show spinner if no data AND initial loading
  if (
    (loading && !parentCategories?.length) ||
    (status === "loading" && !parentCategories?.length)
  ) {
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

  // ✅ Error state
  if (status === "failed") {
    return (
      <section className="">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("categories") || "Categories"}
            </h2>
          </div>
          <div className="px-6 py-16 text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {t("errorLoadingCategories") || "Error Loading Categories"}
            </h3>
            <p className="text-gray-500 mb-6">
              {error ||
                t("somethingWentWrong") ||
                "Something went wrong. Please try again."}
            </p>
            <button
              onClick={() => {
                if (documentTypeId) {
                  dispatch(getParentCategories(documentTypeId));
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {t("retry") || "Retry"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Permissions Popup */}
      {openPermissions && (
        <Popup
          isOpen={openPermissions}
          setIsOpen={setOpenPermissions}
          component={
            <UsersRolesPermissionsTable
              entityType="file"
              onDone={handlePermissionsDataChange}
              savedData={permissionsData}
            />
          }
        />
      )}

      <section>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Document Type Selector */}
          <div className="px-2 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("categories") || "Categories"}
                </h2>
                {documentTypeId && (
                  <p className="text-gray-600 text-sm mt-1">
                    {t("manageCategories") ||
                      "Manage categories for selected document type"}
                    {hasAnyFiles && (
                      <span className="ml-2 text-blue-600 font-medium">
                        • {totalFilesCount}{" "}
                        {t("filesSelected") || "files selected"}
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Scanners Selector */}
                <ScannerSelector
                  scannerId={scannerId}
                  onScannerChange={handleScannerChange}
                />
              </div>
            </div>
          </div>

          {/* Content - 2-Column Layout with Tabs on Right */}
          <div>
            <div className="flex">
              {/* Left Side - Categories Table */}
              <div
                className={`${
                  hasAnyFiles ? "w-1/2" : "w-full"
                } transition-all duration-300 overflow-x-auto ${
                  hasAnyFiles ? "border-r border-gray-200" : ""
                }`}
              >
                {/* ✅ NEW: Search Input */}
                <div className="bg-white border-b border-gray-200 px-6 py-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={t("Search by Parent categories")}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {/* Search Icon */}
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {/* Clear Button */}
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title={t("clearSearch") || "Clear search"}
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {/* Search Results Count */}
                  {searchQuery && (
                    <p className="text-xs text-gray-500 mt-2">
                      {filteredAndSortedCategories.length === 0
                        ? t("noResultsFound") || "No results found"
                        : `${filteredAndSortedCategories.length} ${
                            filteredAndSortedCategories.length === 1
                              ? t("categoryFound") || "category found"
                              : t("categoriesFound") || "categories found"
                          }`}
                    </p>
                  )}
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th
                        scope="col"
                        colSpan={2}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={handleSortToggle}
                        title={t("clickToSort") || "Click to sort"}
                      >
                        <div className="flex items-center gap-2">
                          <span>{t("categoryName") || "Category Name"}</span>
                          {sortOrder === "asc" ? (
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
                                d="M5 15l7-7 7 7"
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
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-10 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {showAddForm["root"] && renderAddForm("root")}

                    {(() => {
                      if (
                        documentTypeId &&
                        parentCategories &&
                        parentCategories.length > 0
                      ) {
                        // ✅ Use paginated categories instead of all categories
                        return renderRows(paginatedCategories);
                      } else {
                        return (
                          <tr>
                            <td colSpan={3} className="p-0">
                              {renderEmptyState()}
                            </td>
                          </tr>
                        );
                      }
                    })()}
                  </tbody>
                </table>

                {/* ✅ Add pagination component */}
                {renderPagination()}
              </div>

              {/* Right Side - Tabbed Panel (Files / Preview) */}
              {renderRightPanel()}
            </div>
          </div>

          {/* Create Document Button */}
          <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleCreateDocument}
              disabled={!documentTypeId || filesMetaData.length === 0}
              className="w-full px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              title={
                !documentTypeId
                  ? t("selectDocTypeFirst") ||
                    "Please select a document type first"
                  : filesMetaData.length === 0
                  ? "Please upload at least one file"
                  : t("Create Document") ||
                    "Create Document with uploaded files"
              }
            >
              <FileText className="w-6 h-6" />
              <span>{t("Create Document")}</span>
              {filesMetaData.length > 0 && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {filesMetaData.length}
                  {filesMetaData.length === 1 ? t("file") : t("files")}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Success Alert */}
      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title={t("Document Created Successfully")}
        message={t("Redirecting to home...")}
      />

      {/* Error Alert */}
      <ErrorAlert
        show={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        title={t("documentCreationFailed") || "Document Creation Failed!"}
        message={errorMessage}
      />
    </>
  );
};

export default React.memo(DocumentCategoryTable);
