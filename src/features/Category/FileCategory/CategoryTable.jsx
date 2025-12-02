// /* eslint-disable react/prop-types */
// import React, { useEffect, useState, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
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
// import {
//   fetchCategoryChilds,
//   getParentCategories,
//   createCategory,
// } from "../categoryThunks";

// const CategoryTable = ({
//   onCategoryUpdate,
//   initialCategories,
//   docTypesList,
// }) => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   // Redux selectors
//   const {
//     categoryData: { documentTypeId },
//     parentCategories,
//     childCategories,
//     loading,
//     childLoading,
//     error,
//   } = useSelector((state) => state.categoryReducer);

//   const { securityLevel, aclRules } = useSelector(
//     (state) => state.categoryReducer.categoryData
//   );

//   useEffect(() => {
//     if (securityLevel > 0) {
//       console.log(securityLevel);
//     }
//     if (aclRules.length > 0) {
//       console.log(aclRules);
//     }
//   }, [securityLevel, aclRules]);

//   // Static scanners (as requested to keep static)
//   const staticScanners = [
//     { id: 1, name: "HP ScanJet Pro 3000" },
//     { id: 2, name: "Canon imageFORMULA DR-C225" },
//     { id: 3, name: "Epson WorkForce ES-500W" },
//     { id: 4, name: "Fujitsu ScanSnap iX1600" },
//     { id: 5, name: "Brother ADS-2700W" },
//   ];

//   // Local component state
//   const [scannerId, setScannerId] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [showAddForm, setShowAddForm] = useState({});
//   const [newCategoryName, setNewCategoryName] = useState({});
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState(null);

//   // Upload and preview state
//   const [uploadLoading, setUploadLoading] = useState({});
//   const [previewFiles, setPreviewFiles] = useState({});
//   const [rightPanelTab, setRightPanelTab] = useState("files");
//   const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
//   const [currentCategoryId, setCurrentCategoryId] = useState(null);

//   // Effect to fetch parent categories when document type changes
//   useEffect(() => {
//     if (documentTypeId) {
//       console.log(
//         "Fetching parent categories for document type:",
//         documentTypeId
//       );
//       dispatch(getParentCategories(documentTypeId));
//     }
//   }, [documentTypeId, dispatch]);

//   // Handle scanner selection
//   const handleScannerChange = (selectedScannerId) => {
//     const scanId = selectedScannerId ? parseInt(selectedScannerId) : null;
//     setScannerId(scanId);
//     console.log("Scanner selected:", scanId);
//   };

//   // Collapse all children recursively
//   const collapseChildrenRecursively = useCallback(
//     (parentId) => {
//       const children = childCategories[parentId] || [];
//       children.forEach((child) => {
//         setExpanded((prev) => ({ ...prev, [child.id]: false }));
//         collapseChildrenRecursively(child.id);
//       });
//     },
//     [childCategories]
//   );

//   // Toggle expand/collapse and fetch children if needed
//   const toggleExpand = useCallback(
//     async (item, level = 0) => {
//       const { id } = item;
//       const isCurrentlyExpanded = expanded[id];

//       if (!isCurrentlyExpanded) {
//         // Expanding logic
//         if (level === 0) {
//           // For parent categories: collapse all others first
//           Object.keys(expanded).forEach((expandedId) => {
//             if (expanded[expandedId]) {
//               collapseChildrenRecursively(parseInt(expandedId));
//             }
//           });
//           setExpanded({ [id]: true });
//         } else {
//           // For child categories: just expand this one
//           setExpanded((prev) => ({ ...prev, [id]: true }));
//         }
//       } else {
//         // Collapsing: close this item and all its children
//         collapseChildrenRecursively(id);
//         setExpanded((prev) => ({ ...prev, [id]: false }));
//       }
//     },
//     [expanded, collapseChildrenRecursively]
//   );

//   // Toggle add form visibility
//   const toggleAddForm = useCallback(
//     (categoryId) => {
//       if (!documentTypeId) {
//         alert(
//           t("pleaseSelectDocTypeFirst") || "Please select a document type first"
//         );
//         return;
//       }

//       setShowAddForm((prev) => {
//         const allClosed = Object.keys(prev).reduce((acc, key) => {
//           acc[key] = false;
//           return acc;
//         }, {});
//         return { ...allClosed, [categoryId]: !prev[categoryId] };
//       });

//       setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
//       setCreateError(null);
//     },
//     [documentTypeId, t]
//   );

//   // Handle adding a new category
//   const handleAddCategory = useCallback(
//     async (parentCategoryId = null) => {
//       const categoryKey = parentCategoryId || "root";
//       const categoryName = newCategoryName[categoryKey];

//       if (!categoryName?.trim()) {
//         alert(t("pleaseEnterCategoryName") || "Please enter a category name");
//         return;
//       }

//       if (!documentTypeId) {
//         alert(
//           t("pleaseSelectDocTypeFirst") || "Please select a document type first"
//         );
//         return;
//       }

//       setCreateLoading(true);
//       setCreateError(null);

//       try {
//         const categoryData = {
//           name: categoryName.trim(),
//           documentTypeId: documentTypeId,
//           parentCategoryId: parentCategoryId,
//           securityLevel: securityLevel,
//           aclRules: aclRules,
//         };

//         await dispatch(createCategory(categoryData)).unwrap();

//         // Reset form state
//         setShowAddForm({});
//         setNewCategoryName({});

//         // Refresh parent categories or child categories as needed
//         if (parentCategoryId === null) {
//           dispatch(getParentCategories(documentTypeId));
//         } else {
//           dispatch(fetchCategoryChilds(parentCategoryId));
//         }
//       } catch (error) {
//         console.error("Error creating category:", error);
//         setCreateError(error.message || "Failed to create category");
//       } finally {
//         setCreateLoading(false);
//       }
//     },
//     [newCategoryName, documentTypeId, dispatch, t]
//   );

//   // Handle input change for category name
//   const handleInputChange = useCallback((categoryId, value) => {
//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
//   }, []);

//   // File handling functions
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

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const handleFileSelect = (categoryId, categoryName) => {
//     if (!documentTypeId) {
//       alert(
//         t("pleaseSelectDocTypeFirst") || "Please select a document type first"
//       );
//       return;
//     }

//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.multiple = true;
//     fileInput.accept = ".pdf,.xls,.xlsx,.jpg,.jpeg,.png";

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

//   const handleUploadConfirmed = (categoryId) => {
//     const previewData = previewFiles[categoryId];
//     if (!previewData || previewData.files.length === 0) return;

//     setUploadLoading((prev) => ({ ...prev, [categoryId]: true }));

//     // Simulate upload process - replace with actual API call
//     setTimeout(() => {
//       setUploadLoading((prev) => ({ ...prev, [categoryId]: false }));

//       alert(
//         t("filesUploadedSuccess", {
//           count: previewData.files.length,
//           category: previewData.categoryName,
//         }) ||
//           `Successfully uploaded ${previewData.files.length} file(s) to "${previewData.categoryName}"`
//       );

//       // Clean up object URLs
//       previewData.files.forEach((fileData) => {
//         if (fileData.url) {
//           URL.revokeObjectURL(fileData.url);
//         }
//       });

//       // Clear preview
//       setPreviewFiles((prev) => {
//         const newPreviewFiles = { ...prev };
//         delete newPreviewFiles[categoryId];
//         return newPreviewFiles;
//       });
//     }, 1500);
//   };

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

//   const handleShowFilePreview = (categoryId, fileData) => {
//     setCurrentPreviewFile(fileData);
//     setCurrentCategoryId(categoryId);
//     setRightPanelTab("preview");
//   };

//   const handleBackToFiles = () => {
//     setRightPanelTab("files");
//   };

//   const handleDownloadFile = (fileData) => {
//     const link = document.createElement("a");
//     link.href = fileData.url;
//     link.download = fileData.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Utility functions
//   const hasAnyFiles = Object.keys(previewFiles).length > 0;
//   const totalFilesCount = Object.values(previewFiles).reduce(
//     (sum, data) => sum + data.files.length,
//     0
//   );

//   // Render add form
//   const renderAddForm = (categoryId) => {
//     if (!showAddForm[categoryId]) return null;

//     return (
//       <tr key={`add-form-${categoryId}`} className="bg-gray-50">
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

//   // Render category rows recursively
//   const renderRows = (items, level = 0) => {
//     return items.flatMap((item) => {
//       const { id } = item;
//       const children = childCategories[id] || [];
//       const hasChildren = item.hasChildren || children.length > 0;
//       const isOpen = expanded[id];
//       const isLoadingChildren = childLoading[id];
//       const isUploading = uploadLoading[id];
//       const hasFiles = previewFiles[id];

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
//               onClick={() => {
//                 // Dispatch fetchCategoryChilds when clicking on table row
//                 dispatch(fetchCategoryChilds(id));
//                 toggleExpand(item, level);
//               }}
//             >
//               {/* Expand/Collapse Icon */}
//               {hasChildren ? (
//                 isOpen ? (
//                   <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 )
//               ) : (
//                 <div className="w-4 h-4 flex-shrink-0" />
//               )}

//               {/* Folder Icon */}
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

//               {/* {isLoadingChildren && (
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
//               {/* Add Subcategory Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleAddForm(id);
//                 }}
//                 disabled={!documentTypeId}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={t("addSubcategory") || "Add subcategory"}
//               >
//                 <Plus className="w-4 h-4" />
//                 <span className="text-sm">{t("add") || "Add"}</span>
//               </button>

//               {/* Scan Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   console.log(
//                     `Scan initiated for category ${id} with scanner ${scannerId}`
//                   );
//                   alert(
//                     t("scanInitiated") || `Scan initiated for "${item.name}"`
//                   );
//                 }}
//                 disabled={!documentTypeId || isUploading || !scannerId}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={
//                   !scannerId
//                     ? t("selectScannerFirst") || "Select scanner first"
//                     : !documentTypeId
//                     ? t("selectDocTypeFirst") || "Select document type first"
//                     : t("scanToCategory", { category: item.name }) ||
//                       `Scan to ${item.name}`
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
//                     ? t("selectDocTypeFirst") || "Select document type first"
//                     : t("uploadFilesToCategory", { category: item.name }) ||
//                       `Upload files to ${item.name}`
//                 }
//               >
//                 <Upload className="w-4 h-4" />
//                 <span className="text-sm">{t("uploadFiles") || "Upload"}</span>
//               </button>
//             </div>
//           </td>
//         </tr>,
//       ];

//       // Add form row if shown
//       if (showAddForm[id]) {
//         rows.push(renderAddForm(id));
//       }

//       // Add children rows if expanded
//       if (isOpen) {
//         if (isLoadingChildren) {
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
//         } else if (children.length > 0) {
//           rows.push(...renderRows(children, level + 1));
//         } else {
//           rows.push(
//             <tr key={`empty-${id}`} className="bg-gray-50">
//               <td
//                 colSpan={3}
//                 className="px-6 py-4 text-center text-gray-500 italic"
//               >
//                 <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
//                   <span className="text-sm">
//                     {t("noChildCategories") || "No child categories found"}
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

//   // Render right panel with file management
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

//                       <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center gap-2">
//                         <button
//                           onClick={() => handleUploadConfirmed(categoryId)}
//                           disabled={uploadLoading[categoryId]}
//                           className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
//                         >
//                           {uploadLoading[categoryId] ? (
//                             <>
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                               <span>{t("uploading") || "Uploading..."}</span>
//                             </>
//                           ) : (
//                             <>
//                               <Upload className="w-4 h-4" />
//                               <span>{t("Save") || "Save"}</span>
//                             </>
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleCancelUpload(categoryId)}
//                           disabled={uploadLoading[categoryId]}
//                           className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
//                         >
//                           {t("cancel") || "Cancel"}
//                         </button>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="h-full flex flex-col bg-white">
//               {currentPreviewFile && currentCategoryId ? (
//                 <>
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
//                             "Preview is not available for this file type"}
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

//                   <div className="bg-gray-50 border-t border-gray-200 p-3 flex-shrink-0">
//                     <div className="text-xs text-gray-600">
//                       <p>
//                         <span className="font-medium">Last modified:</span>{" "}
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
//                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
//                   <Eye className="w-20 h-20 text-gray-300 mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                     {t("noFileSelected") || "No File Selected"}
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     {t("selectFileToPreview") ||
//                       "Click the preview button on any file to view it here"}
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

//   // Render empty state
//   const renderEmptyState = () => {
//     if (!documentTypeId) {
//       return (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <Folder className="w-16 h-16 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             {t("No Document Type Selected")}
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {t("selectDocTypeFromDropdown") ||
//               "Please select a document type from the dropdown above to view categories"}
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

//   // Loading state
//   if (loading && documentTypeId) {
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

//   return (
//     <section className="">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="px-2 py-5 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {t("categories") || "Categories"}
//               </h2>
//               {documentTypeId && (
//                 <p className="text-gray-600 text-sm mt-1">
//                   {t("manageCategoriesFor") ||
//                     "Manage categories for selected document type"}
//                   {hasAnyFiles && (
//                     <span className="ml-2 text-blue-600 font-medium">
//                       • {totalFilesCount}{" "}
//                       {t("filesSelected") || "file(s) selected"}
//                     </span>
//                   )}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//               {/* Scanner Selector */}
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
//                   {t("scanner") || "Scanner"}:
//                 </label>
//                 <select
//                   value={scannerId || ""}
//                   onChange={(e) => handleScannerChange(e.target.value)}
//                   className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
//                 >
//                   <option value="" className="text-sm">
//                     {t("selectScanner") || "Select Scanner"}
//                   </option>
//                   {staticScanners.map((scanner) => (
//                     <option
//                       key={scanner.id}
//                       value={scanner.id}
//                       className="text-sm"
//                     >
//                       {scanner.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Add Root Category Button */}
//               <button
//                 onClick={() => toggleAddForm("root")}
//                 disabled={!documentTypeId}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") || "Select document type first"
//                     : t("addRootCategory") || "Add root category"
//                 }
//               >
//                 <Plus className="w-5 h-5" />
//                 <span className="text-sm">
//                   {t("addRootCategory") || "Add Root Category"}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="min-h-[600px]">
//           <div className="flex">
//             {/* Left Side - Categories Table */}
//             <div
//               className={`${
//                 hasAnyFiles ? "w-1/2" : "w-full"
//               } transition-all duration-300 overflow-x-auto ${
//                 hasAnyFiles ? "border-r border-gray-200" : ""
//               }`}
//             >
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th
//                       scope="col"
//                       colSpan={2}
//                       className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       {t("categoryName") || "Category Name"}
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-1 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       {t("actions") || "Actions"}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {showAddForm["root"] && renderAddForm("root")}

//                   {documentTypeId &&
//                   parentCategories &&
//                   parentCategories.length > 0 ? (
//                     renderRows(parentCategories)
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="p-0">
//                         {renderEmptyState()}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Right Side - Tabbed Panel */}
//             {renderRightPanel()}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// CategoryTable.defaultProps = {
//   currentDocTypeId: null,
//   docTypesList: [],
// };

// export default React.memo(CategoryTable);

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import {
  fetchCategoryChilds,
  getParentCategories,
  createCategory,
} from "../categoryThunks";

const CategoryTable = ({
  onCategoryUpdate,
  initialCategories,
  docTypesList,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Redux selectors
  const {
    categoryData: { documentTypeId },
    parentCategories,
    childCategories,
    loading,
    childLoading,
    error,
  } = useSelector((state) => state.categoryReducer);

  const { securityLevel, aclRules } = useSelector(
    (state) => state.categoryReducer.categoryData
  );

  useEffect(() => {
    if (securityLevel > 0) {
      console.log(securityLevel);
    }
    if (aclRules.length > 0) {
      console.log(aclRules);
    }
  }, [securityLevel, aclRules]);

  // Local component state
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [newCategoryName, setNewCategoryName] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // Effect to fetch parent categories when document type changes
  useEffect(() => {
    if (documentTypeId) {
      console.log(
        "Fetching parent categories for document type:",
        documentTypeId
      );
      dispatch(getParentCategories(documentTypeId));
    }
  }, [documentTypeId, dispatch]);

  // Collapse all children recursively
  const collapseChildrenRecursively = useCallback(
    (parentId) => {
      const children = childCategories[parentId] || [];
      children.forEach((child) => {
        setExpanded((prev) => ({ ...prev, [child.id]: false }));
        collapseChildrenRecursively(child.id);
      });
    },
    [childCategories]
  );

  // Toggle expand/collapse and fetch children if needed
  const toggleExpand = useCallback(
    async (item, level = 0) => {
      const { id } = item;
      const isCurrentlyExpanded = expanded[id];

      if (!isCurrentlyExpanded) {
        // Expanding logic
        if (level === 0) {
          // For parent categories: collapse all others first
          Object.keys(expanded).forEach((expandedId) => {
            if (expanded[expandedId]) {
              collapseChildrenRecursively(parseInt(expandedId));
            }
          });
          setExpanded({ [id]: true });
        } else {
          // For child categories: just expand this one
          setExpanded((prev) => ({ ...prev, [id]: true }));
        }
      } else {
        // Collapsing: close this item and all its children
        collapseChildrenRecursively(id);
        setExpanded((prev) => ({ ...prev, [id]: false }));
      }
    },
    [expanded, collapseChildrenRecursively]
  );

  // Toggle add form visibility
  const toggleAddForm = useCallback(
    (categoryId) => {
      if (!documentTypeId) {
        alert(
          t("pleaseSelectDocTypeFirst") || "Please select a document type first"
        );
        return;
      }

      setShowAddForm((prev) => {
        const allClosed = Object.keys(prev).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        return { ...allClosed, [categoryId]: !prev[categoryId] };
      });

      setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
      setCreateError(null);
    },
    [documentTypeId, t]
  );

  // Handle adding a new category
  const handleAddCategory = useCallback(
    async (parentCategoryId = null) => {
      const categoryKey = parentCategoryId || "root";
      const categoryName = newCategoryName[categoryKey];

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

      try {
        const categoryData = {
          name: categoryName.trim(),
          documentTypeId: documentTypeId,
          parentCategoryId: parentCategoryId,
          securityLevel: securityLevel,
          aclRules: aclRules,
        };

        await dispatch(createCategory(categoryData)).unwrap();

        // Reset form state
        setShowAddForm({});
        setNewCategoryName({});

        // Refresh parent categories or child categories as needed
        if (parentCategoryId === null) {
          dispatch(getParentCategories(documentTypeId));
        } else {
          dispatch(fetchCategoryChilds(parentCategoryId));
        }
      } catch (error) {
        console.error("Error creating category:", error);
        setCreateError(error.message || "Failed to create category");
      } finally {
        setCreateLoading(false);
      }
    },
    [newCategoryName, documentTypeId, dispatch, t]
  );

  // Handle input change for category name
  const handleInputChange = useCallback((categoryId, value) => {
    setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
  }, []);

  // Render add form
  const renderAddForm = (categoryId) => {
    if (!showAddForm[categoryId]) return null;

    return (
      <tr key={`add-form-${categoryId}`} className="bg-gray-50">
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

  // Render category rows recursively
  const renderRows = (items, level = 0) => {
    return items.flatMap((item) => {
      const { id } = item;
      const children = childCategories[id] || [];
      const hasChildren = item.hasChildren || children.length > 0;
      const isOpen = expanded[id];
      const isLoadingChildren = childLoading[id];

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
              onClick={() => {
                // Dispatch fetchCategoryChilds when clicking on table row
                dispatch(fetchCategoryChilds(id));
                toggleExpand(item, level);
              }}
            >
              {/* Expand/Collapse Icon */}
              {hasChildren ? (
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

              {/* {isLoadingChildren && (
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                  <span className="text-xs">
                    {t("loading") || "Loading..."}
                  </span>
                </div>
              )} */}
            </div>
          </td>
          <td className="py-4 px-6 whitespace-nowrap text-right">
            <div className="flex items-center gap-2 justify-end">
              {/* Add Subcategory Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAddForm(id);
                }}
                disabled={!documentTypeId}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={t("addSubcategory") || "Add subcategory"}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">{t("add") || "Add"}</span>
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
        } else if (children.length > 0) {
          rows.push(...renderRows(children, level + 1));
        } else {
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

  // Render right panel with file management

  // Render empty state
  const renderEmptyState = () => {
    if (!documentTypeId) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Folder className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("No Document Type Selected")}
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

  return (
    <section className="">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-2 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("categories") || "Categories"}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Add Root Category Button */}
              <button
                onClick={() => toggleAddForm("root")}
                disabled={!documentTypeId}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
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

        {/* Content */}
        <div className="min-h-[600px]">
          <div className="flex">
            {/* Left Side - Categories Table */}
            <div
              className={`${"w-full"} transition-all duration-300 overflow-x-auto  `}
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
                  {showAddForm["root"] && renderAddForm("root")}

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
          </div>
        </div>
      </div>
    </section>
  );
};

CategoryTable.defaultProps = {
  currentDocTypeId: null,
  docTypesList: [],
};

export default React.memo(CategoryTable);
