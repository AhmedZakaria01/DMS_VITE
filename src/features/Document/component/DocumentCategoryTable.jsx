// /* eslint-disable react/prop-types */
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Plus,
//   Folder,
//   FolderOpen,
//   Upload,
//   X,
//   Eye,
//   FileText,
//   Image,
//   File,
//   ArrowLeft,
//   Download,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCategoryChilds,
//   getParentCategories,
// } from "../documentViewerThunk";

// const DocumentCategoryTable = ({ currentDocTypeId, docTypesList }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   // ✅ Get data from Redux store - always fresh children data
//   const {
//     parentCategories,
//     currentChildren,
//     currentChildrenParentId,
//     status,
//     error,
//     childCategoriesLoading,
//   } = useSelector((state) => {
//     return state.documentViewerReducer;
//   });

//   // ✅ Use docTypesList prop

//   const staticScanners = [
//     { id: 1, name: "HP ScanJet Pro 3000" },
//     { id: 2, name: "Canon imageFORMULA DR-C225" },
//     { id: 3, name: "Epson WorkForce ES-500W" },
//     { id: 4, name: "Fujitsu ScanSnap iX1600" },
//     { id: 5, name: "Brother ADS-2700W" },
//   ];

//   // Local state
//   const [documentTypeId, setDocumentTypeId] = useState(
//     currentDocTypeId || null
//   );
//   const [scannerId, setScannerId] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [showAddForm, setShowAddForm] = useState({});
//   const [newCategoryName, setNewCategoryName] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [childLoading, setChildLoading] = useState({});
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState({});
//   const [previewFiles, setPreviewFiles] = useState({});

//   // Right panel state
//   const [rightPanelTab, setRightPanelTab] = useState("files");
//   const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
//   const [currentCategoryId, setCurrentCategoryId] = useState(null);

//   // ✅ Track which categories we've fetched children for (for UI purposes)
//   const [fetchedChildrenFor, setFetchedChildrenFor] = useState(new Set());

//   // ✅ Update when props change or Redux state changes
//   useEffect(() => {
//     if (currentDocTypeId) {
//       setDocumentTypeId(currentDocTypeId);
//       handleDocumentTypeChange(currentDocTypeId.toString());
//     }
//   }, [currentDocTypeId, docTypesList]);

//   // ✅ SIMPLIFIED: Clear loading when Redux fetch completes
//   useEffect(() => {
//     // When Redux finishes loading, clear the local loading for that specific parent
//     if (!childCategoriesLoading && currentChildrenParentId !== null) {
//       setChildLoading((prev) => ({
//         ...prev,
//         [currentChildrenParentId]: false,
//       }));
//     }
//   }, [childCategoriesLoading, currentChildrenParentId]);

//   // ✅ Additional safety: Clear loading when children data appears
//   useEffect(() => {
//     // Clear loading for the current parent when children arrive
//     if (
//       currentChildren.length > 0 &&
//       currentChildrenParentId &&
//       childLoading[currentChildrenParentId]
//     ) {
//       setChildLoading((prev) => ({
//         ...prev,
//         [currentChildrenParentId]: false,
//       }));
//     }
//   }, [currentChildren, currentChildrenParentId, childLoading]);

//   // ✅ Clear loading state when fetch completes with error or success
//   useEffect(() => {
//     if (status === "success" || status === "failed") {
//       // Clear any lingering loading states after a delay to ensure Redux state is updated
//       setTimeout(() => {
//         setChildLoading((prev) => {
//           const hasAnyLoading = Object.values(prev).some((loading) => loading);
//           if (hasAnyLoading) {
//             return {};
//           }
//           return prev;
//         });
//       }, 100);
//     }
//   }, [status]);

//   // ✅ Debug component state

//   // Handle document type selection
//   const handleDocumentTypeChange = (selectedDocTypeId) => {
//     const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
//     setDocumentTypeId(docTypeId);

//     // Clear previous data when changing document type
//     setExpanded({});
//     setShowAddForm({});
//     setNewCategoryName({});
//     setPreviewFiles({});
//     setRightPanelTab("files");
//     setCurrentPreviewFile(null);
//     setCurrentCategoryId(null);
//     setFetchedChildrenFor(new Set());
//     setChildLoading({});

//     // ✅ Clear current children in Redux when changing document type
//     dispatch({ type: "document/clearCurrentChildren" });

//     if (docTypeId) {
//       setLoading(true);
//       // ✅ Dispatch action to fetch parent categories
//       dispatch(getParentCategories(docTypeId))
//         .unwrap()
//         .then(() => {
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Failed to fetch parent categories:", error);
//           setLoading(false);
//         });
//     }
//   };

//   // Handle scanner selection
//   const handleScannerChange = (selectedScannerId) => {
//     const scanId = selectedScannerId ? parseInt(selectedScannerId) : null;
//     setScannerId(scanId);
//     console.log("Scanner selected:", scanId);
//   };

//   // ✅ FIXED: Toggle expand function that always refetches children
//   const toggleExpand = (item, level = 0) => {
//     const { id } = item;
//     const isCurrentlyExpanded = expanded[id];

//     if (!isCurrentlyExpanded) {
//       // Collapse all other top-level categories if this is a root category
//       if (level === 0) {
//         setExpanded({});
//       }

//       // ✅ Expand
//       if (level === 0) {
//         setExpanded({ [id]: true });
//       } else {
//         setExpanded((prev) => ({ ...prev, [id]: true }));
//       }

//       // ✅ ALWAYS refetch children data - no caching
//       const currentlyLoading = childLoading[id];

//       // Only check if currently loading, always refetch otherwise
//       if (!currentlyLoading) {

//         // Set loading state and track fetch
//         setChildLoading((prev) => ({ ...prev, [id]: true }));
//         setFetchedChildrenFor((prev) => new Set([...prev, id])); // Still track for UI purposes

//         // ✅ Dispatch Redux action to fetch children (always fresh)
//         dispatch(fetchCategoryChilds(id))
//           .unwrap()
//           .then((response) => {
//             // ✅ Force clear loading immediately after successful fetch
//             setTimeout(() => {
//               setChildLoading((prev) => ({ ...prev, [id]: false }));
//             }, 50);
//           })
//           .catch((error) => {
//             console.error("❌ Failed to refetch children for", id, ":", error);
//             // Clear loading state on error
//             setChildLoading((prev) => ({ ...prev, [id]: false }));
//           });
//       }
//     } else {
//       // Collapse - just update expanded state
//       setExpanded((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   // Toggle Add Input
//   const toggleAddForm = (categoryId) => {
//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     const newShowAddForm = Object.keys(showAddForm).reduce((acc, key) => {
//       acc[key] = false;
//       return acc;
//     }, {});

//     setShowAddForm({
//       ...newShowAddForm,
//       [categoryId]: !showAddForm[categoryId],
//     });

//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
//   };

//   const handleAddCategory = (parentCategoryId = null) => {
//     const categoryName = newCategoryName[parentCategoryId || "root"];

//     if (!categoryName?.trim()) {
//       alert(t("pleaseEnterCategoryName") || "Please enter a category name");
//       return;
//     }

//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     setCreateLoading(true);
//     setCreateError(null);

//     // TODO: Replace with actual API call
//     setTimeout(() => {
//       const newCategory = {
//         id: Date.now(),
//         name: categoryName.trim(),
//         documentTypeId: documentTypeId,
//         parentId: parentCategoryId,
//         children: [],
//       };

//       // TODO: Dispatch action to create category
//       // dispatch(createCategory(newCategory))

//       if (parentCategoryId === null) {
//         // For now, we'll need to refresh parent categories
//         // dispatch(getParentCategories(documentTypeId));
//       } else {
//         // For now, we'll need to refresh children
//         // dispatch(fetchCategoryChilds(parentCategoryId));
//       }

//       setCreateLoading(false);
//       setShowAddForm({});
//       setNewCategoryName({});

//       console.log("Category created:", newCategory);
//       alert(`Category "${categoryName}" created successfully!`);
//     }, 1000);
//   };

//   const handleInputChange = (categoryId, value) => {
//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
//   };

//   // Get file icon based on file type
//   const getFileIcon = (file) => {
//     const fileType = file.type;
//     if (fileType.startsWith("image/")) {
//       return <Image className="w-5 h-5 text-green-600" />;
//     } else if (fileType === "application/pdf") {
//       return <FileText className="w-5 h-5 text-red-600" />;
//     } else if (fileType.includes("document") || fileType.includes("word")) {
//       return <FileText className="w-5 h-5 text-blue-600" />;
//     } else if (fileType.includes("sheet") || fileType.includes("excel")) {
//       return <FileText className="w-5 h-5 text-green-600" />;
//     } else {
//       return <File className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Handle file selection
//   const handleFileSelect = (categoryId, categoryName) => {
//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.multiple = true;
//     fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";

//     fileInput.onchange = (e) => {
//       const files = Array.from(e.target.files);
//       if (files.length === 0) return;

//       const filesWithMetadata = files.map((file) => ({
//         file: file,
//         name: file.name,
//         type: file.type,
//         size: file.size,
//         lastModified: file.lastModified,
//         url: URL.createObjectURL(file),
//       }));

//       setPreviewFiles((prev) => ({
//         ...prev,
//         [categoryId]: {
//           files: filesWithMetadata,
//           categoryName,
//         },
//       }));
//       console.log(
//         `Files selected for category ${categoryId}:`,
//         filesWithMetadata
//       );
//     };

//     fileInput.click();
//   };

//   // Handle file upload after preview
//   const handleUploadConfirmed = (categoryId) => {
//     const previewData = previewFiles[categoryId];
//     if (!previewData || previewData.files.length === 0) return;

//     setUploadLoading((prev) => ({ ...prev, [categoryId]: true }));

//     setTimeout(() => {
//       setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));

//       alert(
//         `Successfully uploaded ${previewData.files.length} file(s) to "${previewData.categoryName}"`
//       );

//       console.log(
//         `Uploaded ${previewData.files.length} file(s) to category ${categoryId}:`,
//         previewData.files
//       );

//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });

//       setPreviewFiles((prev) => {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       });
//     }, 1500);
//   };

//   // Cancel file upload
//   const handleCancelUpload = (categoryId) => {
//     const previewData = previewFiles[categoryId];

//     if (previewData && previewData.files) {
//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });
//     }

//     setPreviewFiles((prev) => {
//       const newPreviewFiles = { ...prev };
//       delete newPreviewFiles[categoryId];
//       return newPreviewFiles;
//     });
//   };

//   // Remove individual file from preview
//   const handleRemoveFile = (categoryId, fileIndex) => {
//     setPreviewFiles((prev) => {
//       const previewData = prev[categoryId];
//       if (!previewData) return prev;

//       const updatedFiles = [...previewData.files];
//       const removedFile = updatedFiles[fileIndex];

//       if (removedFile.url) {
//         URL.revokeObjectURL(removedFile.url);
//       }

//       updatedFiles.splice(fileIndex, 1);

//       if (updatedFiles.length === 0) {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       }

//       return {
//         ...prev,
//         [categoryId]: {
//           ...previewData,
//           files: updatedFiles,
//         },
//       };
//     });
//   };

//   // Show individual file preview - switch to preview tab
//   const handleShowFilePreview = (categoryId, fileData) => {
//     setCurrentPreviewFile(fileData);
//     setCurrentCategoryId(categoryId);
//     setRightPanelTab("preview");
//   };

//   // Go back to files tab
//   const handleBackToFiles = () => {
//     setRightPanelTab("files");
//   };

//   // Download file
//   const handleDownloadFile = (fileData) => {
//     const link = document.createElement("a");
//     link.href = fileData.url;
//     link.download = fileData.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Check if there are any files uploaded
//   const hasAnyFiles = Object.keys(previewFiles).length > 0;
//   const totalFilesCount = Object.values(previewFiles).reduce(
//     (sum, data) => sum + data.files.length,
//     0
//   );

//   // Render Right Panel with Tabs (Files and Preview)
//   const renderRightPanel = () => {
//     if (!hasAnyFiles) return null;

//     return (
//       <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
//         {/* Tabs Header */}
//         <div className="border-b border-gray-200 bg-gray-50">
//           <nav className="flex">
//             <button
//               onClick={() => setRightPanelTab("files")}
//               className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 rightPanelTab === "files"
//                   ? "border-blue-600 text-blue-600 bg-white"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Upload className="w-4 h-4" />
//                 <span>{t("files") || "Files"}</span>
//                 <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                   {totalFilesCount}
//                 </span>
//               </div>
//             </button>
//             <button
//               onClick={() => setRightPanelTab("preview")}
//               className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 rightPanelTab === "preview"
//                   ? "border-blue-600 text-blue-600 bg-white"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Eye className="w-4 h-4" />
//                 <span>{t("preview") || "Preview"}</span>
//                 {currentPreviewFile && (
//                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//                     1
//                   </span>
//                 )}
//               </div>
//             </button>
//           </nav>
//         </div>

//         {/* Tab Content */}
//         <div className="flex-1 overflow-hidden">
//           {rightPanelTab === "files" ? (
//             // Files Tab Content
//             <div className="h-full overflow-y-auto bg-gray-50">
//               <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {t("uploadedFiles") || "Uploaded Files"}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {totalFilesCount} {t("filesSelected") || "files selected"}
//                 </p>
//               </div>

//               <div className="p-4 space-y-6">
//                 {Object.entries(previewFiles).map(
//                   ([categoryId, previewData]) => (
//                     <div
//                       key={categoryId}
//                       className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
//                     >
//                       {/* Category Header */}
//                       <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <Folder className="w-5 h-5 text-blue-600" />
//                             <h4 className="font-semibold text-gray-900">
//                               {previewData.categoryName}
//                             </h4>
//                             <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                               {previewData.files.length}
//                             </span>
//                           </div>
//                           <button
//                             onClick={() => handleCancelUpload(categoryId)}
//                             disabled={uploadLoading[categoryId]}
//                             className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                             title={t("clearFiles") || "Clear files"}
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>

//                       {/* Files List */}
//                       <div className="p-3 space-y-2">
//                         {previewData.files.map((fileData, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                           >
//                             <div className="flex items-center gap-2 flex-1 min-w-0">
//                               {getFileIcon(fileData)}
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-gray-800 truncate">
//                                   {fileData.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {formatFileSize(fileData.size)}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() =>
//                                   handleShowFilePreview(categoryId, fileData)
//                                 }
//                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                                 title={t("previewFile") || "Preview file"}
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleRemoveFile(categoryId, index)
//                                 }
//                                 disabled={uploadLoading[categoryId]}
//                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                                 title={t("removeFile") || "Remove file"}
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center gap-2">
//                         {/* Add action buttons if needed */}
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           ) : (
//             // Preview Tab Content
//             <div className="h-full flex flex-col bg-white">
//               {currentPreviewFile && currentCategoryId ? (
//                 <>
//                   {/* Preview Header */}
//                   <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex-shrink-0">
//                     <div className="flex items-center justify-between mb-3">
//                       <button
//                         onClick={handleBackToFiles}
//                         className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
//                       >
//                         <ArrowLeft className="w-4 h-4" />
//                         <span>{t("backToFiles") || "Back to Files"}</span>
//                       </button>
//                       <h3 className="text-lg font-bold text-gray-900">
//                         {t("filePreview") || "File Preview"}
//                       </h3>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       {getFileIcon(currentPreviewFile)}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           {currentPreviewFile.name}
//                         </p>
//                         <p className="text-xs text-gray-600 mt-1">
//                           {previewFiles[currentCategoryId]?.categoryName}
//                         </p>
//                         <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                           <span>{formatFileSize(currentPreviewFile.size)}</span>
//                           <span>•</span>
//                           <span>{currentPreviewFile.type}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-3 flex gap-2">
//                       <button
//                         onClick={() => handleDownloadFile(currentPreviewFile)}
//                         className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
//                       >
//                         <Download className="w-4 h-4" />
//                         <span>{t("download") || "Download"}</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Preview Content */}
//                   <div className="flex-1 overflow-auto bg-gray-50 p-4">
//                     {currentPreviewFile.type.startsWith("image/") ? (
//                       <div className="flex justify-center items-start h-full">
//                         <img
//                           src={currentPreviewFile.url}
//                           alt={currentPreviewFile.name}
//                           className="max-w-full h-auto rounded shadow-lg"
//                         />
//                       </div>
//                     ) : currentPreviewFile.type === "application/pdf" ? (
//                       <div className="h-full">
//                         <embed
//                           src={currentPreviewFile.url}
//                           type="application/pdf"
//                           className="w-full h-full min-h-[500px] rounded shadow-lg border border-gray-200"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-lg shadow p-6">
//                         <FileText className="w-16 h-16 text-blue-600 mb-3" />
//                         <h4 className="text-lg font-semibold text-gray-700 mb-2">
//                           {t("previewNotAvailable") || "Preview Not Available"}
//                         </h4>
//                         <p className="text-sm text-gray-500 mb-4">
//                           {t("previewNotAvailableDesc") ||
//                             "This file type cannot be previewed. Please download to view."}
//                         </p>
//                         <div className="text-xs text-gray-600 space-y-1 text-left bg-gray-50 p-3 rounded">
//                           <p>
//                             <span className="font-medium">Type:</span>{" "}
//                             {currentPreviewFile.type}
//                           </p>
//                           <p>
//                             <span className="font-medium">Size:</span>{" "}
//                             {formatFileSize(currentPreviewFile.size)}
//                           </p>
//                           <p>
//                             <span className="font-medium">Modified:</span>{" "}
//                             {new Date(
//                               currentPreviewFile.lastModified
//                             ).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Preview Footer */}
//                   <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
//                     <div className="text-xs text-gray-600">
//                       <p>
//                         <span className="font-medium">
//                           {t("lastModified") || "Last Modified"}:
//                         </span>{" "}
//                         {new Date(
//                           currentPreviewFile.lastModified
//                         ).toLocaleDateString()}{" "}
//                         at{" "}
//                         {new Date(
//                           currentPreviewFile.lastModified
//                         ).toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 // No file selected for preview
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
//                   <Eye className="w-20 h-20 text-gray-300 mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                     {t("noFileSelected") || "No File Selected"}
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     {t("selectFileToPreview") ||
//                       "Select a file from the files tab to preview"}
//                   </p>
//                   <button
//                     onClick={() => setRightPanelTab("files")}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {t("goToFiles") || "Go to Files"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderAddForm = (categoryId) => {
//     if (!showAddForm[categoryId]) return null;

//     return (
//       <tr className="bg-gray-50">
//         <td colSpan={3} className="px-6 py-4">
//           <div className="flex items-center gap-3">
//             <input
//               type="text"
//               value={newCategoryName[categoryId] || ""}
//               onChange={(e) => handleInputChange(categoryId, e.target.value)}
//               placeholder={t("enterCategoryName") || "Enter category name"}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   handleAddCategory(categoryId === "root" ? null : categoryId);
//                 }
//               }}
//               autoFocus
//             />
//             <button
//               onClick={() =>
//                 handleAddCategory(categoryId === "root" ? null : categoryId)
//               }
//               disabled={createLoading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               <span className="text-sm">
//                 {createLoading ? t("adding") || "Adding..." : t("add") || "Add"}
//               </span>
//             </button>
//             <button
//               onClick={() => toggleAddForm(categoryId)}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//             >
//               <span className="text-sm">{t("cancel") || "Cancel"}</span>
//             </button>
//           </div>
//           {createError && (
//             <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="text-sm">{createError}</span>
//               </div>
//             </div>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   //  SIMPLIFIED: Use currentChildren from Redux for always fresh data
//   const renderRows = (items, level = 0) => {
//     return items.flatMap((item) => {
//       const id = item.id;
//       const isOpen = expanded[id];
//       const isUploading = uploadLoading[id];
//       const hasFiles = previewFiles[id];

//       //   SIMPLIFIED: Use Redux childCategoriesLoading and check if this is the current parent
//       const isLoadingChildren =
//         childLoading[id] ||
//         (childCategoriesLoading && currentChildrenParentId === id);
//       const hasBeenFetched = fetchedChildrenFor.has(id);

//       //   SIMPLIFIED: Get children only if this is the current parent being displayed
//       const hasChildren =
//         currentChildrenParentId === id &&
//         Array.isArray(currentChildren) &&
//         currentChildren.length > 0 &&
//         !isLoadingChildren;

//       //   Determine if category can have children
//       const categoryHasChildren =
//         item.hasChildren ||
//         hasChildren ||
//         item.childrenCount > 0 ||
//         item.children?.length > 0 ||
//         true; // Allow all categories to potentially have children

//       const rows = [
//         <tr
//           key={id}
//           className={`transition-all duration-200 ${
//             level === 0 ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white"
//           } hover:bg-gray-50`}
//         >
//           <td className="py-4 px-6 whitespace-nowrap text-gray-700" colSpan={2}>
//             <div
//               className="flex items-center gap-3 cursor-pointer select-none"
//               style={{ paddingLeft: `${level * 24}px` }}
//               onClick={() => toggleExpand(item, level)}
//             >
//               {categoryHasChildren ? (
//                 isOpen ? (
//                   <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 )
//               ) : (
//                 <div className="w-4 h-4 flex-shrink-0" />
//               )}

//               {isOpen ? (
//                 <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
//               ) : (
//                 <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
//               )}

//               <span className="font-medium text-sm">{item.name}</span>

//               {hasFiles && (
//                 <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                   {previewFiles[id].files.length} files
//                 </span>
//               )}
//               {/*
//               {isLoadingChildren && (
//                 <div className="flex items-center gap-1 text-gray-500">
//                   <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
//                   <span className="text-xs">
//                     {t("loading") || "Loading..."}
//                   </span>
//                 </div>
//               )} */}
//             </div>
//           </td>
//           <td className="py-4 px-6 whitespace-nowrap text-right">
//             <div className="flex items-center gap-2 justify-end">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   alert(t("scanInitiated") || "Scan initiated!");
//                 }}
//                 disabled={!documentTypeId || isUploading || !scannerId}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !scannerId
//                     ? t("selectScannerFirst") || "Please select a scanner first"
//                     : !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Scan to ${item.name}`
//                 }
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 <span className="text-sm">{t("scan") || "Scan"}</span>
//               </button>
//               {/* Upload Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleFileSelect(id, item.name);
//                 }}
//                 disabled={!documentTypeId || isUploading}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Upload files to ${item.name}`
//                 }
//               >
//                 <Upload className="w-4 h-4" />
//                 <span className="text-sm">{t("uploadFiles") || "Upload"}</span>
//               </button>

//               {/* Add Child Category Button */}
//               {/* <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleAddForm(id);
//                 }}
//                 disabled={!documentTypeId}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Add child category to ${item.name}`
//                 }
//               >
//                 <Plus className="w-4 h-4" />
//                 <span className="text-sm">{t("addChild") || "Add"}</span>
//               </button> */}
//             </div>
//           </td>
//         </tr>,
//       ];

//       // Add form row if shown
//       if (showAddForm[id]) {
//         rows.push(renderAddForm(id));
//       }

//       //   SIMPLIFIED: Render children or loading state for current parent only
//       if (isOpen) {
//         if (isLoadingChildren) {
//           // Show loading state only while actually loading
//           rows.push(
//             <tr key={`loading-${id}`} className="bg-gray-50">
//               <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                 <div
//                   className="flex items-center justify-center gap-2"
//                   style={{ paddingLeft: `${(level + 1) * 24}px` }}
//                 >
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   <span className="text-sm">
//                     {t("loadingChildren") || "Loading children..."}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         } else if (hasChildren) {
//           // ✅ Use currentChildren from Redux (always fresh)

//           rows.push(...renderRows(currentChildren, level + 1));
//         } else if (hasBeenFetched && !isLoadingChildren) {
//           // Show empty message only if we've fetched and got no results
//           rows.push(
//             <tr key={`empty-${id}`} className="bg-gray-50">
//               <td
//                 colSpan={3}
//                 className="px-6 py-4 text-center text-gray-500 italic"
//               >
//                 <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
//                   <span className="text-sm">
//                     {t("noChildCategories") || "No child categories"}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         }
//       }

//       return rows;
//     });
//   };

//   const renderEmptyState = () => {
//     if (!documentTypeId) {
//       return (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <Folder className="w-16 h-16 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             {t("noDocTypeSelected") || "No Document Type Selected"}
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {t("selectDocTypeFromDropdown") ||
//               "Please select a document type from the dropdown above"}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-16">
//         <div className="text-gray-400 mb-4">
//           <Folder className="w-16 h-16 mx-auto" />
//         </div>
//         <h3 className="text-lg font-medium text-gray-600 mb-2">
//           {t("noCategoriesFound") || "No Categories Found"}
//         </h3>
//         <p className="text-gray-500 mb-6">
//           {t("getStartedCreating") ||
//             "Get started by creating your first category"}
//         </p>
//       </div>
//     );
//   };

//   //   Loading state - only show spinner if no data AND initial loading
//   if (
//     (loading && !parentCategories?.length) ||
//     (status === "loading" && !parentCategories?.length)
//   ) {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">
//               {t("loadingCategories") || "Loading categories..."}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   //   Error state
//   if (status === "failed") {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="text-red-500 mb-4">
//               <svg
//                 className="w-16 h-16 mx-auto"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-600 mb-2">
//               {t("errorLoadingCategories") || "Error Loading Categories"}
//             </h3>
//             <p className="text-gray-500 mb-6">
//               {error ||
//                 t("somethingWentWrong") ||
//                 "Something went wrong. Please try again."}
//             </p>
//             <button
//               onClick={() => {
//                 if (documentTypeId) {
//                   dispatch(getParentCategories(documentTypeId));
//                 }
//               }}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
//             >
//               {t("retry") || "Retry"}
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header with Document Type Selector */}
//           <div className="px-2 py-5 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {t("categories") || "Categories"}
//                 </h2>
//                 {documentTypeId && (
//                   <p className="text-gray-600 text-sm mt-1">
//                     {t("manageCategories") ||
//                       "Manage categories for selected document type"}
//                     {hasAnyFiles && (
//                       <span className="ml-2 text-blue-600 font-medium">
//                         • {totalFilesCount}{" "}
//                         {t("filesSelected") || "files selected"}
//                       </span>
//                     )}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//                 {/* Scanners Selector */}
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                   <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
//                     {t("scanner") || "Scanner"}:
//                   </label>
//                   <select
//                     value={scannerId || ""}
//                     onChange={(e) => handleScannerChange(e.target.value)}
//                     className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
//                   >
//                     <option value="" className="text-sm">
//                       {t("selectScanner") || "Select Scanner"}
//                     </option>
//                     {staticScanners.map((scanner) => (
//                       <option
//                         key={scanner.id}
//                         value={scanner.id}
//                         className="text-sm"
//                       >
//                         {scanner.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Add Root Category Button */}
//                 <button
//                   onClick={() => toggleAddForm("root")}
//                   disabled={!documentTypeId}
//                   className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
//                   title={
//                     !documentTypeId
//                       ? t("selectDocTypeFirst") ||
//                         "Please select a document type first"
//                       : t("addRootCategory") || "Add Root Category"
//                   }
//                 >
//                   <Plus className="w-5 h-5" />
//                   <span className="text-sm">
//                     {t("addRootCategory") || "Add Root"}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Content - 2-Column Layout with Tabs on Right */}
//           <div className="min-h-[600px]">
//             <div className="flex">
//               {/* Left Side - Categories Table */}
//               <div
//                 className={`${
//                   hasAnyFiles ? "w-1/2" : "w-full"
//                 } transition-all duration-300 overflow-x-auto ${
//                   hasAnyFiles ? "border-r border-gray-200" : ""
//                 }`}
//               >
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50 sticky top-0 z-10">
//                     <tr>
//                       <th
//                         scope="col"
//                         colSpan={2}
//                         className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {t("categoryName") || "Category Name"}
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-1 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {t("actions") || "Actions"}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {showAddForm["root"] && renderAddForm("root")}

//                     {(() => {
//                       if (
//                         documentTypeId &&
//                         parentCategories &&
//                         parentCategories.length > 0
//                       ) {
//                         return renderRows(parentCategories);
//                       } else {

//                         return (
//                           <tr>
//                             <td colSpan={3} className="p-0">
//                               {renderEmptyState()}
//                             </td>
//                           </tr>
//                         );
//                       }
//                     })()}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Right Side - Tabbed Panel (Files / Preview) */}
//               {renderRightPanel()}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// DocumentCategoryTable.defaultProps = {
//   currentDocTypeId: null,
//   docTypesList: [],
// };

// export default React.memo(DocumentCategoryTable);

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// /* eslint-disable react/prop-types */
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Plus,
//   Folder,
//   FolderOpen,
//   Upload,
//   X,
//   Eye,
//   FileText,
//   Image,
//   File,
//   ArrowLeft,
//   Download,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCategoryChilds,
//   getParentCategories,
// } from "../documentViewerThunk";

// const DocumentCategoryTable = ({ currentDocTypeId, docTypesList }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   // ✅ Get data from Redux store - always fresh children data
//   const {
//     parentCategories,
//     currentChildren,
//     currentChildrenParentId,
//     status,
//     error,
//     childCategoriesLoading,
//   } = useSelector((state) => {
//     console.log("🔍 Full Redux state:", state);
//     console.log("🔍 documentViewerReducer state:", state.documentViewerReducer);
//     return state.documentViewerReducer;
//   });

//   // ✅ Use docTypesList prop
//   const docTypes = docTypesList || [];

//   const staticScanners = [
//     { id: 1, name: "HP ScanJet Pro 3000" },
//     { id: 2, name: "Canon imageFORMULA DR-C225" },
//     { id: 3, name: "Epson WorkForce ES-500W" },
//     { id: 4, name: "Fujitsu ScanSnap iX1600" },
//     { id: 5, name: "Brother ADS-2700W" },
//   ];

//   // Local state
//   const [documentTypeId, setDocumentTypeId] = useState(
//     currentDocTypeId || null
//   );
//   const [scannerId, setScannerId] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [showAddForm, setShowAddForm] = useState({});
//   const [newCategoryName, setNewCategoryName] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [childLoading, setChildLoading] = useState({});
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState({});
//   const [previewFiles, setPreviewFiles] = useState({});

//   // Right panel state
//   const [rightPanelTab, setRightPanelTab] = useState("files");
//   const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
//   const [currentCategoryId, setCurrentCategoryId] = useState(null);

//   // ✅ Track which categories we've fetched children for (for UI purposes)
//   const [fetchedChildrenFor, setFetchedChildrenFor] = useState(new Set());

//   // ✅ Update when props change or Redux state changes
//   useEffect(() => {
//     console.log("CategoryTable received currentDocTypeId:", currentDocTypeId);
//     console.log("CategoryTable received docTypesList:", docTypesList);

//     if (currentDocTypeId) {
//       setDocumentTypeId(currentDocTypeId);
//       handleDocumentTypeChange(currentDocTypeId.toString());
//     }
//   }, [currentDocTypeId, docTypesList]);

//   // ✅ Debug Redux state changes
//   useEffect(() => {
//     console.log("🔍 Redux parentCategories changed:", parentCategories);
//     console.log("🔍 Redux currentChildren changed:", currentChildren);
//     console.log(
//       "🔍 Redux currentChildrenParentId changed:",
//       currentChildrenParentId
//     );
//     console.log("🔍 Redux status:", status);
//     console.log("🔍 Redux childCategoriesLoading:", childCategoriesLoading);
//     console.log("🔍 Redux error:", error);
//   }, [
//     parentCategories,
//     currentChildren,
//     currentChildrenParentId,
//     status,
//     error,
//     childCategoriesLoading,
//   ]);

//   // ✅ SIMPLIFIED: Clear loading when Redux fetch completes
//   useEffect(() => {
//     console.log("🔍 Loading state check:", {
//       childCategoriesLoading,
//       currentChildrenParentId,
//       childLoading,
//     });

//     // When Redux finishes loading, clear the local loading for that specific parent
//     if (!childCategoriesLoading && currentChildrenParentId !== null) {
//       console.log(
//         `✅ Clearing loading for parent ${currentChildrenParentId} - Redux fetch complete`
//       );
//       setChildLoading((prev) => ({
//         ...prev,
//         [currentChildrenParentId]: false,
//       }));
//     }
//   }, [childCategoriesLoading, currentChildrenParentId]);

//   // ✅ Additional safety: Clear loading when children data appears
//   useEffect(() => {
//     // Clear loading for the current parent when children arrive
//     if (
//       currentChildren.length > 0 &&
//       currentChildrenParentId &&
//       childLoading[currentChildrenParentId]
//     ) {
//       console.log(
//         `✅ Force clearing loading for parent ${currentChildrenParentId} - children data arrived`
//       );
//       setChildLoading((prev) => ({
//         ...prev,
//         [currentChildrenParentId]: false,
//       }));
//     }
//   }, [currentChildren, currentChildrenParentId, childLoading]);

//   // ✅ Clear loading state when fetch completes with error or success
//   useEffect(() => {
//     if (status === "success" || status === "failed") {
//       // Clear any lingering loading states after a delay to ensure Redux state is updated
//       setTimeout(() => {
//         setChildLoading((prev) => {
//           const hasAnyLoading = Object.values(prev).some((loading) => loading);
//           if (hasAnyLoading) {
//             console.log(
//               "🔄 Clearing all loading states due to status change:",
//               status
//             );
//             return {};
//           }
//           return prev;
//         });
//       }, 100);
//     }
//   }, [status]);

//   // Handle document type selection
//   const handleDocumentTypeChange = (selectedDocTypeId) => {
//     const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
//     setDocumentTypeId(docTypeId);

//     // Clear previous data when changing document type
//     setExpanded({});
//     setShowAddForm({});
//     setNewCategoryName({});
//     setPreviewFiles({});
//     setRightPanelTab("files");
//     setCurrentPreviewFile(null);
//     setCurrentCategoryId(null);
//     setFetchedChildrenFor(new Set());
//     setChildLoading({});
//     setCollapsedCategories({}); // ✅ NEW: Clear collapsed categories

//     // ✅ Clear current children in Redux when changing document type
//     dispatch({ type: "document/clearCurrentChildren" });

//     if (docTypeId) {
//       setLoading(true);
//       // ✅ Dispatch action to fetch parent categories
//       dispatch(getParentCategories(docTypeId))
//         .unwrap()
//         .then(() => {
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Failed to fetch parent categories:", error);
//           setLoading(false);
//         });
//     }
//   };

//   // Handle scanner selection
//   const handleScannerChange = (selectedScannerId) => {
//     const scanId = selectedScannerId ? parseInt(selectedScannerId) : null;
//     setScannerId(scanId);
//   };

//   // ✅ FIXED: Toggle expand function that always refetches children
//   const toggleExpand = (item, level = 0) => {
//     const { id } = item;
//     const isCurrentlyExpanded = expanded[id];

//     if (!isCurrentlyExpanded) {
//       // Collapse all other top-level categories if this is a root category
//       if (level === 0) {
//         setExpanded({});
//       }

//       // ✅ Expand
//       if (level === 0) {
//         setExpanded({ [id]: true });
//       } else {
//         setExpanded((prev) => ({ ...prev, [id]: true }));
//       }

//       // ✅ ALWAYS refetch children data - no caching
//       const currentlyLoading = childLoading[id];

//       console.log(`🔍 Toggle expand for ${id} - ALWAYS refetch:`, {
//         currentlyLoading,
//         willRefetch: !currentlyLoading,
//       });

//       // Only check if currently loading, always refetch otherwise
//       if (!currentlyLoading) {
//         console.log(`🔍 Refetching children for category ${id}`);

//         // Set loading state and track fetch
//         setChildLoading((prev) => ({ ...prev, [id]: true }));
//         setFetchedChildrenFor((prev) => new Set([...prev, id])); // Still track for UI purposes

//         // ✅ Dispatch Redux action to fetch children (always fresh)
//         dispatch(fetchCategoryChilds(id))
//           .unwrap()
//           .then((response) => {
//             console.log(
//               "✅ Children refetched successfully for",
//               id,
//               ":",
//               response
//             );
//             // ✅ Force clear loading immediately after successful fetch
//             setTimeout(() => {
//               setChildLoading((prev) => ({ ...prev, [id]: false }));
//             }, 50);
//           })
//           .catch((error) => {
//             console.error("❌ Failed to refetch children for", id, ":", error);
//             // Clear loading state on error
//             setChildLoading((prev) => ({ ...prev, [id]: false }));
//           });
//       }
//     } else {
//       // Collapse - just update expanded state
//       setExpanded((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   // Toggle Add Input
//   const toggleAddForm = (categoryId) => {
//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     const newShowAddForm = Object.keys(showAddForm).reduce((acc, key) => {
//       acc[key] = false;
//       return acc;
//     }, {});

//     setShowAddForm({
//       ...newShowAddForm,
//       [categoryId]: !showAddForm[categoryId],
//     });

//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
//   };

//   const handleAddCategory = (parentCategoryId = null) => {
//     const categoryName = newCategoryName[parentCategoryId || "root"];

//     if (!categoryName?.trim()) {
//       alert(t("pleaseEnterCategoryName") || "Please enter a category name");
//       return;
//     }

//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     setCreateLoading(true);
//     setCreateError(null);

//     // TODO: Replace with actual API call
//     setTimeout(() => {
//       const newCategory = {
//         id: Date.now(),
//         name: categoryName.trim(),
//         documentTypeId: documentTypeId,
//         parentId: parentCategoryId,
//         children: [],
//       };

//       // TODO: Dispatch action to create category
//       // dispatch(createCategory(newCategory))

//       if (parentCategoryId === null) {
//         // For now, we'll need to refresh parent categories
//         // dispatch(getParentCategories(documentTypeId));
//       } else {
//         // For now, we'll need to refresh children
//         // dispatch(fetchCategoryChilds(parentCategoryId));
//       }

//       setCreateLoading(false);
//       setShowAddForm({});
//       setNewCategoryName({});

//       console.log("Category created:", newCategory);
//       alert(`Category "${categoryName}" created successfully!`);
//     }, 1000);
//   };

//   const handleInputChange = (categoryId, value) => {
//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
//   };

//   // Get file icon based on file type
//   const getFileIcon = (file) => {
//     const fileType = file.type;
//     if (fileType.startsWith("image/")) {
//       return <Image className="w-5 h-5 text-green-600" />;
//     } else if (fileType === "application/pdf") {
//       return <FileText className="w-5 h-5 text-red-600" />;
//     } else if (fileType.includes("document") || fileType.includes("word")) {
//       return <FileText className="w-5 h-5 text-blue-600" />;
//     } else if (fileType.includes("sheet") || fileType.includes("excel")) {
//       return <FileText className="w-5 h-5 text-green-600" />;
//     } else {
//       return <File className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Handle file selection
//   const handleFileSelect = (categoryId, categoryName) => {
//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.multiple = true;
//     fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";

//     fileInput.onchange = (e) => {
//       const files = Array.from(e.target.files);
//       if (files.length === 0) return;

//       const filesWithMetadata = files.map((file) => ({
//         file: file,
//         name: file.name,
//         type: file.type,
//         size: file.size,
//         lastModified: file.lastModified,
//         url: URL.createObjectURL(file),
//       }));

//       setPreviewFiles((prev) => ({
//         ...prev,
//         [categoryId]: {
//           files: filesWithMetadata,
//           categoryName,
//         },
//       }));
//       console.log(
//         `Files selected for category ${categoryId}:`,
//         filesWithMetadata
//       );
//     };

//     fileInput.click();
//   };

//   // Handle file upload after preview
//   const handleUploadConfirmed = (categoryId) => {
//     const previewData = previewFiles[categoryId];
//     if (!previewData || previewData.files.length === 0) return;

//     setUploadLoading((prev) => ({ ...prev, [categoryId]: true }));

//     setTimeout(() => {
//       setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));

//       alert(
//         `Successfully uploaded ${previewData.files.length} file(s) to "${previewData.categoryName}"`
//       );

//       console.log(
//         `Uploaded ${previewData.files.length} file(s) to category ${categoryId}:`,
//         previewData.files
//       );

//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });

//       setPreviewFiles((prev) => {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       });
//     }, 1500);
//   };

//   // Cancel file upload
//   const handleCancelUpload = (categoryId) => {
//     const previewData = previewFiles[categoryId];

//     if (previewData && previewData.files) {
//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });
//     }

//     setPreviewFiles((prev) => {
//       const newPreviewFiles = { ...prev };
//       delete newPreviewFiles[categoryId];
//       return newPreviewFiles;
//     });
//   };

//   // Remove individual file from preview
//   const handleRemoveFile = (categoryId, fileIndex) => {
//     setPreviewFiles((prev) => {
//       const previewData = prev[categoryId];
//       if (!previewData) return prev;

//       const updatedFiles = [...previewData.files];
//       const removedFile = updatedFiles[fileIndex];

//       if (removedFile.url) {
//         URL.revokeObjectURL(removedFile.url);
//       }

//       updatedFiles.splice(fileIndex, 1);

//       if (updatedFiles.length === 0) {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       }

//       return {
//         ...prev,
//         [categoryId]: {
//           ...previewData,
//           files: updatedFiles,
//         },
//       };
//     });
//   };

//   // Show individual file preview - switch to preview tab
//   const handleShowFilePreview = (categoryId, fileData) => {
//     setCurrentPreviewFile(fileData);
//     setCurrentCategoryId(categoryId);
//     setRightPanelTab("preview");
//   };

//   // Go back to files tab
//   const handleBackToFiles = () => {
//     setRightPanelTab("files");
//   };

//   // Download file
//   const handleDownloadFile = (fileData) => {
//     const link = document.createElement("a");
//     link.href = fileData.url;
//     link.download = fileData.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ✅ NEW: Toggle collapse/expand for category sections in Files tab
//   const toggleCategoryCollapse = (categoryId) => {
//     setCollapsedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   // Check if there are any files uploaded
//   const hasAnyFiles = Object.keys(previewFiles).length > 0;
//   const totalFilesCount = Object.values(previewFiles).reduce(
//     (sum, data) => sum + data.files.length,
//     0
//   );

//   // ✅ NEW: State for collapsing/expanding category sections in Files tab
//   const [collapsedCategories, setCollapsedCategories] = useState({});

//   // Render Right Panel with Tabs (Files and Preview)
//   const renderRightPanel = () => {
//     if (!hasAnyFiles) return null;

//     return (
//       <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
//         {/* Tabs Header */}
//         <div className="border-b border-gray-200 bg-gray-50">
//           <nav className="flex">
//             <button
//               onClick={() => setRightPanelTab("files")}
//               className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 rightPanelTab === "files"
//                   ? "border-blue-600 text-blue-600 bg-white"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Upload className="w-4 h-4" />
//                 <span>{t("files") || "Files"}</span>
//                 <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                   {totalFilesCount}
//                 </span>
//               </div>
//             </button>
//             <button
//               onClick={() => setRightPanelTab("preview")}
//               className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 rightPanelTab === "preview"
//                   ? "border-blue-600 text-blue-600 bg-white"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Eye className="w-4 h-4" />
//                 <span>{t("preview") || "Preview"}</span>
//                 {currentPreviewFile && (
//                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//                     1
//                   </span>
//                 )}
//               </div>
//             </button>
//           </nav>
//         </div>

//         {/* Tab Content */}
//         <div className="flex-1 overflow-hidden">
//           {rightPanelTab === "files" ? (
//             // Files Tab Content
//             <div className="h-full overflow-y-auto bg-gray-50">
//               <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {t("uploadedFiles") || "Uploaded Files"}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {totalFilesCount} {t("filesSelected") || "files selected"}
//                 </p>
//               </div>

//               <div className="p-4 space-y-6">
//                 {Object.entries(previewFiles).map(
//                   ([categoryId, previewData]) => {
//                     const isCollapsed = collapsedCategories[categoryId];

//                     return (
//                       <div
//                         key={categoryId}
//                         className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
//                       >
//                         {/* ✅ UPDATED: Clickable Category Header with collapse/expand */}
//                         <div
//                           className="bg-blue-50 border-b border-blue-100 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors"
//                           onClick={() => toggleCategoryCollapse(categoryId)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               {/* ✅ NEW: Collapse/Expand chevron */}
//                               {isCollapsed ? (
//                                 <ChevronRight className="w-4 h-4 text-blue-600" />
//                               ) : (
//                                 <ChevronDown className="w-4 h-4 text-blue-600" />
//                               )}
//                               <Folder className="w-5 h-5 text-blue-600" />
//                               <h4 className="font-semibold text-gray-900">
//                                 {previewData.categoryName}
//                               </h4>
//                               <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                                 {previewData.files.length}
//                               </span>
//                             </div>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation(); // Prevent collapse/expand when clicking X
//                                 handleCancelUpload(categoryId);
//                               }}
//                               disabled={uploadLoading[categoryId]}
//                               className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                               title={t("clearFiles") || "Clear files"}
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>

//                         {/* ✅ UPDATED: Collapsible Files List */}
//                         {!isCollapsed && (
//                           <>
//                             {/* Files List */}
//                             <div className="p-3 space-y-2">
//                               {previewData.files.map((fileData, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                                 >
//                                   <div className="flex items-center gap-2 flex-1 min-w-0">
//                                     {getFileIcon(fileData)}
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-800 truncate">
//                                         {fileData.name}
//                                       </p>
//                                       <p className="text-xs text-gray-500">
//                                         {formatFileSize(fileData.size)}
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <button
//                                       onClick={() =>
//                                         handleShowFilePreview(
//                                           categoryId,
//                                           fileData
//                                         )
//                                       }
//                                       className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                                       title={t("previewFile") || "Preview file"}
//                                     >
//                                       <Eye className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                       onClick={() =>
//                                         handleRemoveFile(categoryId, index)
//                                       }
//                                       disabled={uploadLoading[categoryId]}
//                                       className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                                       title={t("removeFile") || "Remove file"}
//                                     >
//                                       <X className="w-4 h-4" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center gap-2">
//                               {/* Add action buttons if needed */}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     );
//                   }
//                 )}
//               </div>
//             </div>
//           ) : (
//             // Preview Tab Content
//             <div className="h-full flex flex-col bg-white">
//               {currentPreviewFile && currentCategoryId ? (
//                 <>
//                   {/* Preview Header */}
//                   <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex-shrink-0">
//                     <div className="flex items-center justify-between mb-3">
//                       <button
//                         onClick={handleBackToFiles}
//                         className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
//                       >
//                         <ArrowLeft className="w-4 h-4" />
//                         <span>{t("backToFiles") || "Back to Files"}</span>
//                       </button>
//                       <h3 className="text-lg font-bold text-gray-900">
//                         {t("filePreview") || "File Preview"}
//                       </h3>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       {getFileIcon(currentPreviewFile)}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           {currentPreviewFile.name}
//                         </p>
//                         <p className="text-xs text-gray-600 mt-1">
//                           {previewFiles[currentCategoryId]?.categoryName}
//                         </p>
//                         <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                           <span>{formatFileSize(currentPreviewFile.size)}</span>
//                           <span>•</span>
//                           <span>{currentPreviewFile.type}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-3 flex gap-2">
//                       <button
//                         onClick={() => handleDownloadFile(currentPreviewFile)}
//                         className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
//                       >
//                         <Download className="w-4 h-4" />
//                         <span>{t("download") || "Download"}</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Preview Content */}
//                   <div className="flex-1 overflow-auto bg-gray-50 p-4">
//                     {currentPreviewFile.type.startsWith("image/") ? (
//                       <div className="flex justify-center items-start h-full">
//                         <img
//                           src={currentPreviewFile.url}
//                           alt={currentPreviewFile.name}
//                           className="max-w-full h-auto rounded shadow-lg"
//                         />
//                       </div>
//                     ) : currentPreviewFile.type === "application/pdf" ? (
//                       <div className="h-full">
//                         <embed
//                           src={currentPreviewFile.url}
//                           type="application/pdf"
//                           className="w-full h-full min-h-[500px] rounded shadow-lg border border-gray-200"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-lg shadow p-6">
//                         <FileText className="w-16 h-16 text-blue-600 mb-3" />
//                         <h4 className="text-lg font-semibold text-gray-700 mb-2">
//                           {t("previewNotAvailable") || "Preview Not Available"}
//                         </h4>
//                         <p className="text-sm text-gray-500 mb-4">
//                           {t("previewNotAvailableDesc") ||
//                             "This file type cannot be previewed. Please download to view."}
//                         </p>
//                         <div className="text-xs text-gray-600 space-y-1 text-left bg-gray-50 p-3 rounded">
//                           <p>
//                             <span className="font-medium">Type:</span>{" "}
//                             {currentPreviewFile.type}
//                           </p>
//                           <p>
//                             <span className="font-medium">Size:</span>{" "}
//                             {formatFileSize(currentPreviewFile.size)}
//                           </p>
//                           <p>
//                             <span className="font-medium">Modified:</span>{" "}
//                             {new Date(
//                               currentPreviewFile.lastModified
//                             ).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Preview Footer */}
//                   <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
//                     <div className="text-xs text-gray-600">
//                       <p>
//                         <span className="font-medium">
//                           {t("lastModified") || "Last Modified"}:
//                         </span>{" "}
//                         {new Date(
//                           currentPreviewFile.lastModified
//                         ).toLocaleDateString()}{" "}
//                         at{" "}
//                         {new Date(
//                           currentPreviewFile.lastModified
//                         ).toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 // No file selected for preview
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
//                   <Eye className="w-20 h-20 text-gray-300 mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                     {t("noFileSelected") || "No File Selected"}
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     {t("selectFileToPreview") ||
//                       "Select a file from the files tab to preview"}
//                   </p>
//                   <button
//                     onClick={() => setRightPanelTab("files")}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {t("goToFiles") || "Go to Files"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderAddForm = (categoryId) => {
//     if (!showAddForm[categoryId]) return null;

//     return (
//       <tr className="bg-gray-50">
//         <td colSpan={3} className="px-6 py-4">
//           <div className="flex items-center gap-3">
//             <input
//               type="text"
//               value={newCategoryName[categoryId] || ""}
//               onChange={(e) => handleInputChange(categoryId, e.target.value)}
//               placeholder={t("enterCategoryName") || "Enter category name"}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   handleAddCategory(categoryId === "root" ? null : categoryId);
//                 }
//               }}
//               autoFocus
//             />
//             <button
//               onClick={() =>
//                 handleAddCategory(categoryId === "root" ? null : categoryId)
//               }
//               disabled={createLoading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               <span className="text-sm">
//                 {createLoading ? t("adding") || "Adding..." : t("add") || "Add"}
//               </span>
//             </button>
//             <button
//               onClick={() => toggleAddForm(categoryId)}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//             >
//               <span className="text-sm">{t("cancel") || "Cancel"}</span>
//             </button>
//           </div>
//           {createError && (
//             <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="text-sm">{createError}</span>
//               </div>
//             </div>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   // ✅ SIMPLIFIED: Use currentChildren from Redux for always fresh data
//   const renderRows = (items, level = 0) => {
//     return items.flatMap((item) => {
//       const id = item.id;
//       const isOpen = expanded[id];
//       const isUploading = uploadLoading[id];
//       const hasFiles = previewFiles[id];

//       // ✅ SIMPLIFIED: Use Redux childCategoriesLoading and check if this is the current parent
//       const isLoadingChildren =
//         childLoading[id] ||
//         (childCategoriesLoading && currentChildrenParentId === id);
//       const hasBeenFetched = fetchedChildrenFor.has(id);

//       // ✅ SIMPLIFIED: Get children only if this is the current parent being displayed
//       const hasChildren =
//         currentChildrenParentId === id &&
//         Array.isArray(currentChildren) &&
//         currentChildren.length > 0 &&
//         !isLoadingChildren;

//       // ✅ Determine if category can have children
//       const categoryHasChildren =
//         item.hasChildren ||
//         hasChildren ||
//         item.childrenCount > 0 ||
//         item.children?.length > 0 ||
//         true; // Allow all categories to potentially have children

//       console.log(`🔍 Rendering item ${id}:`, {
//         hasChildren,
//         isOpen,
//         isLoadingChildren,
//         hasBeenFetched,
//         currentChildrenParentId,
//         currentChildrenLength: currentChildren?.length || 0,
//         categoryHasChildren,
//       });

//       const rows = [
//         <tr
//           key={id}
//           className={`transition-all duration-200 ${
//             level === 0 ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white"
//           } hover:bg-gray-50`}
//         >
//           <td className="py-4 px-6 whitespace-nowrap text-gray-700" colSpan={2}>
//             <div
//               className="flex items-center gap-3 cursor-pointer select-none"
//               style={{ paddingLeft: `${level * 24}px` }}
//               onClick={() => toggleExpand(item, level)}
//             >
//               {categoryHasChildren ? (
//                 isOpen ? (
//                   <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 )
//               ) : (
//                 <div className="w-4 h-4 flex-shrink-0" />
//               )}

//               {isOpen ? (
//                 <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
//               ) : (
//                 <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
//               )}

//               <span className="font-medium text-sm">{item.name}</span>

//               {hasFiles && (
//                 <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                   {previewFiles[id].files.length} files
//                 </span>
//               )}
//             </div>
//           </td>
//           <td className="py-4 px-6 whitespace-nowrap text-right">
//             <div className="flex items-center gap-2 justify-end">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   alert(t("scanInitiated") || "Scan initiated!");
//                 }}
//                 disabled={!documentTypeId || isUploading || !scannerId}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !scannerId
//                     ? t("selectScannerFirst") || "Please select a scanner first"
//                     : !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Scan to ${item.name}`
//                 }
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 <span className="text-sm">{t("scan") || "Scan"}</span>
//               </button>
//               {/* Upload Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleFileSelect(id, item.name);
//                 }}
//                 disabled={!documentTypeId || isUploading}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Upload files to ${item.name}`
//                 }
//               >
//                 <Upload className="w-4 h-4" />
//                 <span className="text-sm">{t("uploadFiles") || "Upload"}</span>
//               </button>

//               {/* Add Child Category Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleAddForm(id);
//                 }}
//                 disabled={!documentTypeId}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Add child category to ${item.name}`
//                 }
//               >
//                 <Plus className="w-4 h-4" />
//                 <span className="text-sm">{t("addChild") || "Add"}</span>
//               </button>
//             </div>
//           </td>
//         </tr>,
//       ];

//       // Add form row if shown
//       if (showAddForm[id]) {
//         rows.push(renderAddForm(id));
//       }

//       // ✅ SIMPLIFIED: Render children or loading state for current parent only
//       if (isOpen) {
//         if (isLoadingChildren) {
//           // Show loading state only while actually loading
//           rows.push(
//             <tr key={`loading-${id}`} className="bg-gray-50">
//               <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                 <div
//                   className="flex items-center justify-center gap-2"
//                   style={{ paddingLeft: `${(level + 1) * 24}px` }}
//                 >
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   <span className="text-sm">
//                     {t("loadingChildren") || "Loading children..."}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         } else if (hasChildren) {
//           // ✅ Use currentChildren from Redux (always fresh)

//           rows.push(...renderRows(currentChildren, level + 1));
//         } else if (hasBeenFetched && !isLoadingChildren) {
//           // Show empty message only if we've fetched and got no results
//           rows.push(
//             <tr key={`empty-${id}`} className="bg-gray-50">
//               <td
//                 colSpan={3}
//                 className="px-6 py-4 text-center text-gray-500 italic"
//               >
//                 <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
//                   <span className="text-sm">
//                     {t("noChildCategories") || "No child categories"}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         }
//       }

//       return rows;
//     });
//   };

//   const renderEmptyState = () => {
//     if (!documentTypeId) {
//       return (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <Folder className="w-16 h-16 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             {t("noDocTypeSelected") || "No Document Type Selected"}
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {t("selectDocTypeFromDropdown") ||
//               "Please select a document type from the dropdown above"}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-16">
//         <div className="text-gray-400 mb-4">
//           <Folder className="w-16 h-16 mx-auto" />
//         </div>
//         <h3 className="text-lg font-medium text-gray-600 mb-2">
//           {t("noCategoriesFound") || "No Categories Found"}
//         </h3>
//         <p className="text-gray-500 mb-6">
//           {t("getStartedCreating") ||
//             "Get started by creating your first category"}
//         </p>
//       </div>
//     );
//   };

//   // ✅ Loading state - only show spinner if no data AND initial loading
//   if (
//     (loading && !parentCategories?.length) ||
//     (status === "loading" && !parentCategories?.length)
//   ) {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">
//               {t("loadingCategories") || "Loading categories..."}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ✅ Error state
//   if (status === "failed") {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="text-red-500 mb-4">
//               <svg
//                 className="w-16 h-16 mx-auto"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-600 mb-2">
//               {t("errorLoadingCategories") || "Error Loading Categories"}
//             </h3>
//             <p className="text-gray-500 mb-6">
//               {error ||
//                 t("somethingWentWrong") ||
//                 "Something went wrong. Please try again."}
//             </p>
//             <button
//               onClick={() => {
//                 if (documentTypeId) {
//                   dispatch(getParentCategories(documentTypeId));
//                 }
//               }}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
//             >
//               {t("retry") || "Retry"}
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }
//   return (
//     <>
//       <section>
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header with Document Type Selector */}
//           <div className="px-2 py-5 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {t("categories") || "Categories"}
//                 </h2>
//                 {documentTypeId && (
//                   <p className="text-gray-600 text-sm mt-1">
//                     {t("manageCategories") ||
//                       "Manage categories for selected document type"}
//                     {hasAnyFiles && (
//                       <span className="ml-2 text-blue-600 font-medium">
//                         • {totalFilesCount}{" "}
//                         {t("filesSelected") || "files selected"}
//                       </span>
//                     )}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//                 {/* Scanners Selector */}
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                   <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
//                     {t("scanner") || "Scanner"}:
//                   </label>
//                   <select
//                     value={scannerId || ""}
//                     onChange={(e) => handleScannerChange(e.target.value)}
//                     className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
//                   >
//                     <option value="" className="text-sm">
//                       {t("selectScanner") || "Select Scanner"}
//                     </option>
//                     {staticScanners.map((scanner) => (
//                       <option
//                         key={scanner.id}
//                         value={scanner.id}
//                         className="text-sm"
//                       >
//                         {scanner.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Add Root Category Button */}
//                 <button
//                   onClick={() => toggleAddForm("root")}
//                   disabled={!documentTypeId}
//                   className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
//                   title={
//                     !documentTypeId
//                       ? t("selectDocTypeFirst") ||
//                         "Please select a document type first"
//                       : t("addRootCategory") || "Add Root Category"
//                   }
//                 >
//                   <Plus className="w-5 h-5" />
//                   <span className="text-sm">
//                     {t("addRootCategory") || "Add Root"}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Content - 2-Column Layout with Tabs on Right */}
//           <div className="min-h-[600px]">
//             <div className="flex">
//               {/* Left Side - Categories Table */}
//               <div
//                 className={`${
//                   hasAnyFiles ? "w-1/2" : "w-full"
//                 } transition-all duration-300 overflow-x-auto ${
//                   hasAnyFiles ? "border-r border-gray-200" : ""
//                 }`}
//               >
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50 sticky top-0 z-10">
//                     <tr>
//                       <th
//                         scope="col"
//                         colSpan={2}
//                         className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {t("categoryName") || "Category Name"}
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-1 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {t("actions") || "Actions"}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {showAddForm["root"] && renderAddForm("root")}

//                     {(() => {
//                       if (
//                         documentTypeId &&
//                         parentCategories &&
//                         parentCategories.length > 0
//                       ) {
//                         return renderRows(parentCategories);
//                       } else {
//                         return (
//                           <tr>
//                             <td colSpan={3} className="p-0">
//                               {renderEmptyState()}
//                             </td>
//                           </tr>
//                         );
//                       }
//                     })()}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Right Side - Tabbed Panel (Files / Preview) */}
//               {renderRightPanel()}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// DocumentCategoryTable.defaultProps = {
//   currentDocTypeId: null,
//   docTypesList: [],
// };

// export default React.memo(DocumentCategoryTable);

// /* eslint-disable react/prop-types */
// import React, { useEffect, useState, useMemo } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Plus,
//   Folder,
//   FolderOpen,
//   Upload,
//   X,
//   Eye,
//   FileText,
//   Image,
//   File,
//   ArrowLeft,
//   Download,
//   ChevronRight,
//   ChevronDown,
//   ChevronLeft,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCategoryChilds,
//   getParentCategories,
// } from "../documentViewerThunk";

// const DocumentCategoryTable = ({ currentDocTypeId, docTypesList }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   // ✅ Get data from Redux store - always fresh children data
//   const {
//     parentCategories,
//     currentChildren,
//     currentChildrenParentId,
//     status,
//     error,
//     childCategoriesLoading,
//   } = useSelector((state) => {
//     console.log("🔍 Full Redux state:", state);
//     console.log("🔍 documentViewerReducer state:", state.documentViewerReducer);
//     return state.documentViewerReducer;
//   });

//   // ✅ Use docTypesList prop
//   const docTypes = docTypesList || [];

//   const staticScanners = [
//     { id: 1, name: "HP ScanJet Pro 3000" },
//     { id: 2, name: "Canon imageFORMULA DR-C225" },
//     { id: 3, name: "Epson WorkForce ES-500W" },
//     { id: 4, name: "Fujitsu ScanSnap iX1600" },
//     { id: 5, name: "Brother ADS-2700W" },
//   ];

//   // Local state
//   const [documentTypeId, setDocumentTypeId] = useState(
//     currentDocTypeId || null
//   );
//   const [scannerId, setScannerId] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [showAddForm, setShowAddForm] = useState({});
//   const [newCategoryName, setNewCategoryName] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [childLoading, setChildLoading] = useState({});
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState({});
//   const [previewFiles, setPreviewFiles] = useState({});

//   // Right panel state
//   const [rightPanelTab, setRightPanelTab] = useState("files");
//   const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
//   const [currentCategoryId, setCurrentCategoryId] = useState(null);

//   // ✅ Track which categories we've fetched children for (for UI purposes)
//   const [fetchedChildrenFor, setFetchedChildrenFor] = useState(new Set());

//   // ✅ NEW: Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [collapsedCategories, setCollapsedCategories] = useState({});

//   // ✅ Pagination calculations
//   const { paginatedCategories, totalPages, startIndex, endIndex } = useMemo(() => {
//     if (!parentCategories || parentCategories.length === 0) {
//       return {
//         paginatedCategories: [],
//         totalPages: 0,
//         startIndex: 0,
//         endIndex: 0,
//       };
//     }

//     const totalItems = parentCategories.length;
//     const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
//     const startIdx = (currentPage - 1) * itemsPerPage;
//     const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

//     const paginated = parentCategories.slice(startIdx, endIdx);

//     return {
//       paginatedCategories: paginated,
//       totalPages: totalPagesCount,
//       startIndex: startIdx + 1,
//       endIndex: endIdx,
//     };
//   }, [parentCategories, currentPage, itemsPerPage]);

//   // ✅ Reset pagination when document type changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [documentTypeId]);

//   // ✅ Update when props change or Redux state changes
//   useEffect(() => {
//     console.log("CategoryTable received currentDocTypeId:", currentDocTypeId);
//     console.log("CategoryTable received docTypesList:", docTypesList);

//     if (currentDocTypeId) {
//       setDocumentTypeId(currentDocTypeId);
//       handleDocumentTypeChange(currentDocTypeId.toString());
//     }
//   }, [currentDocTypeId, docTypesList]);

//   // ✅ Debug Redux state changes
//   useEffect(() => {
//     console.log("🔍 Redux parentCategories changed:", parentCategories);
//     console.log("🔍 Redux currentChildren changed:", currentChildren);
//     console.log(
//       "🔍 Redux currentChildrenParentId changed:",
//       currentChildrenParentId
//     );
//     console.log("🔍 Redux status:", status);
//     console.log("🔍 Redux childCategoriesLoading:", childCategoriesLoading);
//     console.log("🔍 Redux error:", error);
//   }, [
//     parentCategories,
//     currentChildren,
//     currentChildrenParentId,
//     status,
//     error,
//     childCategoriesLoading,
//   ]);

//   // ✅ SIMPLIFIED: Clear loading when Redux fetch completes
//   useEffect(() => {
//     console.log("🔍 Loading state check:", {
//       childCategoriesLoading,
//       currentChildrenParentId,
//       childLoading,
//     });

//     // When Redux finishes loading, clear the local loading for that specific parent
//     if (!childCategoriesLoading && currentChildrenParentId !== null) {
//       console.log(
//         `✅ Clearing loading for parent ${currentChildrenParentId} - Redux fetch complete`
//       );
//       setChildLoading((prev) => ({
//         ...prev,
//         [currentChildrenParentId]: false,
//       }));
//     }
//   }, [childCategoriesLoading, currentChildrenParentId]);

//   // ✅ Additional safety: Clear loading when children data appears
//   useEffect(() => {
//     // Clear loading for the current parent when children arrive
//     if (
//       currentChildren.length > 0 &&
//       currentChildrenParentId &&
//       childLoading[currentChildrenParentId]
//     ) {
//       console.log(
//         `✅ Force clearing loading for parent ${currentChildrenParentId} - children data arrived`
//       );
//       setChildLoading((prev) => ({
//         ...prev,
//         [currentChildrenParentId]: false,
//       }));
//     }
//   }, [currentChildren, currentChildrenParentId, childLoading]);

//   // ✅ Clear loading state when fetch completes with error or success
//   useEffect(() => {
//     if (status === "success" || status === "failed") {
//       // Clear any lingering loading states after a delay to ensure Redux state is updated
//       setTimeout(() => {
//         setChildLoading((prev) => {
//           const hasAnyLoading = Object.values(prev).some((loading) => loading);
//           if (hasAnyLoading) {
//             console.log(
//               "🔄 Clearing all loading states due to status change:",
//               status
//             );
//             return {};
//           }
//           return prev;
//         });
//       }, 100);
//     }
//   }, [status]);

//   // Handle document type selection
//   const handleDocumentTypeChange = (selectedDocTypeId) => {
//     const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
//     setDocumentTypeId(docTypeId);

//     // Clear previous data when changing document type
//     setExpanded({});
//     setShowAddForm({});
//     setNewCategoryName({});
//     setPreviewFiles({});
//     setRightPanelTab("files");
//     setCurrentPreviewFile(null);
//     setCurrentCategoryId(null);
//     setFetchedChildrenFor(new Set());
//     setChildLoading({});
//     setCollapsedCategories({});
//     setCurrentPage(1); // ✅ Reset pagination

//     // ✅ Clear current children in Redux when changing document type
//     dispatch({ type: "document/clearCurrentChildren" });

//     if (docTypeId) {
//       setLoading(true);
//       // ✅ Dispatch action to fetch parent categories
//       dispatch(getParentCategories(docTypeId))
//         .unwrap()
//         .then(() => {
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Failed to fetch parent categories:", error);
//           setLoading(false);
//         });
//     }
//   };

//   // Handle scanner selection
//   const handleScannerChange = (selectedScannerId) => {
//     const scanId = selectedScannerId ? parseInt(selectedScannerId) : null;
//     setScannerId(scanId);
//   };

//   // ✅ NEW: Pagination handlers
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleItemsPerPageChange = (newItemsPerPage) => {
//     setItemsPerPage(parseInt(newItemsPerPage));
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   // ✅ Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const delta = 2; // Show 2 pages before and after current page
//     const range = [];
//     const rangeWithDots = [];

//     for (
//       let i = Math.max(2, currentPage - delta);
//       i <= Math.min(totalPages - 1, currentPage + delta);
//       i++
//     ) {
//       range.push(i);
//     }

//     if (currentPage - delta > 2) {
//       rangeWithDots.push(1, "...");
//     } else {
//       rangeWithDots.push(1);
//     }

//     rangeWithDots.push(...range);

//     if (currentPage + delta < totalPages - 1) {
//       rangeWithDots.push("...", totalPages);
//     } else {
//       if (totalPages > 1) rangeWithDots.push(totalPages);
//     }

//     return rangeWithDots;
//   };

//   // ✅ FIXED: Toggle expand function that always refetches children
//   const toggleExpand = (item, level = 0) => {
//     const { id } = item;
//     const isCurrentlyExpanded = expanded[id];

//     if (!isCurrentlyExpanded) {
//       // Collapse all other top-level categories if this is a root category
//       if (level === 0) {
//         setExpanded({});
//       }

//       // ✅ Expand
//       if (level === 0) {
//         setExpanded({ [id]: true });
//       } else {
//         setExpanded((prev) => ({ ...prev, [id]: true }));
//       }

//       // ✅ ALWAYS refetch children data - no caching
//       const currentlyLoading = childLoading[id];

//       console.log(`🔍 Toggle expand for ${id} - ALWAYS refetch:`, {
//         currentlyLoading,
//         willRefetch: !currentlyLoading,
//       });

//       // Only check if currently loading, always refetch otherwise
//       if (!currentlyLoading) {
//         console.log(`🔍 Refetching children for category ${id}`);

//         // Set loading state and track fetch
//         setChildLoading((prev) => ({ ...prev, [id]: true }));
//         setFetchedChildrenFor((prev) => new Set([...prev, id])); // Still track for UI purposes

//         // ✅ Dispatch Redux action to fetch children (always fresh)
//         dispatch(fetchCategoryChilds(id))
//           .unwrap()
//           .then((response) => {
//             console.log(
//               "✅ Children refetched successfully for",
//               id,
//               ":",
//               response
//             );
//             // ✅ Force clear loading immediately after successful fetch
//             setTimeout(() => {
//               setChildLoading((prev) => ({ ...prev, [id]: false }));
//             }, 50);
//           })
//           .catch((error) => {
//             console.error("❌ Failed to refetch children for", id, ":", error);
//             // Clear loading state on error
//             setChildLoading((prev) => ({ ...prev, [id]: false }));
//           });
//       }
//     } else {
//       // Collapse - just update expanded state
//       setExpanded((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   // Toggle Add Input
//   const toggleAddForm = (categoryId) => {
//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     const newShowAddForm = Object.keys(showAddForm).reduce((acc, key) => {
//       acc[key] = false;
//       return acc;
//     }, {});

//     setShowAddForm({
//       ...newShowAddForm,
//       [categoryId]: !showAddForm[categoryId],
//     });

//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
//   };

//   const handleAddCategory = (parentCategoryId = null) => {
//     const categoryName = newCategoryName[parentCategoryId || "root"];

//     if (!categoryName?.trim()) {
//       alert(t("pleaseEnterCategoryName") || "Please enter a category name");
//       return;
//     }

//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     setCreateLoading(true);
//     setCreateError(null);

//     // TODO: Replace with actual API call
//     setTimeout(() => {
//       const newCategory = {
//         id: Date.now(),
//         name: categoryName.trim(),
//         documentTypeId: documentTypeId,
//         parentId: parentCategoryId,
//         children: [],
//       };

//       // TODO: Dispatch action to create category
//       // dispatch(createCategory(newCategory))

//       if (parentCategoryId === null) {
//         // For now, we'll need to refresh parent categories
//         // dispatch(getParentCategories(documentTypeId));
//       } else {
//         // For now, we'll need to refresh children
//         // dispatch(fetchCategoryChilds(parentCategoryId));
//       }

//       setCreateLoading(false);
//       setShowAddForm({});
//       setNewCategoryName({});

//       console.log("Category created:", newCategory);
//       alert(`Category "${categoryName}" created successfully!`);
//     }, 1000);
//   };

//   const handleInputChange = (categoryId, value) => {
//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
//   };

//   // Get file icon based on file type
//   const getFileIcon = (file) => {
//     const fileType = file.type;
//     if (fileType.startsWith("image/")) {
//       return <Image className="w-5 h-5 text-green-600" />;
//     } else if (fileType === "application/pdf") {
//       return <FileText className="w-5 h-5 text-red-600" />;
//     } else if (fileType.includes("document") || fileType.includes("word")) {
//       return <FileText className="w-5 h-5 text-blue-600" />;
//     } else if (fileType.includes("sheet") || fileType.includes("excel")) {
//       return <FileText className="w-5 h-5 text-green-600" />;
//     } else {
//       return <File className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Handle file selection
//   const handleFileSelect = (categoryId, categoryName) => {
//     if (!documentTypeId) {
//       alert(t("selectDocTypeFirst") || "Please select a document type first");
//       return;
//     }

//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.multiple = true;
//     fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";

//     fileInput.onchange = (e) => {
//       const files = Array.from(e.target.files);
//       if (files.length === 0) return;

//       const filesWithMetadata = files.map((file) => ({
//         file: file,
//         name: file.name,
//         type: file.type,
//         size: file.size,
//         lastModified: file.lastModified,
//         url: URL.createObjectURL(file),
//       }));

//       setPreviewFiles((prev) => ({
//         ...prev,
//         [categoryId]: {
//           files: filesWithMetadata,
//           categoryName,
//         },
//       }));
//       console.log(
//         `Files selected for category ${categoryId}:`,
//         filesWithMetadata
//       );
//     };

//     fileInput.click();
//   };

//   // Handle file upload after preview
//   const handleUploadConfirmed = (categoryId) => {
//     const previewData = previewFiles[categoryId];
//     if (!previewData || previewData.files.length === 0) return;

//     setUploadLoading((prev) => ({ ...prev, [categoryId]: true }));

//     setTimeout(() => {
//       setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));

//       alert(
//         `Successfully uploaded ${previewData.files.length} file(s) to "${previewData.categoryName}"`
//       );

//       console.log(
//         `Uploaded ${previewData.files.length} file(s) to category ${categoryId}:`,
//         previewData.files
//       );

//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });

//       setPreviewFiles((prev) => {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       });
//     }, 1500);
//   };

//   // Cancel file upload
//   const handleCancelUpload = (categoryId) => {
//     const previewData = previewFiles[categoryId];

//     if (previewData && previewData.files) {
//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });
//     }

//     setPreviewFiles((prev) => {
//       const newPreviewFiles = { ...prev };
//       delete newPreviewFiles[categoryId];
//       return newPreviewFiles;
//     });
//   };

//   // Remove individual file from preview
//   const handleRemoveFile = (categoryId, fileIndex) => {
//     setPreviewFiles((prev) => {
//       const previewData = prev[categoryId];
//       if (!previewData) return prev;

//       const updatedFiles = [...previewData.files];
//       const removedFile = updatedFiles[fileIndex];

//       if (removedFile.url) {
//         URL.revokeObjectURL(removedFile.url);
//       }

//       updatedFiles.splice(fileIndex, 1);

//       if (updatedFiles.length === 0) {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       }

//       return {
//         ...prev,
//         [categoryId]: {
//           ...previewData,
//           files: updatedFiles,
//         },
//       };
//     });
//   };

//   // Show individual file preview - switch to preview tab
//   const handleShowFilePreview = (categoryId, fileData) => {
//     setCurrentPreviewFile(fileData);
//     setCurrentCategoryId(categoryId);
//     setRightPanelTab("preview");
//   };

//   // Go back to files tab
//   const handleBackToFiles = () => {
//     setRightPanelTab("files");
//   };

//   // Download file
//   const handleDownloadFile = (fileData) => {
//     const link = document.createElement("a");
//     link.href = fileData.url;
//     link.download = fileData.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ✅ NEW: Toggle collapse/expand for category sections in Files tab
//   const toggleCategoryCollapse = (categoryId) => {
//     setCollapsedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   // Check if there are any files uploaded
//   const hasAnyFiles = Object.keys(previewFiles).length > 0;
//   const totalFilesCount = Object.values(previewFiles).reduce(
//     (sum, data) => sum + data.files.length,
//     0
//   );

//   // Render Right Panel with Tabs (Files and Preview)
//   const renderRightPanel = () => {
//     if (!hasAnyFiles) return null;

//     return (
//       <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
//         {/* Tabs Header */}
//         <div className="border-b border-gray-200 bg-gray-50">
//           <nav className="flex">
//             <button
//               onClick={() => setRightPanelTab("files")}
//               className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 rightPanelTab === "files"
//                   ? "border-blue-600 text-blue-600 bg-white"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Upload className="w-4 h-4" />
//                 <span>{t("files") || "Files"}</span>
//                 <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                   {totalFilesCount}
//                 </span>
//               </div>
//             </button>
//             <button
//               onClick={() => setRightPanelTab("preview")}
//               className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 rightPanelTab === "preview"
//                   ? "border-blue-600 text-blue-600 bg-white"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Eye className="w-4 h-4" />
//                 <span>{t("preview") || "Preview"}</span>
//                 {currentPreviewFile && (
//                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//                     1
//                   </span>
//                 )}
//               </div>
//             </button>
//           </nav>
//         </div>

//         {/* Tab Content */}
//         <div className="flex-1 overflow-hidden">
//           {rightPanelTab === "files" ? (
//             // Files Tab Content
//             <div className="h-full overflow-y-auto bg-gray-50">
//               <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {t("uploadedFiles") || "Uploaded Files"}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {totalFilesCount} {t("filesSelected") || "files selected"}
//                 </p>
//               </div>

//               <div className="p-4 space-y-6">
//                 {Object.entries(previewFiles).map(
//                   ([categoryId, previewData]) => {
//                     const isCollapsed = collapsedCategories[categoryId];

//                     return (
//                       <div
//                         key={categoryId}
//                         className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
//                       >
//                         {/* ✅ UPDATED: Clickable Category Header with collapse/expand */}
//                         <div
//                           className="bg-blue-50 border-b border-blue-100 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors"
//                           onClick={() => toggleCategoryCollapse(categoryId)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               {/* ✅ NEW: Collapse/Expand chevron */}
//                               {isCollapsed ? (
//                                 <ChevronRight className="w-4 h-4 text-blue-600" />
//                               ) : (
//                                 <ChevronDown className="w-4 h-4 text-blue-600" />
//                               )}
//                               <Folder className="w-5 h-5 text-blue-600" />
//                               <h4 className="font-semibold text-gray-900">
//                                 {previewData.categoryName}
//                               </h4>
//                               <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                                 {previewData.files.length}
//                               </span>
//                             </div>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation(); // Prevent collapse/expand when clicking X
//                                 handleCancelUpload(categoryId);
//                               }}
//                               disabled={uploadLoading[categoryId]}
//                               className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                               title={t("clearFiles") || "Clear files"}
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>

//                         {/* ✅ UPDATED: Collapsible Files List */}
//                         {!isCollapsed && (
//                           <>
//                             {/* Files List */}
//                             <div className="p-3 space-y-2">
//                               {previewData.files.map((fileData, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                                 >
//                                   <div className="flex items-center gap-2 flex-1 min-w-0">
//                                     {getFileIcon(fileData)}
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-800 truncate">
//                                         {fileData.name}
//                                       </p>
//                                       <p className="text-xs text-gray-500">
//                                         {formatFileSize(fileData.size)}
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <button
//                                       onClick={() =>
//                                         handleShowFilePreview(
//                                           categoryId,
//                                           fileData
//                                         )
//                                       }
//                                       className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                                       title={t("previewFile") || "Preview file"}
//                                     >
//                                       <Eye className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                       onClick={() =>
//                                         handleRemoveFile(categoryId, index)
//                                       }
//                                       disabled={uploadLoading[categoryId]}
//                                       className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
//                                       title={t("removeFile") || "Remove file"}
//                                     >
//                                       <X className="w-4 h-4" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center gap-2">
//                               {/* Add action buttons if needed */}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     );
//                   }
//                 )}
//               </div>
//             </div>
//           ) : (
//             // Preview Tab Content
//             <div className="h-full flex flex-col bg-white">
//               {currentPreviewFile && currentCategoryId ? (
//                 <>
//                   {/* Preview Header */}
//                   <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex-shrink-0">
//                     <div className="flex items-center justify-between mb-3">
//                       <button
//                         onClick={handleBackToFiles}
//                         className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
//                       >
//                         <ArrowLeft className="w-4 h-4" />
//                         <span>{t("backToFiles") || "Back to Files"}</span>
//                       </button>
//                       <h3 className="text-lg font-bold text-gray-900">
//                         {t("filePreview") || "File Preview"}
//                       </h3>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       {getFileIcon(currentPreviewFile)}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           {currentPreviewFile.name}
//                         </p>
//                         <p className="text-xs text-gray-600 mt-1">
//                           {previewFiles[currentCategoryId]?.categoryName}
//                         </p>
//                         <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                           <span>{formatFileSize(currentPreviewFile.size)}</span>
//                           <span>•</span>
//                           <span>{currentPreviewFile.type}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-3 flex gap-2">
//                       <button
//                         onClick={() => handleDownloadFile(currentPreviewFile)}
//                         className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
//                       >
//                         <Download className="w-4 h-4" />
//                         <span>{t("download") || "Download"}</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Preview Content */}
//                   <div className="flex-1 overflow-auto bg-gray-50 p-4">
//                     {currentPreviewFile.type.startsWith("image/") ? (
//                       <div className="flex justify-center items-start h-full">
//                         <img
//                           src={currentPreviewFile.url}
//                           alt={currentPreviewFile.name}
//                           className="max-w-full h-auto rounded shadow-lg"
//                         />
//                       </div>
//                     ) : currentPreviewFile.type === "application/pdf" ? (
//                       <div className="h-full">
//                         <embed
//                           src={currentPreviewFile.url}
//                           type="application/pdf"
//                           className="w-full h-full min-h-[500px] rounded shadow-lg border border-gray-200"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-lg shadow p-6">
//                         <FileText className="w-16 h-16 text-blue-600 mb-3" />
//                         <h4 className="text-lg font-semibold text-gray-700 mb-2">
//                           {t("previewNotAvailable") || "Preview Not Available"}
//                         </h4>
//                         <p className="text-sm text-gray-500 mb-4">
//                           {t("previewNotAvailableDesc") ||
//                             "This file type cannot be previewed. Please download to view."}
//                         </p>
//                         <div className="text-xs text-gray-600 space-y-1 text-left bg-gray-50 p-3 rounded">
//                           <p>
//                             <span className="font-medium">Type:</span>{" "}
//                             {currentPreviewFile.type}
//                           </p>
//                           <p>
//                             <span className="font-medium">Size:</span>{" "}
//                             {formatFileSize(currentPreviewFile.size)}
//                           </p>
//                           <p>
//                             <span className="font-medium">Modified:</span>{" "}
//                             {new Date(
//                               currentPreviewFile.lastModified
//                             ).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Preview Footer */}
//                   <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
//                     <div className="text-xs text-gray-600">
//                       <p>
//                         <span className="font-medium">
//                           {t("lastModified") || "Last Modified"}:
//                         </span>{" "}
//                         {new Date(
//                           currentPreviewFile.lastModified
//                         ).toLocaleDateString()}{" "}
//                         at{" "}
//                         {new Date(
//                           currentPreviewFile.lastModified
//                         ).toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 // No file selected for preview
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
//                   <Eye className="w-20 h-20 text-gray-300 mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                     {t("noFileSelected") || "No File Selected"}
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     {t("selectFileToPreview") ||
//                       "Select a file from the files tab to preview"}
//                   </p>
//                   <button
//                     onClick={() => setRightPanelTab("files")}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {t("goToFiles") || "Go to Files"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderAddForm = (categoryId) => {
//     if (!showAddForm[categoryId]) return null;

//   };

//   // ✅ SIMPLIFIED: Use currentChildren from Redux for always fresh data
//   const renderRows = (items, level = 0) => {
//     return items.flatMap((item) => {
//       const id = item.id;
//       const isOpen = expanded[id];
//       const isUploading = uploadLoading[id];
//       const hasFiles = previewFiles[id];

//       // ✅ SIMPLIFIED: Use Redux childCategoriesLoading and check if this is the current parent
//       const isLoadingChildren =
//         childLoading[id] ||
//         (childCategoriesLoading && currentChildrenParentId === id);
//       const hasBeenFetched = fetchedChildrenFor.has(id);

//       // ✅ SIMPLIFIED: Get children only if this is the current parent being displayed
//       const hasChildren =
//         currentChildrenParentId === id &&
//         Array.isArray(currentChildren) &&
//         currentChildren.length > 0 &&
//         !isLoadingChildren;

//       // ✅ Determine if category can have children
//       const categoryHasChildren =
//         item.hasChildren ||
//         hasChildren ||
//         item.childrenCount > 0 ||
//         item.children?.length > 0 ||
//         true; // Allow all categories to potentially have children

//       console.log(`🔍 Rendering item ${id}:`, {
//         hasChildren,
//         isOpen,
//         isLoadingChildren,
//         hasBeenFetched,
//         currentChildrenParentId,
//         currentChildrenLength: currentChildren?.length || 0,
//         categoryHasChildren,
//       });

//       const rows = [
//         <tr
//           key={id}
//           className={`transition-all duration-200 ${
//             level === 0 ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white"
//           } hover:bg-gray-50`}
//         >
//           <td className="py-4 px-6 whitespace-nowrap text-gray-700" colSpan={2}>
//             <div
//               className="flex items-center gap-3 cursor-pointer select-none"
//               style={{ paddingLeft: `${level * 24}px` }}
//               onClick={() => toggleExpand(item, level)}
//             >
//               {categoryHasChildren ? (
//                 isOpen ? (
//                   <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 )
//               ) : (
//                 <div className="w-4 h-4 flex-shrink-0" />
//               )}

//               {isOpen ? (
//                 <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
//               ) : (
//                 <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
//               )}

//               <span className="font-medium text-sm">{item.name}</span>

//               {hasFiles && (
//                 <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                   {previewFiles[id].files.length} files
//                 </span>
//               )}
//             </div>
//           </td>
//           <td className="py-4 px-6 whitespace-nowrap text-right">
//             <div className="flex items-center gap-2 justify-end">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   alert(t("scanInitiated") || "Scan initiated!");
//                 }}
//                 disabled={!documentTypeId || isUploading || !scannerId}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !scannerId
//                     ? t("selectScannerFirst") || "Please select a scanner first"
//                     : !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Scan to ${item.name}`
//                 }
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//                 <span className="text-sm">{t("scan") || "Scan"}</span>
//               </button>
//               {/* Upload Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleFileSelect(id, item.name);
//                 }}
//                 disabled={!documentTypeId || isUploading}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") ||
//                       "Please select a document type first"
//                     : `Upload files to ${item.name}`
//                 }
//               >
//                 <Upload className="w-4 h-4" />
//                 <span className="text-sm">{t("uploadFiles") || "Upload"}</span>
//               </button>

//               {/* Add Child Category Button */}

//             </div>
//           </td>
//         </tr>,
//       ];

//       // Add form row if shown
//       if (showAddForm[id]) {
//         rows.push(renderAddForm(id));
//       }

//       // ✅ SIMPLIFIED: Render children or loading state for current parent only
//       if (isOpen) {
//         if (isLoadingChildren) {
//           // Show loading state only while actually loading
//           rows.push(
//             <tr key={`loading-${id}`} className="bg-gray-50">
//               <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                 <div
//                   className="flex items-center justify-center gap-2"
//                   style={{ paddingLeft: `${(level + 1) * 24}px` }}
//                 >
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   <span className="text-sm">
//                     {t("loadingChildren") || "Loading children..."}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         } else if (hasChildren) {
//           // ✅ Use currentChildren from Redux (always fresh)
//           rows.push(...renderRows(currentChildren, level + 1));
//         } else if (hasBeenFetched && !isLoadingChildren) {
//           // Show empty message only if we've fetched and got no results
//           rows.push(
//             <tr key={`empty-${id}`} className="bg-gray-50">
//               <td
//                 colSpan={3}
//                 className="px-6 py-4 text-center text-gray-500 italic"
//               >
//                 <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
//                   <span className="text-sm">
//                     {t("noChildCategories") || "No child categories"}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         }
//       }

//       return rows;
//     });
//   };

//   const renderEmptyState = () => {
//     if (!documentTypeId) {
//       return (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <Folder className="w-16 h-16 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             {t("noDocTypeSelected") || "No Document Type Selected"}
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {t("selectDocTypeFromDropdown") ||
//               "Please select a document type from the dropdown above"}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-16">
//         <div className="text-gray-400 mb-4">
//           <Folder className="w-16 h-16 mx-auto" />
//         </div>
//         <h3 className="text-lg font-medium text-gray-600 mb-2">
//           {t("No Categories Found")  }
//         </h3>
//         <p className="text-gray-500 mb-6">
//           {t("getStartedCreating") ||
//             "Get started by creating your first category"}
//         </p>
//       </div>
//     );
//   };

//   // ✅ NEW: Pagination Component
//   const renderPagination = () => {
//     if (!parentCategories || parentCategories.length <= itemsPerPage) {
//       return null;
//     }

//     const pageNumbers = getPageNumbers();

//     return (
//       <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
//         {/* Results Info */}
//         <div className="flex-1 flex items-center justify-between">
//           {/* <div className="text-sm text-gray-700">
//             {t("showing") || "Showing"}{" "}
//             <span className="font-medium">{startIndex}</span> {t("to") || "to"}{" "}
//             <span className="font-medium">{endIndex}</span> {t("of") || "of"}{" "}
//             <span className="font-medium">{parentCategories.length}</span>{" "}
//             {t("results") || "results"}
//           </div> */}

//           {/* Items per page selector */}
//           <div className="flex items-center gap-2 text-sm">
//             <span className="text-gray-700">
//               {t("Items per page")}:
//             </span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => handleItemsPerPageChange(e.target.value)}
//               className="px-8 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-6">
//           {/* Previous Button */}
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <span className="sr-only">{t("previous") || "Previous"}</span>
//             <ChevronLeft className="w-5 h-5" />
//           </button>

//           {/* Page Numbers */}
//           {pageNumbers.map((page, index) => (
//             <button
//               key={index}
//               onClick={() => typeof page === "number" && handlePageChange(page)}
//               disabled={page === "..."}
//               className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                 page === currentPage
//                   ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                   : page === "..."
//                   ? "border-gray-300 bg-white text-gray-700 cursor-default"
//                   : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//               }`}
//             >
//               {page}
//             </button>
//           ))}

//           {/* Next Button */}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <span className="sr-only">{t("next") || "Next"}</span>
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </nav>
//       </div>
//     );
//   };

//   // ✅ Loading state - only show spinner if no data AND initial loading
//   if (
//     (loading && !parentCategories?.length) ||
//     (status === "loading" && !parentCategories?.length)
//   ) {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">
//               {t("loadingCategories") || "Loading categories..."}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ✅ Error state
//   if (status === "failed") {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="text-red-500 mb-4">
//               <svg
//                 className="w-16 h-16 mx-auto"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-600 mb-2">
//               {t("errorLoadingCategories") || "Error Loading Categories"}
//             </h3>
//             <p className="text-gray-500 mb-6">
//               {error ||
//                 t("somethingWentWrong") ||
//                 "Something went wrong. Please try again."}
//             </p>
//             <button
//               onClick={() => {
//                 if (documentTypeId) {
//                   dispatch(getParentCategories(documentTypeId));
//                 }
//               }}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
//             >
//               {t("retry") || "Retry"}
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section>
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header with Document Type Selector */}
//           <div className="px-2 py-5 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {t("categories") || "Categories"}
//                 </h2>
//                 {documentTypeId && (
//                   <p className="text-gray-600 text-sm mt-1">
//                     {t("manageCategories") ||
//                       "Manage categories for selected document type"}
//                     {hasAnyFiles && (
//                       <span className="ml-2 text-blue-600 font-medium">
//                         • {totalFilesCount}{" "}
//                         {t("filesSelected") || "files selected"}
//                       </span>
//                     )}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//                 {/* Scanners Selector */}
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                   <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
//                     {t("scanner") || "Scanner"}:
//                   </label>
//                   <select
//                     value={scannerId || ""}
//                     onChange={(e) => handleScannerChange(e.target.value)}
//                     className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
//                   >
//                     <option value="" className="text-sm">
//                       {t("selectScanner") || "Select Scanner"}
//                     </option>
//                     {staticScanners.map((scanner) => (
//                       <option
//                         key={scanner.id}
//                         value={scanner.id}
//                         className="text-sm"
//                       >
//                         {scanner.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//               </div>
//             </div>
//           </div>

//           {/* Content - 2-Column Layout with Tabs on Right */}
//           <div className="min-h-[600px]">
//             <div className="flex">
//               {/* Left Side - Categories Table */}
//               <div
//                 className={`${
//                   hasAnyFiles ? "w-1/2" : "w-full"
//                 } transition-all duration-300 overflow-x-auto ${
//                   hasAnyFiles ? "border-r border-gray-200" : ""
//                 }`}
//               >
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50 sticky top-0 z-10">
//                     <tr>
//                       <th
//                         scope="col"
//                         colSpan={2}
//                         className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {t("categoryName") || "Category Name"}
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-10 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {t("actions") || "Actions"}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {showAddForm["root"] && renderAddForm("root")}

//                     {(() => {
//                       if (
//                         documentTypeId &&
//                         parentCategories &&
//                         parentCategories.length > 0
//                       ) {
//                         // ✅ Use paginated categories instead of all categories
//                         return renderRows(paginatedCategories);
//                       } else {
//                         return (
//                           <tr>
//                             <td colSpan={3} className="p-0">
//                               {renderEmptyState()}
//                             </td>
//                           </tr>
//                         );
//                       }
//                     })()}
//                   </tbody>
//                 </table>

//                 {/* ✅ Add pagination component */}
//                 {renderPagination()}
//               </div>

//               {/* Right Side - Tabbed Panel (Files / Preview) */}
//               {renderRightPanel()}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// DocumentCategoryTable.defaultProps = {
//   currentDocTypeId: null,
//   docTypesList: [],
// };

// export default React.memo(DocumentCategoryTable);

/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
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
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryChilds,
  getParentCategories,
} from "../documentViewerThunk";
import {
  addFilesToCategory,
  removeFilesFromCategory,
  clearAllFiles,
} from "../documentViewerSlice";

const DocumentCategoryTable = ({ currentDocTypeId, docTypesList }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const staticScanners = [
    { id: 1, name: "HP ScanJet Pro 3000" },
    { id: 2, name: "Canon imageFORMULA DR-C225" },
    { id: 3, name: "Epson WorkForce ES-500W" },
    { id: 4, name: "Fujitsu ScanSnap iX1600" },
    { id: 5, name: "Brother ADS-2700W" },
  ];

  // Local state
  const [documentTypeId, setDocumentTypeId] = useState(
    currentDocTypeId || null
  );
  const [scannerId, setScannerId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [newCategoryName, setNewCategoryName] = useState({});
  const [loading, setLoading] = useState(false);
  const [childLoading, setChildLoading] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState({});
  const [previewFiles, setPreviewFiles] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]); // ✅ NEW: Store uploaded files for backend

  // Right panel state
  const [rightPanelTab, setRightPanelTab] = useState("files");
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

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

  // ✅ SIMPLIFIED: Clear loading when Redux fetch completes
  useEffect(() => {
    // When Redux finishes loading, clear the local loading for that specific parent
    if (!childCategoriesLoading && currentChildrenParentId !== null) {
      setChildLoading((prev) => ({
        ...prev,
        [currentChildrenParentId]: false,
      }));
    }
  }, [childCategoriesLoading, currentChildrenParentId]);

  // ✅ Additional safety: Clear loading when children data appears
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

  // ✅ Sync previewFiles to Redux whenever files are added or removed
  useEffect(() => {
    // Update Redux store with files from each category (only serializable metadata)
    Object.entries(previewFiles).forEach(([categoryId, previewData]) => {
      const filesForRedux = previewData.files.map((fileData) => ({
        name: fileData.name,
        type: fileData.type,
        size: fileData.size,
        lastModified: fileData.lastModified,
        // Note: File object is kept in local state (previewFiles) only, not in Redux
      }));

      dispatch(
        addFilesToCategory({
          categoryId: parseInt(categoryId),
          files: filesForRedux,
        })
      );
    });

    // Remove categories from Redux that are no longer in previewFiles
    // This handles the case when files are removed from a category
  }, [previewFiles, dispatch]);

  // Handle document type selection
  const handleDocumentTypeChange = (selectedDocTypeId) => {
    const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
    setDocumentTypeId(docTypeId);

    // Clear previous data when changing document type
    setExpanded({});
    setShowAddForm({});
    setNewCategoryName({});
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
  const handleScannerChange = (selectedScannerId) => {
    const scanId = selectedScannerId ? parseInt(selectedScannerId) : null;
    setScannerId(scanId);
  };

  // ✅ NEW: Pagination handlers
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

  // Handle file selection
  const handleFileSelect = (categoryId, categoryName) => {
    if (!documentTypeId) {
      alert(t("selectDocTypeFirst") || "Please select a document type first");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";

    fileInput.onchange = (e) => {
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

  // Cancel file upload
  const handleCancelUpload = (categoryId) => {
    const previewData = previewFiles[categoryId];

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

    // ✅ Remove files from Redux store
    dispatch(removeFilesFromCategory({ categoryId: parseInt(categoryId) }));
  };

  // Remove individual file from preview
  const handleRemoveFile = (categoryId, fileIndex) => {
    setPreviewFiles((prev) => {
      const previewData = prev[categoryId];
      if (!previewData) return prev;

      const updatedFiles = [...previewData.files];
      const removedFile = updatedFiles[fileIndex];

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

  // ✅ Helper function to prepare files for backend submission
  const prepareFilesForBackend = () => {
    const formData = new FormData();

    // Add document type and metadata as JSON from Redux
    formData.append("documentTypeId", completeJsonData.documentTypeId);
    formData.append("documentType", completeJsonData.documentType);
    formData.append("metadata", JSON.stringify(completeJsonData.metadata));
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("uploadedFiles") || "Uploaded Files"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {totalFilesCount} {t("filesSelected") || "files selected"}
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
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() =>
                                        handleShowFilePreview(
                                          categoryId,
                                          fileData
                                        )
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
                      "Select a file from the files tab to preview"}
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(t("scanInitiated") || "Scan initiated!");
                }}
                disabled={!documentTypeId || isUploading || !scannerId}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={
                  !scannerId
                    ? t("selectScannerFirst") || "Please select a scanner first"
                    : !documentTypeId
                    ? t("selectDocTypeFirst") ||
                      "Please select a document type first"
                    : `Scan to ${item.name}`
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
                    ? t("selectDocTypeFirst") ||
                      "Please select a document type first"
                    : `Upload files to ${item.name}`
                }
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">{t("uploadFiles") || "Upload"}</span>
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
            {t("noDocTypeSelected") || "No Document Type Selected"}
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
          {t("No Categories Found")}
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
                      placeholder={
                        t("Search by Parent categories")
                      }
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
        </div>
      </section>
    </>
  );
};

DocumentCategoryTable.defaultProps = {
  currentDocTypeId: null,
  docTypesList: [],
};

export default React.memo(DocumentCategoryTable);
